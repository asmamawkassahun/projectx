import clsx from "clsx";

import { memo, ReactNode, RefObject, useEffect, useRef, useState, useCallback } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useAudioManager, AudioDataCallback } from "../../hooks/use-audio-manager";
import { useVideoManager } from "../../hooks/use-video-manager";
import { useAudioMessageAPI } from "../../hooks/use-audio-api";
import AudioPulse from "../AudioPulse";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

export type ControlTrayProps = {
  videoRef: RefObject<HTMLVideoElement>;
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
  enableEditingSettings?: boolean;
  conversationId?: string; // Conversation ID passed from parent
  audioApiEndpoint?: string; // Optional custom endpoint for audio messages
  onAudioData?: AudioDataCallback; // Optional callback for handling audio data directly
};

type MediaStreamButtonProps = {
  isStreaming: boolean;
  onIcon: string;
  offIcon: string;
  start: () => Promise<any>;
  stop: () => any;
  label: string;
};

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(
  ({ isStreaming, onIcon, offIcon, start, stop, label }: MediaStreamButtonProps) =>
    isStreaming ? (
      <button 
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-secondary-300 bg-secondary-50 text-secondary-600 text-xl cursor-pointer transition-all duration-200 hover:bg-secondary-100 shadow-sm hover:shadow" 
        onClick={stop}
        aria-label={`Stop ${label}`}
      >
        <span className="material-symbols-outlined filled text-[20px]">{onIcon}</span>
      </button>
    ) : (
      <button 
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-stone-300 bg-stone-50 text-stone-600 text-xl cursor-pointer transition-all duration-200 hover:bg-stone-100 shadow-sm hover:shadow" 
        onClick={start}
        aria-label={`Start ${label}`}
      >
        <span className="material-symbols-outlined filled text-[20px]">{offIcon}</span>
      </button>
    )
);

function ControlTray({
  videoRef,
  children,
  onVideoStreamChange = () => {},
  supportsVideo,
  enableEditingSettings,
  conversationId, // Conversation ID passed from parent
  onAudioData, // Optional callback for handling audio data directly
}: ControlTrayProps) {
  // Use the video manager hook for webcam and screen sharing functionality
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture
  } = useVideoManager();
  
  // Destructure video streams
  const [webcam, screenCapture] = videoStreams;
  
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);
  
  const AUDIO_SAVE_URL = `${API_URL}/api/audio/message/add`;
  // Use the audio message API hook with configurable endpoint
  const { saveAudioMessage } = useAudioMessageAPI(AUDIO_SAVE_URL);
  // Create a callback for handling audio data
  const handleAudioData = useCallback<AudioDataCallback>(async (data) => {
    // If an external handler is provided, use it
    if (onAudioData) {
      return onAudioData(data);
    }
    // Otherwise use our internal API implementation
    return saveAudioMessage(data);
  }, [saveAudioMessage, onAudioData]);
  
  // Use the audio manager hook with callback
  const { inVolume } = useAudioManager({
    muted,
    conversationId,
    onAudioData: handleAudioData
  });
  
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const { client, connected, connect, disconnect, volume } = useLiveAPIContext();
  
  // Add loading state for connection
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`
    );
  }, [inVolume]);

  // Handle loading state based on connection status
  useEffect(() => {
    if (connected && isConnecting) {
      // Connection was successful
      setIsConnecting(false);
    }
  }, [connected, isConnecting]);

  // Setup video frame capture and stream handling
  useEffect(() => {
    // Set up the video frame capture functionality
    const cleanup = setupVideoFrameCapture(
      videoRef,
      renderCanvasRef,
      (data) => {
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);
      },
      connected
    )();
    
    // Update parent component with the active stream
    onVideoStreamChange(activeVideoStream);
    
    return cleanup;
  }, [setupVideoFrameCapture, videoRef, renderCanvasRef, client, connected, activeVideoStream, onVideoStreamChange]);
  
  // Enhanced connect function with loading state
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      // Note: connected state is managed by the context and will trigger the useEffect above
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center transition-all duration-300 ease-in-out"
    )}>
      <canvas style={{ display: "none" }} ref={renderCanvasRef} />
      
      {/* Tray container with glass effect */}
      <div className="backdrop-blur-md bg-background/60 border border-stone-200 rounded-full px-4 py-2 shadow-lg">
        {/* Main control buttons in a horizontal row */}
        <div className="flex justify-center gap-4 items-center">
          {/* Mic button */}
          <button
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-full text-xl cursor-pointer transition-all duration-200 border-2 shadow-sm hover:shadow",
              !muted 
                ? "bg-primary-50 text-primary-600 border-primary-300 hover:bg-primary-100" 
                : "bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100"
            )}
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            disabled={isConnecting}
          >
            {/* Pulsing volume effect */}
            {!muted && connected && (
              <span
                className="absolute rounded-full -z-10 bg-primary-400 transition-all duration-[0.02s]"
                style={{
                  top: `calc(var(--volume) * -1)`,
                  left: `calc(var(--volume) * -1)`,
                  width: `calc(100% + var(--volume) * 2)`,
                  height: `calc(100% + var(--volume) * 2)`,
                  opacity: 0.35
                }}
              />
            )}
            <span className="material-symbols-outlined filled text-[20px]">
              {!muted ? "mic" : "mic_off"}
            </span>
          </button>

          {/* Volume visualization */}
          <div className="h-10 w-10 flex items-center justify-center bg-white/80 rounded-full overflow-hidden border-2 border-stone-200">
            <AudioPulse volume={volume} isActive={connected} lightBackground={true} />
          </div>

          {/* Screen share and webcam buttons - using our hook now */}
          {supportsVideo && (
            <>
              <MediaStreamButton
                isStreaming={screenCapture.isStreaming}
                start={changeStreams(screenCapture)}
                stop={changeStreams()}
                onIcon="cancel_presentation"
                offIcon="present_to_all"
                label="screen sharing"
              />
              
              {/* Webcam button */}
              <MediaStreamButton
                isStreaming={webcam.isStreaming}
                start={changeStreams(webcam)}
                stop={changeStreams()}
                onIcon="videocam_off"
                offIcon="videocam"
                label="webcam"
              />
            </>
          )}
          
          {/* Exit button */}
          <button
            ref={exitButtonRef}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-red-50 text-red-600 border-red-300 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow"
            onClick={() => {
              disconnect();
              window.location.href = '/';
            }}
            aria-label="Exit streaming"
            disabled={isConnecting}
          >
            <span className="material-symbols-outlined filled text-[20px]">
              exit_to_app
            </span>
          </button>

          {/* Connect/Disconnect button - only show when not connected */}
          {!connected && (
            <button
              ref={connectButtonRef}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm hover:shadow",
                isConnecting 
                  ? "bg-indigo-400 text-white border-indigo-500 cursor-wait" 
                  : "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
              )}
              onClick={handleConnect}
              aria-label="Connect"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined filled text-[20px]">
                  play_arrow
                </span>
              )}
            </button>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(ControlTray); 