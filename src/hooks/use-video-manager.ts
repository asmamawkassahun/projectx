import { useState, useEffect, useCallback, useRef } from "react";
import { UseMediaStreamResult } from "./use-media-stream-mux";
import { useWebcam } from "./use-webcam";
import { useScreenCapture } from "./use-screen-capture";

type VideoManagerResult = {
  videoStreams: [UseMediaStreamResult, UseMediaStreamResult]; // [webcam, screenCapture]
  activeVideoStream: MediaStream | null;
  setActiveVideoStream: (stream: MediaStream | null) => void;
  changeStreams: (next?: UseMediaStreamResult) => Promise<MediaStream | null>;
  setupVideoFrameCapture: (
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    sendFrameCallback: (data: string) => void,
    isConnected: boolean
  ) => () => void;
};

// Helper function to get the visible area of a transformed video element
function getVideoVisibleArea(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  const style = window.getComputedStyle(video);

  // Get transform matrix if any
  const transform = style.transform;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  // Parse transform matrix to extract scale and translation
  if (transform && transform !== "none") {
    const values = transform.match(/matrix.*\((.+)\)/);
    if (values && values[1]) {
      const matrix = values[1].split(", ").map(parseFloat);
      if (matrix.length >= 6) {
        scale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        translateX = matrix[4];
        translateY = matrix[5];
      }
    }
  }

  // Calculate the visible area within the video's natural dimensions
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (scale <= 1) {
    // No zoom, capture full video
    return {
      sourceX: 0,
      sourceY: 0,
      sourceWidth: videoWidth,
      sourceHeight: videoHeight,
      scale: 1,
    };
  }

  // Calculate what portion of the video is visible when zoomed
  const visibleWidth = videoWidth / scale;
  const visibleHeight = videoHeight / scale;

  // Calculate the center offset based on translation
  const centerX = videoWidth / 2;
  const centerY = videoHeight / 2;

  // Convert CSS transform translate to video coordinates
  const videoTranslateX = -(translateX / rect.width) * videoWidth;
  const videoTranslateY = -(translateY / rect.height) * videoHeight;

  // Calculate source coordinates (what part of the original video to capture)
  let sourceX = centerX - visibleWidth / 2 + videoTranslateX;
  let sourceY = centerY - visibleHeight / 2 + videoTranslateY;

  // Clamp to video boundaries
  sourceX = Math.max(0, Math.min(sourceX, videoWidth - visibleWidth));
  sourceY = Math.max(0, Math.min(sourceY, videoHeight - visibleHeight));

  return {
    sourceX: Math.round(sourceX),
    sourceY: Math.round(sourceY),
    sourceWidth: Math.round(visibleWidth),
    sourceHeight: Math.round(visibleHeight),
    scale,
  };
}

export function useVideoManager(): VideoManagerResult {
  // Initialize the media stream hooks
  const webcam = useWebcam();
  const screenCapture = useScreenCapture();
  const videoStreams: [UseMediaStreamResult, UseMediaStreamResult] = [
    webcam,
    screenCapture,
  ];

  // State for the active video stream
  const [activeVideoStream, setActiveVideoStream] =
    useState<MediaStream | null>(null);

  // Function to change between video sources
  const changeStreams = useCallback(
    async (next?: UseMediaStreamResult) => {
      if (next) {
        // Stop all other streams first before starting the new one
        videoStreams.forEach((msr) => {
          if (msr !== next && msr.isStreaming) {
            msr.stop();
          }
        });

        const mediaStream = await next.start();
        setActiveVideoStream(mediaStream);
        return mediaStream;
      } else {
        setActiveVideoStream(null);
        // Stop all streams
        videoStreams.forEach((msr) => msr.stop());
        return null;
      }
    },
    [videoStreams]
  );

  // Function to set up video frame capture for sending to the server
  const setupVideoFrameCapture = useCallback(
    (
      videoRef: React.RefObject<HTMLVideoElement>,
      canvasRef: React.RefObject<HTMLCanvasElement>,
      sendFrameCallback: (data: string) => void,
      isConnected: boolean
    ) => {
      // Return an effect cleanup function
      return () => {
        if (videoRef.current) {
          videoRef.current.srcObject = activeVideoStream;
        }

        let timeoutId = -1;

        function sendVideoFrame() {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (!video || !canvas) {
            // If video element is missing, try again in 100ms
            if (isConnected && activeVideoStream !== null) {
              timeoutId = window.setTimeout(sendVideoFrame, 100);
            }
            return;
          }

          // Check if video has loaded and has dimensions
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            if (isConnected && activeVideoStream !== null) {
              timeoutId = window.setTimeout(sendVideoFrame, 100);
            }
            return;
          }

          const ctx = canvas.getContext("2d")!;

          // Get the visible area considering any zoom/pan transforms
          const visibleArea = getVideoVisibleArea(video);

          // Set canvas size based on the captured area (scaled down for efficiency)
          const targetWidth = Math.round(visibleArea.sourceWidth * 0.25);
          const targetHeight = Math.round(visibleArea.sourceHeight * 0.25);

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          if (canvas.width + canvas.height > 0) {
            // Draw only the visible portion of the video
            ctx.drawImage(
              video,
              visibleArea.sourceX,
              visibleArea.sourceY,
              visibleArea.sourceWidth,
              visibleArea.sourceHeight,
              0,
              0,
              targetWidth,
              targetHeight
            );

            const base64 = canvas.toDataURL("image/jpeg", 1.0);
            const data = base64.slice(base64.indexOf(",") + 1, Infinity);
            sendFrameCallback(data);
          }

          if (isConnected) {
            timeoutId = window.setTimeout(sendVideoFrame, 1000 / 1.5);
          }
        }

        if (isConnected && activeVideoStream !== null) {
          // Use a small delay to ensure the video element is rendered and ready
          setTimeout(() => {
            requestAnimationFrame(sendVideoFrame);
          }, 100);
        }

        return () => {
          clearTimeout(timeoutId);
        };
      };
    },
    [activeVideoStream]
  );

  return {
    videoStreams,
    activeVideoStream,
    setActiveVideoStream,
    changeStreams,
    setupVideoFrameCapture,
  };
}
