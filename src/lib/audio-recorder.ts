import AudioRecordingWorklet from "./worklets/audio-processing";
import VolMeterWorket from "./worklets/vol-meter";
import { createWorketFromSrc } from "./audioworklet-registry";
import EventEmitter from "eventemitter3";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Create AudioContext directly for better iOS Safari compatibility
async function createAudioContext(sampleRate: number): Promise<AudioContext> {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("AudioContext not supported");
  }

  const context = new AudioContextClass({ sampleRate });

  // Immediately try to resume if suspended (iOS Safari fix)
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch (error: any) {
      console.warn(
        "[AudioRecorder] Failed to resume AudioContext:",
        error.message
      );
    }
  }

  return context;
}

export class AudioRecorder extends EventEmitter {
  stream: MediaStream | undefined;
  audioContext: AudioContext | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  recording: boolean = false;
  recordingWorklet: AudioWorkletNode | undefined;
  vuWorklet: AudioWorkletNode | undefined;
  private starting: Promise<void> | null = null;

  constructor(public sampleRate = 16000) {
    super();

    // Only log debug info if we're in the browser
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      console.log("[AudioRecorder] Initializing:", {
        sampleRate: this.sampleRate,
        isMobile,
        hasMediaDevices: !!navigator.mediaDevices,
        hasAudioContext: !!(
          window.AudioContext || (window as any).webkitAudioContext
        ),
      });
    }
  }

  async start() {
    // ✅ Prevent multiple starts
    if (this.recording) {
      console.log("[AudioRecorder] Already recording, ignoring start request");
      return Promise.resolve();
    }

    // ✅ If already starting, return the existing promise
    if (this.starting) {
      console.log(
        "[AudioRecorder] Already starting, waiting for existing start to complete"
      );
      return this.starting;
    }

    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      throw new Error(
        "AudioRecorder can only be used in a browser environment"
      );
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("MediaDevices API not available");
    }

    console.log("[AudioRecorder] Starting recording...");

    this.starting = new Promise(async (resolve, reject) => {
      try {
        // Use mobile-optimized constraints for better compatibility
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        const audioConstraints: MediaStreamConstraints = {
          audio: isMobile
            ? {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: this.sampleRate,
                channelCount: 1,
              }
            : {
                sampleRate: this.sampleRate,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
        };

        this.stream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        this.audioContext = await createAudioContext(this.sampleRate);

        // Wait a bit for AudioContext to stabilize on iOS
        if (isMobile) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        this.source = this.audioContext.createMediaStreamSource(this.stream);

        const workletName = "audio-recorder-worklet";
        const src = createWorketFromSrc(workletName, AudioRecordingWorklet);
        await this.audioContext.audioWorklet.addModule(src);

        this.recordingWorklet = new AudioWorkletNode(
          this.audioContext,
          workletName
        );
        this.recordingWorklet.port.onmessage = async (ev: MessageEvent) => {
          const arrayBuffer = ev.data.data.int16arrayBuffer;
          if (arrayBuffer) {
            const arrayBufferString = arrayBufferToBase64(arrayBuffer);
            this.emit("data", arrayBufferString);
          }
        };

        this.source.connect(this.recordingWorklet);

        // vu meter worklet
        const vuWorkletName = "vu-meter";
        await this.audioContext.audioWorklet.addModule(
          createWorketFromSrc(vuWorkletName, VolMeterWorket)
        );

        this.vuWorklet = new AudioWorkletNode(this.audioContext, vuWorkletName);
        this.vuWorklet.port.onmessage = (ev: MessageEvent) => {
          this.emit("volume", ev.data.volume);
        };

        this.source.connect(this.vuWorklet);

        // Final check: Ensure AudioContext is running
        if (this.audioContext.state !== "running") {
          try {
            await this.audioContext.resume();
          } catch (finalResumeError: any) {
            console.warn(
              "[AudioRecorder] Final resume attempt failed:",
              finalResumeError.message
            );
          }
        }

        this.recording = true;
        console.log("[AudioRecorder] Recording started successfully");
        resolve();
        this.starting = null;
      } catch (error: any) {
        console.error("[AudioRecorder] Failed to start recording:", {
          error: error.message,
          name: error.name,
        });

        // Provide user-friendly error messages
        if (error.name === "NotAllowedError") {
          const enhancedError = new Error(
            "Microphone access denied. Please allow microphone access and try again."
          );
          enhancedError.name = error.name;
          reject(enhancedError);
        } else if (error.name === "NotFoundError") {
          const enhancedError = new Error(
            "No microphone found. Please connect a microphone and try again."
          );
          enhancedError.name = error.name;
          reject(enhancedError);
        } else if (error.name === "NotReadableError") {
          const enhancedError = new Error(
            "Microphone is already in use by another application."
          );
          enhancedError.name = error.name;
          reject(enhancedError);
        } else if (error.name === "OverconstrainedError") {
          const enhancedError = new Error(
            "Audio constraints not supported by your device. Please try again."
          );
          enhancedError.name = error.name;
          reject(enhancedError);
        } else if (error.name === "AbortError") {
          const enhancedError = new Error(
            "Audio recording was aborted. Please try again."
          );
          enhancedError.name = error.name;
          reject(enhancedError);
        } else {
          reject(error);
        }
        this.starting = null;
      }
    });

    return this.starting;
  }

  stop() {
    try {
      if (this.source) {
        this.source.disconnect();
      }

      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      this.stream = undefined;
      this.recordingWorklet = undefined;
      this.vuWorklet = undefined;
      this.recording = false;

      console.log("[AudioRecorder] Recording stopped successfully");
    } catch (error) {
      console.error("[AudioRecorder] Error during stop:", error);
    }
  }
}
