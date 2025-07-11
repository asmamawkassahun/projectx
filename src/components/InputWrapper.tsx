import { useEffect, useRef, useState } from "react";
import { CrossIcon, Mic } from "lucide-react";
import { CameraIcon } from "./icons/CameraIcon";
import { ScreenRecordingIcon } from "./icons/ScreenRecordingIcon";
import { Button } from "./ui";
import { useVoiceModeManager } from "@/hooks/useVoiceModeManager";

interface InputWrapperProps {
  startVoiceMode: () => void;
  isVoiceModeActive?: boolean;
  conversationId?: string;
  input: string;
  onTranscriptReceived: (role: "user" | "model", text: string, timestamp: Date) => void;
  onVoiceModeChange?: (isActive: boolean) => void;
  autoStart?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
  isVoiceModeActive,
  startVoiceMode,
  input,
  handleSubmit,
  handleInputChange,
  conversationId,
  onTranscriptReceived,
  onVoiceModeChange,
  autoStart,
}) => {
  const [isTextInputShown, setIsTextInputShown] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // event. listener for keyboard press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || isVoiceModeActive) {
        setIsTextInputShown(false);
        return;
      }
      setIsTextInputShown(true);
      inputRef.current?.focus();
    });
  }, []);

  return (
    <div className="fixed bottom-0 pb-5 left-0 flex items-end justify-center gap-[14px] w-full">
      <Button
        onClick={() => console.log("video input")}
        variant="primary"
        size="md"
        aria-label="Open text input"
      >
        <CameraIcon />
      </Button>
      {isVoiceModeActive ? (
        <button
          className="flex flex-0 items-center justify-center text-black w-16 h-16 bg-white rounded-full  transition-all duration-300 hover:bg-white/30 hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            // stopStreaming();
          }}
          title="Stop voice mode"
          aria-label="Stop voice mode"
        >
          <CrossIcon strokeWidth={1.25} size={28} />
        </button>
      ) : (
        <button
          className="flex flex-0 items-center justify-center text-black w-16 h-16 bg-white rounded-full  transition-all duration-300 hover:bg-white/30 hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            startVoiceMode();
          }}
          title="Start voice mode"
          aria-label="Start voice mode"
        >
          <Mic strokeWidth={1.25} size={28} />
        </button>
      )}
      {/* {isTextInputShown && (
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="How can I help?"
            className={`w-full  border-b border-white focus:border-white/40 text-white placeholder-white bg-transparent focus:outline-none`}
            autoFocus
            disabled={isVoiceModeActive}
          />
        </form>
      )} */}
      <Button
        onClick={() => console.log("video input")}
        variant="primary"
        size="md"
        aria-label="Open text input"
      >
        <ScreenRecordingIcon />
      </Button>
      {/* Example: Render VoiceModeControl JSX here if needed */}
      {/* <VoiceModeControl ...props /> */}
    </div>
  );
};

export default InputWrapper;
