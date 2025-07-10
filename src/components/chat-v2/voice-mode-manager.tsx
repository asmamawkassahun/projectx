import { memo, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera, Mic, MicOff, Maximize2, X, Volume2, XCircle } from "lucide-react";
import { useVideoManager } from "@/hooks/use-video-manager";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import VideoPreview from "../VideoPreview";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioManager } from "@/hooks/use-audio-manager";
import { useConversationLLMHistory } from "@/hooks/use-gemini-api";
import { toast } from "react-hot-toast";

type VoiceModeManagerProps = {
  conversationId?: string;
  onAudioData?: any;
  onVoiceModeChange?: (isActive: boolean) => void;
  autoStart?: boolean;
};

const VoiceModeManager = ({
  conversationId,
  onAudioData,
  onVoiceModeChange,
  autoStart = false
}: VoiceModeManagerProps) => {
  const [muted, setMuted] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoStartRef = useRef(autoStart);
  
  // Detect if we're on a mobile device - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
    }
  }, []);
  
  // Refs for video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Access the LiveAPI context properly
  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const clientRef = useRef(client);
  
  // Get conversation history
  const { fetchHistory } = useConversationLLMHistory();
  
  // Create a callback for handling audio data
  const handleAudioData = useCallback(async (data: any) => {
    // If an external handler is provided, use it
    if (onAudioData) {
      return onAudioData(data);
    }
  }, []);
  
  // Use the audio manager hook with callback
  const { inVolume, audioRecorder } = useAudioManager({
    muted,
    conversationId,
    onAudioData: handleAudioData
  });

  // Use the video manager hook for webcam and screen sharing
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture
  } = useVideoManager();
  
  // Destructure video streams
  const [webcam, screenCapture] = videoStreams;
  
  // Update videoStream state when activeVideoStream changes
  useEffect(() => {
    setVideoStream(activeVideoStream);
  }, [activeVideoStream]);

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
    console.log("[VOICE MODE MANAGER] MOUNTED");
    
    // Listen for agent messages when waiting for user response
    const handleAgentMessage = (event: CustomEvent) => {
      const { content, isWaitingUserResponse } = event.detail;
      if (isWaitingUserResponse) {
        const updatedContent = `I need to ask you some questions to help you better. Here's what I need clarification on: ${content}
        Please analyze this and if there are multiple questions, ask them one by one in a natural conversational way. Keep each question short and clear. Once you have all the answers, provide a complete response via calling super_agent tool with action send_user_answer. Don't mention anything about a "super agent" - just act like you're asking these questions yourself to better understand what the user needs.`;
        
        clientRef.current.send([{ text: updatedContent }], true);
      }
    };

    // Add event listener
    window.addEventListener('agent-message-received', handleAgentMessage as EventListener);
    
    return () => {
      // Remove event listener
      window.removeEventListener('agent-message-received', handleAgentMessage as EventListener);
    }
  }, []);

  
  // Setup video frame capture and stream handling
  useEffect(() => {
    if (!connected || !isVoiceModeActive) {
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
  }, [setupVideoFrameCapture, videoRef, canvasRef, client, connected, isVoiceModeActive]);
  
  // Set volume CSS variable for animation
  useEffect(() => {
    // Calculate volume size for the pulse effect (5-15px range)
    const volumeSize = Math.max(5, Math.min(inVolume * 120, 15));
    // Set CSS var for pulse effect
    document.documentElement.style.setProperty(
      "--volume",
      `${volumeSize}px`
    );
  }, [inVolume]);

  // Handle connection status changes
  useEffect(() => {
    if (connected && isConnecting) {
      // Connection was successful
      setIsConnecting(false);
      setIsStreaming(true);
    }
  }, [connected, isConnecting]);

  // Start streaming mode
  const startStreaming = useCallback(async () => {
    setIsConnecting(true);
    setIsVoiceModeActive(true);
    
    // Notify parent component about voice mode activation
    if (onVoiceModeChange) {
      onVoiceModeChange(true);
    }
    
    try {
      // Critical iOS Safari fix: Ensure AudioContext is resumed
      const ensureAudioContextResumed = async () => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const testContext = new AudioContextClass();
            if (testContext.state === 'suspended') {
              await testContext.resume();
            }
            testContext.close();
          }
        } catch (error: any) {
          console.warn('[VoiceModeManager] AudioContext resume attempt failed:', error.message);
        }
      };
      
      await ensureAudioContextResumed();
      
      // Fetch conversation history if we have a conversationId
      let history: any = null;
      if (conversationId) {
        const historyData = await fetchHistory(conversationId);
        if (historyData) {
          history = historyData?.history;
        }
      }
      
      // Use the connect function from the context with history
      await connect();
      if(history && history.length > 0) {
        setTimeout(() => {
          // Send history without turn complete
          history.forEach((turn: any) => {
            clientRef.current.send(turn.parts, false);
          });
          // Send a new user message to start the conversation
          clientRef.current.send([{ text: "Hello" }], true);
        }, 300);
      }
    } catch (error: any) {
      console.error("Failed to start voice mode:", error);
      setIsConnecting(false);
      setIsVoiceModeActive(false);
      
      // Notify parent component about voice mode deactivation on error
      if (onVoiceModeChange) {
        onVoiceModeChange(false);
      }
      
      // Show user-friendly error message
      const errorMessage = error?.message || "Failed to start voice mode. Please check your microphone settings and try again.";
      
      // Use toast to show the error
      toast.error(errorMessage, {
        duration: 8000,
        position: 'top-center'
      });
    }
  }, [connect, onVoiceModeChange, conversationId, fetchHistory]);

  // Auto-start on initial mount if needed
  useEffect(() => {
    if (autoStartRef.current) {
      startStreaming();
    }
  }, [startStreaming]);
  
  // Stop streaming and reset all media
  const stopStreaming = useCallback(() => {
    // Stop all media streams
    if (webcam.isStreaming) {
      // changeStreams() returns a function that we need to call
      const stopWebcam = changeStreams(); // No arg means "stop current stream"
      stopWebcam();
    }
    
    if (screenCapture.isStreaming) {
      const stopScreenCapture = changeStreams(); // No arg means "stop current stream"
      stopScreenCapture();
    }

    // Stop audio recording
    audioRecorder.stop();
    
    // Make sure we set muted to true before disconnecting
    setMuted(true);
    
    // Use the disconnect function from the context
    disconnect();
    
    // Reset UI states
    setIsStreaming(false);
    setIsVoiceModeActive(false);
    
    // Notify parent component about voice mode deactivation
    if (onVoiceModeChange) {
      onVoiceModeChange(false);
    }
  }, [audioRecorder, changeStreams, disconnect, onVoiceModeChange, screenCapture.isStreaming, webcam.isStreaming]);

  // Button styles
  const buttonClassName = "p-2 rounded-full transition-colors hover:bg-gray-200 relative";
  const activeButtonClassName = "p-2 rounded-full bg-black text-white transition-colors hover:bg-gray-800 relative";
  const disabledButtonClassName = "p-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed relative";

  // Voice Mode button animation variants
  const containerVariants = {
    closed: { 
      width: 'auto',
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      width: 'auto',
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    closed: { 
      opacity: 0,
      scale: 0.5,
      width: 0,
      marginRight: 0
    },
    open: { 
      opacity: 1,
      scale: 1,
      width: 'auto',
      marginRight: 8
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div 
          className="flex items-center"
          initial="closed"
          animate={isStreaming ? "open" : "closed"}
          variants={containerVariants}
        >
          {/* Only show controls when streaming */}
          {isStreaming && (
            <>
              {/* Mic button */}
              <motion.div variants={itemVariants}>
                <button
                  className={!muted ? activeButtonClassName : buttonClassName}
                  onClick={() => setMuted(!muted)}
                  aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                >
                  {/* Pulsing volume effect for active mic */}
                  {!muted && connected && (
                    <span
                      className="absolute rounded-full bg-black/30 transition-all ease-out"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: `calc(24px + var(--volume) * 2)`,
                        height: `calc(24px + var(--volume) * 2)`,
                        opacity: 0.35,
                        zIndex: 0,
                        transitionDuration: "150ms"
                      }}
                    />
                  )}
                  <div className="relative z-10">
                    {muted ? 
                      <MicOff className="w-5 h-5 text-black/60" /> : 
                      <Mic className={`w-5 h-5 ${!muted ? "text-white" : "text-black/60"}`} />
                    }
                  </div>
                </button>
              </motion.div>

              {/* Webcam button */}
              <motion.div variants={itemVariants}>
                <button
                  className={webcam.isStreaming ? activeButtonClassName : buttonClassName}
                  onClick={() => {
                    if (webcam.isStreaming) {
                      // Stop webcam
                      const stopWebcam = changeStreams();
                      stopWebcam();
                    } else {
                      // Start webcam
                      const startWebcam = changeStreams(webcam);
                      startWebcam();
                    }
                  }}
                  aria-label={webcam.isStreaming ? "Turn off camera" : "Turn on camera"}
                >
                  <Camera className={`w-5 h-5 ${webcam.isStreaming ? "text-white" : "text-black/60"}`} />
                </button>
              </motion.div>

              {/* Screen share button - only show on desktop */}
              {!isMobile && (
                <motion.div variants={itemVariants}>
                  <button
                    className={screenCapture.isStreaming ? activeButtonClassName : buttonClassName}
                    onClick={() => {
                      if (screenCapture.isStreaming) {
                        // Stop screen sharing
                        const stopScreenCapture = changeStreams();
                        stopScreenCapture();
                      } else {
                        // Start screen sharing
                        const startScreenCapture = changeStreams(screenCapture);
                        startScreenCapture();
                      }
                    }}
                    aria-label={screenCapture.isStreaming ? "Stop screen sharing" : "Share screen"}
                  >
                    {screenCapture.isStreaming ? 
                      <X className="w-5 h-5 text-white" /> : 
                      <Maximize2 className="w-5 h-5 text-black/60" />
                    }
                  </button>
                </motion.div>
              )}
              
              {/* Exit button */}
              <motion.div variants={itemVariants}>
                <button
                  className="p-2 rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                  onClick={stopStreaming}
                  aria-label="Exit voice mode"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </motion.div>
            </>
          )}
          
          {/* Voice Mode or Loading button */}
          {!isStreaming && (
            <button
              className={isConnecting ? disabledButtonClassName : "p-2 rounded-full bg-black text-white transition-colors hover:bg-gray-800"}
              onClick={startStreaming}
              disabled={isConnecting}
              aria-label="Start voice mode"
            >
              {isConnecting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Hidden canvas for video processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {/* Video preview rendered via portal to avoid positioning conflicts */}
      {typeof window !== 'undefined' && createPortal(
        <VideoPreview 
          videoStream={videoStream}
          videoRef={videoRef}
          onVideoStreamChange={setVideoStream}
          isVisible={!!videoStream}
        />,
        document.body
      )}
    </>
  );
};

export default memo(VoiceModeManager, (prevProps, nextProps) => {
  const conversationIdSame = prevProps.conversationId === nextProps.conversationId;
  const onAudioDataSame = prevProps.onAudioData === nextProps.onAudioData;
  const onVoiceModeChangeSame = prevProps.onVoiceModeChange === nextProps.onVoiceModeChange;
  const autoStartSame = prevProps.autoStart === nextProps.autoStart;

  const areEqual = conversationIdSame && onAudioDataSame && onVoiceModeChangeSame && autoStartSame;

  if (!areEqual) {
    console.log("[VOICE MODE MANAGER] MEMO: Props changed, allowing re-render", {
      conversationIdSame,
      onAudioDataSame,
      onVoiceModeChangeSame,
      autoStartSame,
    });
  } else {
    console.log("[VOICE MODE MANAGER] MEMO: Props same, SKIPPING re-render");
  }

  return areEqual;
});