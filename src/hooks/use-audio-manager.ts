import { useEffect, useRef, useState, memo } from "react";
import { useLiveAPIContext } from "../contexts/LiveAPIContext";
import { AudioRecorder } from "../lib/audio-recorder";

// Type definition for audio data callback
export type AudioDataCallback = (data: {
  conversation_id: string;
  role: 'user' | 'model';
  audio_data: string;
  transcript?: string;
  timestamp: string;
}) => Promise<any>;

// Base64 utilities for properly combining audio chunks
function base64ToArrayBuffer(base64: string): Uint8Array {
  try {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Error decoding base64:', error);
    return new Uint8Array(0);
  }
}

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return window.btoa(binary);
}

function combineBase64AudioChunks(chunks: string[]): string {
  if (chunks.length === 0) return '';
  if (chunks.length === 1) return chunks[0];
  
  try {
    // Calculate total length needed
    const totalLength = chunks.reduce((sum, chunk) => {
      try {
        return sum + base64ToArrayBuffer(chunk).length;
      } catch (e) {
        console.error('Invalid base64 chunk:', e);
        return sum;
      }
    }, 0);
    
    // Create a combined buffer
    const combined = new Uint8Array(totalLength);
    
    // Copy all chunks into the combined buffer
    let offset = 0;
    for (const chunk of chunks) {
      try {
        const bytes = base64ToArrayBuffer(chunk);
        combined.set(bytes, offset);
        offset += bytes.length;
      } catch (e) {
        console.error('Error processing chunk:', e);
      }
    }
    
    // Convert back to base64
    return arrayBufferToBase64(combined);
  } catch (error) {
    console.error('Error combining audio chunks:', error);
    return '';
  }
}

// Constants for speech detection
const VOLUME_THRESHOLD = 0.01;  // Minimum volume to consider as speech
const SILENCE_TIMEOUT_MS = 800; // How long to wait after silence before stopping collection

type UseAudioManagerParams = {
  muted: boolean;
  conversationId?: string;
  onAudioData?: AudioDataCallback;
};

export function useAudioManager({ 
  muted, 
  conversationId,
  onAudioData
}: UseAudioManagerParams) {

  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const { client, connected, volume } = useLiveAPIContext();
  
  // Audio buffer state refs
  const userAudioBufferRef = useRef<string[]>([]);
  const isCollectingUserAudioRef = useRef<boolean>(false);
  const lastAudioTimestampRef = useRef<number>(Date.now());
  const lastAgentAudioRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  
  // Transcription refs
  const accumulatedUserTranscriptRef = useRef<string>('');
  const accumulatedAgentTranscriptRef = useRef<string>('');
  
  // Processing flags
  const isProcessingTurnCompleteRef = useRef(false);
  const isProcessingAgentAudioRef = useRef(false);
  
  // Speech detection refs
  const isSpeechDetectedRef = useRef(false);
  const silenceTimeoutRef = useRef<number | null>(null);

  // Keep the ref updated with the latest conversationId
  useEffect(() => {
    conversationIdRef.current = conversationId || null;
  }, [conversationId]);

  useEffect(() => {
    return () => {
      console.log("[useAudioManager] UNMOUNTED");
    };
  }, []);

  // Handle user audio recording with in-memory buffer
  useEffect(() => {
    // Track user audio for saving
    const userAudioBuffer = userAudioBufferRef.current;
    
    const onVolume = (volume: number) => {
      setInVolume(volume);
      
      // Only process when connected and not muted
      if (!connected || muted) return;
      
      // Voice activity detection
      if (volume > VOLUME_THRESHOLD) {
        // Clear any silence timeout
        if (silenceTimeoutRef.current !== null) {
          window.clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        
        // Start speech collection if not already started
        if (!isSpeechDetectedRef.current) {
          isSpeechDetectedRef.current = true;
        }
      } else if (isSpeechDetectedRef.current && silenceTimeoutRef.current === null) {
        // Start silence timeout when volume drops below threshold
        silenceTimeoutRef.current = window.setTimeout(() => {
          if (isCollectingUserAudioRef.current) {
            isSpeechDetectedRef.current = false;
            silenceTimeoutRef.current = null;
          }
        }, SILENCE_TIMEOUT_MS);
      }
    };
    
    const onData = (base64: string) => {
      // Always send to real-time API regardless of speech detection
      try {
        client.sendRealtimeInput([
          { mimeType: "audio/pcm;rate=16000", data: base64 }
        ]);
        
        // Only collect audio when speech is detected
        if (connected && !muted && isSpeechDetectedRef.current) {
          if (!isCollectingUserAudioRef.current) {
            isCollectingUserAudioRef.current = true;
          }
          userAudioBuffer.push(base64);
          lastAudioTimestampRef.current = Date.now();
        }
      } catch (error) {
        console.error("[useAudioManager] Error sending audio data:", error);
      }
    };
    
    // Handle agent's first audio response as signal to save user audio
    const onUserTurnComplete = async () => {
      // Reset voice activity detection state
      isSpeechDetectedRef.current = false;
      if (silenceTimeoutRef.current !== null) {
        window.clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      // Prevent duplicate processing
      if (isProcessingTurnCompleteRef.current) {
        return;
      }
      
      if (!isCollectingUserAudioRef.current) {
        return;
      }
      
      if (!conversationIdRef.current) {
        return;
      }
      
      // Set processing flag
      isProcessingTurnCompleteRef.current = true;
      
      try {
        // Check if we have recent audio worth saving
        const timeSinceLastAudio = Date.now() - lastAudioTimestampRef.current;
        
        if (userAudioBuffer.length === 0 || timeSinceLastAudio > 5000) {
          userAudioBuffer.length = 0;
          isCollectingUserAudioRef.current = false;
          isProcessingTurnCompleteRef.current = false;
          return;
        }
        
        // Make a copy of the buffer to prevent concurrent modification
        const bufferToSave = [...userAudioBuffer];
        
        // Clear the buffer immediately to prevent double-saving
        userAudioBuffer.length = 0;
        isCollectingUserAudioRef.current = false;
        
        // Combine audio chunks properly
        const completeUtterance = combineBase64AudioChunks(bufferToSave);
        
        // Only call onAudioData if available
        if (onAudioData && conversationIdRef.current) {
          await onAudioData({
            conversation_id: conversationIdRef.current,
            role: 'user',
            audio_data: completeUtterance,
            transcript: accumulatedUserTranscriptRef.current.trim() || undefined,
            timestamp: new Date().toISOString()
          });
          
          // Reset transcript only after successfully sending data
          accumulatedUserTranscriptRef.current = '';
        }
      } catch (error) {
        console.error('[useAudioManager] Error processing user audio:', error);
      } finally {
        // Always reset the processing flag
        isProcessingTurnCompleteRef.current = false;
      }
    };
    
    // Setup audio recording
    if (connected && !muted) {
      audioRecorder.start()
        .then(() => {
          // Audio recorder started successfully
        })
        .catch(err => {
          console.error("[useAudioManager] Audio recording error:", {
            error: err.message,
            name: err.name
          });
        });
        
      audioRecorder
        .on("data", onData)
        .on("volume", onVolume);
      
      // Listen for agent response to finalize user audio
      client.on("user_turn_complete", onUserTurnComplete);
    } else {
      // Stop audio recording
      audioRecorder.stop();
      audioRecorder
        .off("data", onData)
        .off("volume", onVolume);
        
      userAudioBuffer.length = 0;
      isCollectingUserAudioRef.current = false;
      isProcessingTurnCompleteRef.current = false;
      
      // Reset voice activity detection state
      isSpeechDetectedRef.current = false;
      if (silenceTimeoutRef.current !== null) {
        window.clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      client.off("user_turn_complete", onUserTurnComplete);
    }
    
    // Cleanup
    return () => {
      // Clear any pending timeout
      if (silenceTimeoutRef.current !== null) {
        window.clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      audioRecorder
        .off("data", onData)
        .off("volume", onVolume);
      client.off("user_turn_complete", onUserTurnComplete);
    };
  }, [connected, muted, client, audioRecorder, onAudioData]);

  // Buffer agent audio and save on turn complete
  useEffect(() => {
    // Buffer for collecting audio chunks
    let audioBuffer: string[] = [];
    
    // Process and buffer audio
    const onAudio = (data: ArrayBuffer) => {
      if (!conversationIdRef.current) return;
      
      // Convert ArrayBuffer to base64
      const uint8Array = new Uint8Array(data);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64Data = btoa(binary);
      
      // Don't add duplicates
      if (base64Data === lastAgentAudioRef.current) return;
      lastAgentAudioRef.current = base64Data;
      
      // Add to buffer
      audioBuffer.push(base64Data);
    };
    
    // Save buffered audio on turn complete
    const onTurnComplete = async () => {
      if (audioBuffer.length === 0 || !conversationIdRef.current) {
        // Reset accumulated transcript even if no audio to save
        accumulatedAgentTranscriptRef.current = '';
        return;
      }
      
      // Prevent duplicate processing
      if (isProcessingAgentAudioRef.current) {
        return;
      }
      
      // Set the processing flag
      isProcessingAgentAudioRef.current = true;
      
      try {
        // Make a copy to prevent concurrent modification
        const bufferToSave = [...audioBuffer];
        
        // Clear the buffer immediately
        audioBuffer = [];
        
        // Combine all chunks using our proper utility
        const combinedAudio = combineBase64AudioChunks(bufferToSave);
        
        // Ensure agent timestamp is slightly after user message by adding a small delay
        const now = new Date();
        now.setMilliseconds(now.getMilliseconds() + 100);
        
        // Only call onAudioData if available
        if (onAudioData && conversationIdRef.current) {
          await onAudioData({
            conversation_id: conversationIdRef.current,
            role: 'model',
            audio_data: combinedAudio,
            transcript: accumulatedAgentTranscriptRef.current.trim() || undefined,
            timestamp: now.toISOString()
          });
          
          // Reset transcript only after successfully sending data
          accumulatedAgentTranscriptRef.current = '';
        }
      } catch (error) {
        console.error('[useAudioManager] Failed to save agent audio:', error);
      } finally {
        // Always reset the processing flag
        isProcessingAgentAudioRef.current = false;
      }
    };
    
    // Register event listeners
    client.on("audio", onAudio);
    client.on("turncomplete", onTurnComplete);
    
    // Cleanup
    return () => {
      client.off("audio", onAudio);
      client.off("turncomplete", onTurnComplete);
      
      // Save any remaining audio on unmount
      if (audioBuffer.length > 0 && conversationIdRef.current && !isProcessingAgentAudioRef.current) {
        // Use same timestamp adjustment for consistent ordering
        const now = new Date();
        now.setMilliseconds(now.getMilliseconds() + 100);
        
        // Create combined audio once
        const combinedAudio = combineBase64AudioChunks(audioBuffer);
        
        // Only call onAudioData if available
        if (onAudioData && conversationIdRef.current) {
          // Handle potential promise rejection
          onAudioData({
            conversation_id: conversationIdRef.current,
            role: 'model',
            audio_data: combinedAudio,
            transcript: accumulatedAgentTranscriptRef.current.trim() || undefined,
            timestamp: now.toISOString()
          })
          .then(() => {
            // Reset transcript only after successfully sending data
            accumulatedAgentTranscriptRef.current = '';
          })
          .catch(err => console.error('[useAudioManager] Failed to save final audio:', err));
        }
      }
    };
  }, [client, conversationId, onAudioData]);

  // Listen for transcription events
  useEffect(() => {
    const onInputTranscription = (text: string) => {
      // Accumulate user transcript
      accumulatedUserTranscriptRef.current += text;
    };

    const onOutputTranscription = (text: string) => {
      // Accumulate agent transcript
      accumulatedAgentTranscriptRef.current += text;
    };

    // Listen for transcription events
    client.on("inputTranscription", onInputTranscription);
    client.on("outputTranscription", onOutputTranscription);

    return () => {
      client.off("inputTranscription", onInputTranscription);
      client.off("outputTranscription", onOutputTranscription);
    };
  }, [client]);

  return {
    inVolume,
    isSpeaking: isSpeechDetectedRef.current,
    audioRecorder
  };
}