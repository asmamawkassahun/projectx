import React, { useEffect, RefObject, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewProps {
  videoStream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement>;
  isVisible: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoStream,
  videoRef,
  isVisible,
}) => {
  useEffect(() => {
    console.log("[VideoPreview] Setting video stream", videoStream);
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, videoRef]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {/* {videoStream && ( */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 p-0"
      >
        <div className="relative h-full w-full">
          <video
            className="object-cover h-full w-full"
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
          {/* Gradient overlay at the bottom */}
          {/* <div
            className="absolute left-0 bottom-0 w-full h-[100px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.0) 100%)",
            }}
          /> */}

          <div className="absolute left-0 bottom-0 w-full h-[100px]  pointer-events-none">
            {/* Layer 5: 32px blur */}
            <div
              className="h-full w-full"
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 2%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 100%)",
                WebkitMask:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0) 2%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 100%)",
              }}
            />
          </div>
        </div>
      </motion.div>
      {/* )}*/}
    </AnimatePresence>
  );
};

export default VideoPreview;
