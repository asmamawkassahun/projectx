import { useState, useEffect } from "react";
import { UseMediaStreamResult } from "./use-media-stream-mux";

export function useWebcam(): UseMediaStreamResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const handleStreamEnded = () => {
      setIsStreaming(false);
      setStream(null);
    };
    if (stream) {
      stream
        .getTracks()
        .forEach((track) => track.addEventListener("ended", handleStreamEnded));
      return () => {
        stream
          .getTracks()
          .forEach((track) =>
            track.removeEventListener("ended", handleStreamEnded),
          );
      };
    }
  }, [stream]);

  const start = async () => {
    // Detect if we're on a mobile device - only check if navigator is available
    const isMobile = typeof window !== 'undefined' && typeof navigator !== 'undefined' 
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      : false;
    
    let mediaStream: MediaStream;
    
    if (isMobile) {
      try {
        // Try rear camera first on mobile devices
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Rear camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });
      } catch (error) {
        console.warn("Rear camera not available, falling back to front camera:", error);
        // Fallback to front camera if rear camera fails
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // Front camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });
      }
    } else {
      // For desktop, use default camera
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
    }
    
    setStream(mediaStream);
    setIsStreaming(true);
    return mediaStream;
  };

  const stop = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const result: UseMediaStreamResult = {
    type: "webcam",
    start,
    stop,
    isStreaming,
    stream,
  };

  return result;
} 