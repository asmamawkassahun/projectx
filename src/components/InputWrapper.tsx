import { useInputValueContext } from "@/contexts/InputValueContext";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useVideoManager } from "@/hooks/use-video-manager";
import { Mic } from "lucide-react";
import { useEffect, useRef } from "react";
import { CameraIcon } from "./icons/CameraIcon";
import { ScreenRecordingIcon } from "./icons/ScreenRecordingIcon";
import { Button } from "./ui";
import VideoPreview from "./VideoPreview";

interface InputWrapperProps {
  isVoiceModeActive?: boolean;
  setIsVoiceModeActive: (e: boolean) => void;
  autoStart?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startStreaming: () => void;
  stopStreaming: () => void;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  isVoiceModeActive,
  setIsVoiceModeActive,
  startStreaming,
  stopStreaming,
  handleSubmit,
  handleInputChange,
}) => {
  const { inputValue, setInputValue } = useInputValueContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use the video manager hook for webcam and screen sharing
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture,
  } = useVideoManager();

  const { client, connected, connect, disconnect } = useLiveAPIContext();

  const [webcam, screenCapture] = videoStreams;

  const startWebcam = async () => {
    if (!connected) {
      console.log("[InputWrapper] Not connected, starting streaming");
      startStreaming();
    }
    changeStreams(webcam);
  };
  const startScreencapture = async () => {
    if (!connected) {
      console.log("[InputWrapper] Not connected, starting streaming");
      startStreaming();
    }
    changeStreams(screenCapture);
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
      inputRef.current?.focus();
    });
  }, []);

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
        console.log("[VOICE MODE MANAGER] Sending video frame to server", data);
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
          onClick={async () => {
            if (!activeVideoStream) await startWebcam();
          }}
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
              if (activeVideoStream) stopWebcam();
              stopStreaming();
            }}
            title="Stop voice mode"
            aria-label="Stop voice mode"
          >
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 17.0001L17.5 1.16089"
                stroke="white"
                stroke-width="1.61627"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.5 1L17.5 16.8392"
                stroke="white"
                stroke-width="1.61627"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
          className="absolute w-0 h-0 overflow-hidden pointer-events-none"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="How can I help?"
            className={`w-full  border-b border-white focus:border-white/40 text-white placeholder-white bg-transparent focus:outline-none`}
            autoFocus
            disabled={isVoiceModeActive}
          />
        </form>

        <Button
          onClick={() => {
            startScreencapture();
          }}
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
          videoStream={activeVideoStream}
          videoRef={videoRef}
          isVisible={!!activeVideoStream}
        />
      </>
    </>
  );
};

export default InputWrapper;
