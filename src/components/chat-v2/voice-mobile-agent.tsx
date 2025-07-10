import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mic, MicOff, XCircle } from "lucide-react";
import { useVideoManager } from "@/hooks/use-video-manager";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useAudioManager } from "@/hooks/use-audio-manager";
import {
  useConversationLLMHistory,
  useVoiceSearchEnhancerMinimal,
} from "@/hooks/use-gemini-api";
import { useLocation, LocationCoordinates } from "@/hooks/use-location";
import { toast } from "react-hot-toast";
import CenteredAudioPulse from "@/components/CenteredAudioPulse";
import { VoiceSearchWidgets } from "@/components/voice_search_widgets";

interface VoiceMobileAgentProps {
  conversationId?: string;
  sessionId?: string;
  onTranscriptReceived: (
    role: "user" | "model",
    text: string,
    timestamp: Date
  ) => void;
  onClose: () => void;
}

const VoiceMobileAgent: React.FC<VoiceMobileAgentProps> = ({
  conversationId,
  sessionId,
  onTranscriptReceived,
  onClose,
}) => {
  const [muted, setMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [locationRequested, setLocationRequested] = useState(false);

  // Video zoom and pan state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isGesturing, setIsGesturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const initialTranslate = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keep a ref to the latest conversation messages to avoid re-creating handleSearchData
  const conversationMessagesRef = useRef<
    Array<{ role: string; content: string }>
  >([]);

  // Update ref whenever state changes
  useEffect(() => {
    conversationMessagesRef.current = conversationMessages;
  }, [conversationMessages]);

  // Access the LiveAPI context
  const { client, connected, connect, disconnect } = useLiveAPIContext();

  // Get conversation history
  const { fetchHistory } = useConversationLLMHistory();

  // Voice search enhancer hook
  const { sendSearchData } = useVoiceSearchEnhancerMinimal();

  // Location hook
  const {
    coordinates,
    isLoading: isLocationLoading,
    error: locationError,
    permissionStatus,
    requestLocation,
    clearLocation,
    isGeolocationSupported,
  } = useLocation();

  // Memoize location data to prevent re-renders
  const locationData = useMemo(
    () =>
      coordinates
        ? {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }
        : null,
    [coordinates]
  );

  // Handle audio data with transcript processing
  const handleAudioData = useCallback(
    async (data: any) => {
      try {
        if (data.transcript && data.transcript.trim() && conversationId) {
          // Clean the transcript by trimming and removing noise tags
          const cleanedTranscript = data.transcript
            .trim()
            .replace(/<noise>.*?(<\/noise>|$)/g, "")
            .trim();

          // Only proceed if we have a meaningful transcript after cleaning
          if (cleanedTranscript) {
            // Save to local conversation messages
            setConversationMessages((prev) => [
              ...prev,
              {
                role: data.role,
                content: cleanedTranscript,
              },
            ]);

            onTranscriptReceived(
              data.role,
              cleanedTranscript,
              new Date(data.timestamp || new Date())
            );
          }
        }
      } catch (error) {
        console.error("Error handling audio data:", error);
      }
    },
    [conversationId, onTranscriptReceived]
  );

  // Use the audio manager hook
  const { inVolume, audioRecorder } = useAudioManager({
    muted,
    conversationId,
    onAudioData: handleAudioData,
  });

  // Use the video manager hook
  const {
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture,
  } = useVideoManager();

  // Destructure video streams
  const [webcam, screenCapture] = videoStreams;

  // Handle connection status changes
  useEffect(() => {
    if (connected && isConnecting) {
      setIsConnecting(false);
      setIsStreaming(true);
    }
  }, [connected, isConnecting]);

  // Request location when component mounts if not already requested
  useEffect(() => {
    if (!locationRequested && isGeolocationSupported) {
      setLocationRequested(true);

      // Check permission status first
      if (permissionStatus === "unknown" || permissionStatus === "prompt") {
        // Auto-request if already granted
        requestLocation();
      } else if (permissionStatus === "granted") {
        // Auto-request if already granted
        requestLocation();
      }
    }
  }, [
    locationRequested,
    isGeolocationSupported,
    permissionStatus,
    requestLocation,
  ]);

  // Memoized search handler to prevent re-renders
  const handleSearchData = useCallback(
    async (searchData: any) => {
      // Check if we need location data
      if (!locationRequested && !coordinates) {
        console.log("Location needed for search, requesting...");
        setLocationRequested(true);
        requestLocation();
        return;
      }

      console.log("Sending search data to enhancer...");

      if (sendSearchData && conversationId) {
        try {
          // Get the last 3 messages from local state
          const recentMessages = conversationMessagesRef.current
            .map((message) => `${message.role}: ${message.content}`)
            .join("\n");

          // Extract segments from GroundingSupport
          let segments = "";
          if (
            searchData?.groundingSupports &&
            Array.isArray(searchData.groundingSupports)
          ) {
            segments = searchData.groundingSupports
              .map((support: any) => support.segment?.text)
              .filter(
                (segmentText: string) => segmentText && segmentText.trim()
              )
              .join(" ");
          }

          console.log("Recent messages:", recentMessages);
          console.log("Location data:", locationData);
          console.log("Segments:", segments);

          // Send the search data with correct parameter structure
          await sendSearchData({
            conversation_id: conversationId,
            recent_conversation: recentMessages,
            search_data: segments,
            session_id: sessionId,
            location: locationData,
          });
        } catch (error) {
          console.error("Error sending to enhancer:", error);
        }
      }
    },
    [
      locationRequested,
      coordinates,
      sendSearchData,
      conversationId,
      sessionId,
      locationData,
      requestLocation,
    ]
  );

  // Listen for searchData event from the client - optimized with memoized handler
  useEffect(() => {
    if (!client) return;

    client.on("searchData", handleSearchData);

    return () => {
      client.off("searchData", handleSearchData);
    };
  }, [client, handleSearchData]);

  // Setup video stream on video element
  useEffect(() => {
    if (videoRef.current && activeVideoStream) {
      videoRef.current.srcObject = activeVideoStream;
    }
  }, [activeVideoStream]);

  // Setup video frame capture when streaming
  useEffect(() => {
    if (!connected || !isStreaming) {
      return;
    }

    const cleanup = setupVideoFrameCapture(
      videoRef,
      canvasRef,
      (data) => {
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);
      },
      connected
    )();

    return cleanup;
  }, [setupVideoFrameCapture, client, connected, isStreaming]);

  // Start streaming mode
  const startStreaming = useCallback(async () => {
    setIsConnecting(true);

    try {
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
            "[VoiceMobileAgent] AudioContext resume attempt failed:",
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

      // Connect to the API
      await connect();

      if (history && history.length > 0) {
        setTimeout(() => {
          // Send history without turn complete
          history.forEach((turn: any) => {
            client.send(turn.parts, false);
          });
          // Send a new user message to start the conversation
          client.send([{ text: "Hello" }], true);
        }, 300);
      }
    } catch (error: any) {
      console.error("Failed to start voice mode:", error);
      setIsConnecting(false);

      const errorMessage =
        error?.message ||
        "Failed to start voice mode. Please check your microphone settings and try again.";
      toast.error(errorMessage, {
        duration: 8000,
        position: "top-center",
      });
    }
  }, [connect, conversationId, fetchHistory, client]);

  // Auto-start connection when component becomes visible
  useEffect(() => {
    if (!isConnecting && !connected) {
      startStreaming();
    }
  }, [isConnecting, connected, startStreaming]);

  // Stop streaming and close
  const handleClose = useCallback(() => {
    // Stop all media streams
    if (webcam.isStreaming) {
      const stopWebcam = changeStreams();
      stopWebcam();
    }

    if (screenCapture.isStreaming) {
      const stopScreenCapture = changeStreams();
      stopScreenCapture();
    }

    // Stop audio recording
    audioRecorder.stop();

    // Disconnect from API
    disconnect();

    // Clear location data
    clearLocation();

    // Reset states
    setIsStreaming(false);
    setIsConnecting(false);
    setMuted(true);
    setLocationRequested(false);

    // Close the component
    onClose();
  }, [
    webcam.isStreaming,
    screenCapture.isStreaming,
    changeStreams,
    audioRecorder,
    disconnect,
    clearLocation,
    onClose,
  ]);

  // Track component mount/unmount
  useEffect(() => {
    console.log("[VOICE MOBILE AGENT] MOUNTED");
    return () => {
      console.log("[VOICE MOBILE AGENT] UNMOUNTED");
    };
  }, []);

  // Helper function to get distance between two touches
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper function to get center point of touches
  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return { x, y };
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - prepare for pan
        const touch = e.touches[0];
        lastTouchCenter.current = { x: touch.clientX, y: touch.clientY };
        initialTranslate.current = { x: translateX, y: translateY };
      } else if (e.touches.length === 2) {
        // Two touches - prepare for pinch zoom
        e.preventDefault();
        setIsGesturing(true);
        lastTouchDistance.current = getTouchDistance(e.touches);
        lastTouchCenter.current = getTouchCenter(e.touches);
        initialTranslate.current = { x: translateX, y: translateY };
      }
    },
    [translateX, translateY]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && lastTouchCenter.current && scale > 1) {
        // Single touch pan (only when zoomed in)
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchCenter.current.x;
        const deltaY = touch.clientY - lastTouchCenter.current.y;

        const newTranslateX = initialTranslate.current.x + deltaX;
        const newTranslateY = initialTranslate.current.y + deltaY;

        // Constrain panning to reasonable bounds
        const maxTranslate = 100 * (scale - 1);
        setTranslateX(
          Math.max(-maxTranslate, Math.min(maxTranslate, newTranslateX))
        );
        setTranslateY(
          Math.max(-maxTranslate, Math.min(maxTranslate, newTranslateY))
        );
      } else if (e.touches.length === 2 && lastTouchDistance.current) {
        // Two touch pinch zoom
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const scaleChange = currentDistance / lastTouchDistance.current;
        const newScale = Math.max(1, Math.min(3, scale * scaleChange));

        setScale(newScale);
        lastTouchDistance.current = currentDistance;

        // If zooming out to 1x, reset translation
        if (newScale <= 1.1) {
          setTranslateX(0);
          setTranslateY(0);
        }
      }
    },
    [scale, translateX, translateY]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 0) {
        setIsGesturing(false);
        lastTouchDistance.current = null;
        lastTouchCenter.current = null;

        // Snap to 1x if very close
        if (scale < 1.1) {
          setScale(1);
          setTranslateX(0);
          setTranslateY(0);
        }
      }
    },
    [scale]
  );

  // Reset zoom on double tap
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  const mobileAgentContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white"
    >
      {/* Video area - takes up most of the screen */}
      <div className="flex-1 relative h-full">
        {activeVideoStream ? (
          <div className="relative w-full h-full bg-black overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover touch-none select-none"
              autoPlay
              playsInline
              muted
              style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                transformOrigin: "center center",
                transition: isGesturing ? "none" : "transform 0.2s ease-out",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
            />

            {/* Zoom level indicator */}
            {scale > 1.1 && (
              <div className="absolute top-4 left-4 z-10">
                <div className="text-sm text-white bg-black/70 rounded-full px-3 py-1">
                  {scale.toFixed(1)}x
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty state when no video - show audio pulse visualization
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              {/* Centered Audio Pulse */}
              <div className="mb-8">
                <CenteredAudioPulse isActive={connected && !muted} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for video processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Voice Search Widgets - always positioned above controls */}
      <div className="absolute bottom-20 left-0 right-0">
        <VoiceSearchWidgets sessionId={sessionId} isVisible={true} />
      </div>

      {/* Controls at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-6 pb-8">
        <div className="flex justify-center items-center space-x-4">
          {isStreaming ? (
            <>
              {/* Mic button */}
              <button
                className={`p-3 rounded-full transition-colors relative ${
                  !muted ? "bg-black text-white" : "bg-gray-200 text-black/60"
                }`}
                onClick={() => setMuted(!muted)}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              >
                <div className="relative z-10">
                  {muted ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </div>
              </button>

              {/* Camera button */}
              <button
                className={`p-3 rounded-full transition-colors ${
                  webcam.isStreaming
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black/60"
                }`}
                onClick={() => {
                  if (webcam.isStreaming) {
                    const stopWebcam = changeStreams();
                    stopWebcam();
                  } else {
                    const startWebcam = changeStreams(webcam);
                    startWebcam();
                  }
                }}
                aria-label={
                  webcam.isStreaming ? "Turn off camera" : "Turn on camera"
                }
              >
                <Camera className="w-6 h-6" />
              </button>

              {/* Exit button */}
              <button
                className="p-3 rounded-full bg-black text-white transition-colors"
                onClick={handleClose}
                aria-label="Exit voice mode"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {isConnecting && (
                <div className="h-6 w-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className="text-black/60">
                {isConnecting ? "Connecting..." : "Starting voice mode..."}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Render in portal to ensure it's above everything else
  if (typeof window !== "undefined") {
    return createPortal(mobileAgentContent, document.body);
  }

  return null;
};

// Use React.memo with custom comparison to prevent unnecessary re-renders
VoiceMobileAgent.displayName = "VoiceMobileAgent";

export default React.memo(VoiceMobileAgent, (prevProps, nextProps) => {
  const conversationIdSame =
    prevProps.conversationId === nextProps.conversationId;
  const onTranscriptReceivedSame =
    prevProps.onTranscriptReceived === nextProps.onTranscriptReceived;
  const onCloseSame = prevProps.onClose === nextProps.onClose;

  const areEqual =
    conversationIdSame && onTranscriptReceivedSame && onCloseSame;

  if (!areEqual) {
    console.log(
      "[VOICE MOBILE AGENT] MEMO: Props changed, allowing re-render",
      {
        conversationIdSame,
        onTranscriptReceivedSame,
        onCloseSame,
      }
    );
  } else {
    console.log("[VOICE MOBILE AGENT] MEMO: Props same, SKIPPING re-render");
  }

  // Return true if props are equal (skip render)
  // Return false if props are different (allow render)
  return areEqual;
});
