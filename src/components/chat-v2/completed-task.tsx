"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Plus,
  Circle,
  Download,
  RefreshCw,
  FileText,
  Image,
  Code,
  Video,
  File as FileIcon,
  X,
} from "lucide-react";
import { File } from "@/types";
import FileViewer from "@/components/FileViewer";

interface CompletedTaskProps {
  onDownload?: () => void;
  onNewTask?: () => void;
  taskTitle?: string;
  completionTime?: string;

  darkMode?: boolean;
  files?: File[];
}

export default function CompletedTask({
  onDownload,
  onNewTask,
  taskTitle = "Your Task",
  completionTime = "2 minutes",
  darkMode = false,
  files,
}: CompletedTaskProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    if (onDownload) {
      await onDownload();
    }
    // Simulate download time
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  // Helper function to get file icon and color based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return {
          icon: Image,
          color: "from-purple-500 to-pink-500",
          size: "col-span-2 row-span-2",
        };
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
      case "webm":
        return {
          icon: Video,
          color: "from-red-500 to-orange-500",
          size: "col-span-2 row-span-1",
        };
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "py":
      case "java":
      case "cpp":
      case "c":
      case "html":
      case "css":
      case "json":
        return {
          icon: Code,
          color: "from-blue-500 to-cyan-500",
          size: "col-span-1 row-span-1",
        };
      case "txt":
      case "md":
      case "doc":
      case "docx":
      case "pdf":
        return {
          icon: FileText,
          color: "from-green-500 to-emerald-500",
          size: "col-span-1 row-span-2",
        };
      default:
        return {
          icon: FileIcon,
          color: "from-gray-500 to-gray-600",
          size: "col-span-1 row-span-1",
        };
    }
  };

  // Helper function to handle file click
  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setIsFileModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
  };

  // Determine text and background colors based on dark mode
  const textColor = darkMode ? "text-white" : "text-[#1e1e1e]";
  const textColorMuted = darkMode ? "text-white/70" : "text-[#1e1e1e]/70";
  const bgColor = darkMode ? "bg-[#2a2a2a]" : "bg-white";
  const bgColorLight = darkMode ? "bg-white/10" : "bg-[#1e1e1e]/5";

  return (
    <>
      <motion.div
        className="w-full h-full flex flex-col items-center p-8 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={`text-3xl font-bold ${textColor} mb-2 tracking-tight`}>
            Task Completed!
          </h2>
          <p className={`${textColorMuted} text-lg tracking-tight`}>
            {taskTitle} has been completed successfully
          </p>
        </motion.div>

        {/* Scrollable Grid Container */}
        <div className="w-full flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-4 auto-rows-auto pb-8">
            {/* Render actual files if available */}
            {files &&
              files.length > 0 &&
              files.map((file, index) => {
                const {
                  icon: IconComponent,
                  color,
                  size,
                } = getFileIcon(file.name);
                return (
                  <motion.div
                    key={file.path}
                    className={`relative ${size} min-h-[120px] rounded-3xl overflow-hidden bg-gradient-to-br ${color} cursor-pointer hover:scale-105 transition-transform`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium line-clamp-2 break-words px-1">
                          {file.name}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* Action Buttons - Hidden as requested */}
        {/* 
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="flex items-center justify-center gap-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-lg transition-colors font-medium"
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDownloading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Results</span>
              </>
            )}
          </motion.button>

          <motion.button
            className={`flex items-center justify-center gap-2 ${bgColor} hover:bg-gray-50 ${textColor} px-6 py-3 rounded-lg transition-colors font-medium border border-[#1e1e1e]/20`}
            onClick={onNewTask}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>Start New Task</span>
          </motion.button>
        </motion.div>
        */}
      </motion.div>

      {/* File Viewer Modal */}
      {isFileModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="bg-white rounded-lg w-full h-full max-w-[80vw] max-h-[80vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    {selectedFile &&
                      (() => {
                        const { icon: IconComponent } = getFileIcon(
                          selectedFile.name
                        );
                        return (
                          <IconComponent className="w-4 h-4 text-gray-600" />
                        );
                      })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedFile?.name}
                    </h3>
                    <p className="text-sm text-gray-500">File Viewer</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* File Viewer Content */}
              <div className="flex-1 overflow-hidden min-h-0">
                {selectedFile && (
                  <FileViewer
                    file={{
                      name: selectedFile.name,
                      path: selectedFile.path,
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
