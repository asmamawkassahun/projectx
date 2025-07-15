import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useAudioManager } from "./use-audio-manager";
import { useConversationLLMHistory } from "./use-gemini-api";
import { useVideoManager } from "./use-video-manager";
import { useConversationStore } from "@/stores/conversation-store";

type StreamingManagerProps = {
  onAudioData: (data: any) => void;
  onVoiceModeChange?: (isActive: boolean) => void;
  autoStart?: boolean;
};

export const UseStreamingManager = ({
  onAudioData,
  onVoiceModeChange,
  autoStart = false,
}: StreamingManagerProps) => {
  const { conversationId } = useConversationStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on a mobile device - only on client side
  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const mobileCheck =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
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
  const handleAudioData = useCallback(
    async (data: any) => {
      if (!conversationId) {
        console.error("No conversationId provided");
        return;
      }
      onAudioData(data);
    },
    [conversationId]
  );

  // Use the audio manager hook with callback
  const { inVolume, audioRecorder } = useAudioManager({
    onAudioData: handleAudioData,
  });

  // Use the video manager hook for webcam and screen sharing
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture,
  } = useVideoManager();

  // Destructure video streams
  const [webcam, screenCapture] = videoStreams;

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
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
    window.addEventListener(
      "agent-message-received",
      handleAgentMessage as EventListener
    );

    return () => {
      // Remove event listener
      window.removeEventListener(
        "agent-message-received",
        handleAgentMessage as EventListener
      );
    };
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
  }, [videoRef, canvasRef, client, connected, isVoiceModeActive]);

  // Set volume CSS variable for animation
  useEffect(() => {
    // Calculate volume size for the pulse effect (5-15px range)
    const volumeSize = Math.max(5, Math.min(inVolume * 120, 15));
    // Set CSS var for pulse effect
    document.documentElement.style.setProperty("--volume", `${volumeSize}px`);
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
      if (!audioRecorder?.recording) {
        await audioRecorder?.start();
      }

      // Critical iOS Safari fix: Ensure AudioContext is resumed
      const ensureAudioContextResumed = async () => {
        try {
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const testContext = new AudioContextClass();
            if (testContext.state === "suspended") {
              await testContext.resume();
            }
            testContext.close();
          }
        } catch (error: any) {
          console.warn(
            "[VoiceModeManager] AudioContext resume attempt failed:",
            error.message
          );
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
      if (history && history.length > 0) {
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
      const errorMessage =
        error?.message ||
        "Failed to start voice mode. Please check your microphone settings and try again.";

      // Use toast to show the error
      toast.error(errorMessage, {
        duration: 8000,
        position: "top-center",
      });
    }
  }, [connect, onVoiceModeChange, conversationId, fetchHistory]);

  // Stop streaming and reset all media
  const stopStreaming = () => {
    // Stop all media streams
    // if (webcam.isStreaming) {
    //   // changeStreams() returns a function that we need to call
    //   const stopWebcam = changeStreams(); // No arg means "stop current stream"
    //   stopWebcam();
    // }

    // if (screenCapture.isStreaming) {
    //   const stopScreenCapture = changeStreams(); // No arg means "stop current stream"
    //   stopScreenCapture();
    // }

    console.log(
      "[USE STREAMING MANAGER] stopping the stream ...",
      audioRecorder
    ); // Stop audio recording
    audioRecorder?.stop();
    console.log("[USE STREAMING MANAGER] audio recording stopped successfully"); // Stop audio recording

    // Use the disconnect function from the context
    disconnect();

    // Reset UI states
    setIsStreaming(false);
    setIsVoiceModeActive(false);

    // Notify parent component about voice mode deactivation
    if (onVoiceModeChange) {
      onVoiceModeChange(false);
    }
  };

  return {
    startStreaming,
    stopStreaming,
    isVoiceModeActive,
    isStreaming,
    isConnecting,
    isMobile,
    videoStreams,
    activeVideoStream,
    changeStreams,
  };
};
