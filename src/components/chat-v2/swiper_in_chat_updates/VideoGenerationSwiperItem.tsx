import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Video, Clock, AlertCircle } from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import VideoGenerationDetailedViewer from "./VideoGenerationDetailedViewer";

const VideoGenerationSwiperItem: React.FC<BaseSwiperItemProps> = ({
  updates,
  isActive,
  isDragging,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const videoGeneratedUpdate = updates.find((update) => update.event_type === "video_generated");
  const errorUpdate = updates.find((update) => update.event_type === "generation_error");

  // Calculate progress based on event types
  useEffect(() => {
    if (videoGeneratedUpdate) {
      setProgress(100);
      setStatusMessage("Video ready!");
      return;
    }

    if (errorUpdate) {
      setProgress(0);
      setStatusMessage("Generation failed");
      return;
    }

    let initialProgress = 0;
    let initialStatus = "Processing video...";

    switch (latestUpdate.event_type) {
      case "generation_started":
        initialProgress = 5;
        initialStatus = "Starting video generation...";
        break;
      case "status_checking":
        initialProgress = 15;
        initialStatus = "Checking status...";
        break;
      case "status_update":
        const retryCount = latestUpdate.data.retry_count || 0;
        initialProgress = 15 + Math.min(70, (retryCount / 20) * 70);
        if (retryCount < 3) {
          initialStatus = "Processing...";
        } else if (retryCount < 7) {
          initialStatus = "Generating frames...";
        } else if (retryCount < 12) {
          initialStatus = "Rendering...";
        } else {
          initialStatus = "Finalizing video...";
        }
        break;
      default:
        initialProgress = 10;
        initialStatus = "Creating video...";
    }

    setProgress(initialProgress);
    setStatusMessage(initialStatus);
  }, [latestUpdate, videoGeneratedUpdate, errorUpdate]);

  const getTitle = () => {
    if (videoGeneratedUpdate) return "Generated Video";
    if (errorUpdate) return "Video Generation Failed";
    return "Generating Video";
  };

  const handleClick = () => {
    if (videoGeneratedUpdate && videoGeneratedUpdate.data.video_url) {
      // Open video in detailed viewer modal
      setIsDetailedViewOpen(true);
    }
  };

  return (
    <div className="w-full">
      <h2
        className={`text-lg font-semibold mb-4 ${
          isActive ? "text-white" : "text-gray-400"
        } tracking-tight`}
      >
        {getTitle()}
      </h2>

      <div className="relative h-[400px] w-full">
        {videoGeneratedUpdate ? (
          // Show video preview when generated - Modern card design
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden bg-black shadow-2xl cursor-pointer group"
            onClick={handleClick}
            whileHover={isActive ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
          >
            <div className="relative h-full w-full">
              {/* Video thumbnail/preview */}
              {videoGeneratedUpdate.data.video_url ? (
                <video
                  src={videoGeneratedUpdate.data.video_url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  poster={videoGeneratedUpdate.data.thumbnail_url}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Dark overlay for better contrast */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />

              {/* Centered play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white group-hover:scale-110 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                </motion.div>
              </div>

              {/* Bottom overlay with video info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-1">Generated Video</h3>
                  <p className="text-sm text-gray-200 opacity-90 line-clamp-2 mb-3">
                    {videoGeneratedUpdate.data.prompt ||
                      videoGeneratedUpdate.data.filename ||
                      "AI-generated video clip"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-500/90 text-white px-3 py-1 rounded-full font-medium">
                      ✓ Ready
                    </span>
                    {videoGeneratedUpdate.data.width && videoGeneratedUpdate.data.height && (
                      <span className="text-xs text-gray-300">
                        {videoGeneratedUpdate.data.width}×{videoGeneratedUpdate.data.height}
                      </span>
                    )}
                    {videoGeneratedUpdate.data.duration && (
                      <span className="text-xs text-gray-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {videoGeneratedUpdate.data.duration}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : errorUpdate ? (
          // Show error state
          <motion.div className="absolute inset-0 rounded-2xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Generation Failed</h3>
              <p className="text-sm text-red-600 mb-6">
                {errorUpdate.data.error || "An error occurred while generating the video"}
              </p>
              <button className="px-6 py-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          // Show progress state
          <motion.div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
            <div className="h-full flex flex-col items-center justify-center p-8">
              {/* Animated progress circle */}
              <div className="relative w-24 h-24 mb-6">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-indigo-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-indigo-600 transition-all duration-500"
                    strokeWidth="4"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progress) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-700">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Creating Video</h3>
              <p className="text-sm text-indigo-600 text-center mb-6 flex items-center">
                {statusMessage}
                {progress < 100 && (
                  <span className="inline-flex ml-2 items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mx-0.5 animate-pulse"></span>
                    <span
                      className="w-1.5 h-1.5 bg-indigo-500 rounded-full mx-0.5 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-indigo-500 rounded-full mx-0.5 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </span>
                )}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between items-center text-xs text-indigo-600">
                  <span>Video Generation</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Generation Detailed Viewer */}
      <VideoGenerationDetailedViewer
        updates={updates}
        isOpen={isDetailedViewOpen}
        onClose={() => setIsDetailedViewOpen(false)}
      />
    </div>
  );
};

export default VideoGenerationSwiperItem;
