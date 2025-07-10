import React, { useEffect, RefObject, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPreviewProps {
  videoStream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement>;
  onVideoStreamChange: Dispatch<SetStateAction<MediaStream | null>>;
  isVisible: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  videoStream, 
  videoRef,
  onVideoStreamChange,
  isVisible 
}) => {
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, videoRef]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {videoStream && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-5 bottom-24 z-[60]"
        >
          <div className="relative">
            <video
              className="w-60 h-auto rounded-xl border border-white/20 shadow-lg bg-black"
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
            
            {/* Recording indicator */}
            <div className="absolute top-2 right-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/80 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPreview; 