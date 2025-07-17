import { useInputValueContext } from "@/contexts/InputValueContext";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useIntentDetection } from "@/hooks/use-intent-detection";
import { useVideoManager } from "@/hooks/use-video-manager";
import { Mic } from "lucide-react";
import { useEffect, useRef } from "react";
import { CameraIcon } from "./icons/CameraIcon";
import { CrossIcon } from "./icons/CrossIcon";
import { ScreenRecordingIcon } from "./icons/ScreenRecordingIcon";
import { Button } from "./ui";
import VideoPreview from "./VideoPreview";

interface InputWrapperProps {
  isVoiceModeActive?: boolean;
  setIsVoiceModeActive: (e: boolean) => void;
  autoStart?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  startStreaming: () => void;
  stopStreaming: () => void;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  isVoiceModeActive,
  setIsVoiceModeActive,
  startStreaming,
  stopStreaming,
  handleSubmit,
}) => {
  const { inputValue, setInputValue } = useInputValueContext();

  const textarea = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { detectIntent, clearIntent } = useIntentDetection();

  // Use the video manager hook for webcam and screen sharing
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture,
  } = useVideoManager();

  const { client, connected, connect, disconnect } = useLiveAPIContext();

  const [webcam, screenCapture] = videoStreams;

  const handleWebcam = () => {
    // If not connected, start streaming
    if (!connected) {
      startStreaming();
    }

    // If already using webcam, stop it
    if (activeVideoStream.type === "webcam") {
      changeStreams();
    } else {
      // if on another stream Change to webcam stream
      changeStreams(webcam);
    }
  };
  const handleScreencapture = async () => {
    // If not connected, start streaming
    if (!connected) {
      startStreaming();
    }
    if (activeVideoStream.type === "screencapture") {
      changeStreams();
    } else {
      changeStreams(screenCapture);
    }
  };

  const stopWebcam = () => {
    if (connected) {
      setIsVoiceModeActive(false);
      changeStreams();
    }
  };

  useEffect(() => {
    // event. listener for keyboard press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || isVoiceModeActive) {
        setInputValue("");
        return;
      }
      textarea.current?.focus();
    });
  }, []);

  // Add autoResize function
  const autoResize = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      const newHeight = Math.max(
        24,
        Math.min(textarea.current.scrollHeight, 500)
      );
      textarea.current.style.height = newHeight + "px";
    }
  };

  // Keep only this updated handleInputChange:
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResize();

    // Clear intent if input is empty
    if (!inputValue.trim()) {
      clearIntent();
      return;
    }

    // Trigger intent detection on input change
    detectIntent(inputValue);
  };

  // Setup video frame capture and stream handling
  useEffect(() => {
    if (!connected) {
      return;
    }

    // Set up the video frame capture functionality
    const cleanup = setupVideoFrameCapture(
      videoRef,
      canvasRef,
      (data) => {
        console.log("[VOICE MODE MANAGER] Sending video frame to server");
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);
      },
      connected
    )();

    return cleanup;
  }, [videoRef, canvasRef, client, connected, activeVideoStream]);

  return (
    <>
      <div className="fixed bottom-0 pb-5 left-0 flex items-end justify-center gap-[14px] w-full z-10">
        <Button
          onClick={handleWebcam}
          variant="primary"
          size="md"
          aria-label="Open text input"
        >
          <CameraIcon />
        </Button>
        {connected ? (
          <button
            className="flex flex-0 bg-white/10 items-center justify-center text-white w-16 h-16 bg-white rounded-full  transition-all duration-300 hover:bg-white/30 hover:bg:white/20"
            onClick={(e) => {
              if (activeVideoStream.mediaStream) stopWebcam();
              stopStreaming();
            }}
            title="Stop voice mode"
            aria-label="Stop voice mode"
          >
            <CrossIcon />
          </button>
        ) : (
          <button
            className="flex flex-0 items-center justify-center text-black w-16 h-16 bg-white rounded-full  transition-all duration-300 hover:bg-white/30 hover:text-white"
            onClick={(e) => {
              startStreaming();
            }}
            title="Start voice mode"
            aria-label="Start voice mode"
          >
            <Mic strokeWidth={1.25} size={28} />
          </button>
        )}

        <form
          onSubmit={handleSubmit}
          className={`fixed inset-0 min-h-full flex flex-col justify-center sm:justify-end w-full px-4 sm:px-0  pb-0  sm:pb-[140px] pointer-events-none sm:max-w-2xl sm:mx-auto`}
        >
          <textarea
            ref={textarea}
            value={inputValue}
            onChange={handleInputChange}
            className={`w-full resize-none bg-transparent focus:outline-none font-semibold text-[20px] sm:text-[24px] leading-none caret-white`}
            disabled={isVoiceModeActive}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any); // Cast to any to satisfy TS, or refactor handleSubmit to accept KeyboardEvent
                setInputValue("");
                setTimeout(() => {
                  textarea.current?.blur();
                  autoResize();
                }, 0);
              }
            }}
          />
        </form>

        <Button
          onClick={handleScreencapture}
          variant="primary"
          size="md"
          aria-label="Open text input"
        >
          <ScreenRecordingIcon />
        </Button>
      </div>
      <>
        {/* Hidden canvas for video processing */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <VideoPreview
          videoStream={activeVideoStream.mediaStream}
          videoRef={videoRef}
          isVisible={!!activeVideoStream.mediaStream}
        />
      </>
    </>
  );
};

export default InputWrapper;
