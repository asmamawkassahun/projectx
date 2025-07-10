import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileIcon from './FileIcon';

interface File {
  name: string;
  path: string;
}

interface MarkdownFile {
  name: string;
  path: string;
  content: string;
  file_url?: string;
}

// Helper function to detect file type
const isHtmlFile = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ['html', 'htm'].includes(ext) || filename.toLowerCase().includes('html');
};

const FilePreview: React.FC<{
  file: File | MarkdownFile;
  isMarkdown?: boolean;
  onFileClick: (file: any) => void;
  onDownload: (file: any) => boolean;
  isDownloading: boolean;
  downloadError?: string;
}> = ({ file, isMarkdown, onFileClick, onDownload, isDownloading, downloadError }) => {
  const isHtml = isHtmlFile(file.name);
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Check if file is an image
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt);
  
  // Check if file is a video
  const isVideo = ['mp4', 'webm', 'mov'].includes(fileExt);
  
  // Check if file is a text file
  const isText = ['txt', 'log', 'csv', 'json', 'js', 'ts', 'py', 'html', 'css'].includes(fileExt);
  
  // Get the file URL (could be in file_url or path property)
  const fileUrl = (file as any).file_url || file.path;

  // Add state for hover effect on images and videos
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`flex flex-col ${downloadError ? 'bg-red-50 border-red-200' : 
        'bg-indigo-50 border-indigo-200'} 
        rounded-lg overflow-hidden border relative transition-all duration-200 hover:shadow-md`}
      style={{ maxWidth: '180px' }}
    >
      {/* Preview area */}
      <button
        onClick={() => onFileClick(file)}
        className="w-full flex flex-col items-center"
      >
        <div 
          className="w-full h-24 flex items-center justify-center p-2 relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isImage && fileUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={fileUrl} 
                alt={file.name} 
                className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.05]"
              />
              {isHovered && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded transition-opacity duration-200">
                  <div className="bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ) : isVideo && fileUrl ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black/10 rounded">
              <video 
                src={fileUrl}
                className="max-h-full max-w-full object-contain rounded"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded transition-colors duration-200 hover:bg-black/30">
                <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm transform transition-transform duration-200 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                {isHovered && (
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    Play
                  </div>
                )}
              </div>
            </div>
          ) : isText ? (
            <div className="w-full h-full bg-white rounded border border-gray-200 p-1 overflow-hidden flex items-center justify-center text-xs text-gray-500 font-mono">
              <div className="line-clamp-3 text-center">Text file</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              {isMarkdown ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              ) : isHtml ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              ) : (
                <FileIcon filename={file.name} />
              )}
            </div>
          )}
        </div>
        
        {/* Filename */}
        <div className={`w-full px-3 py-2 ${
          downloadError ? 'text-red-800' : 
          'text-indigo-800'
        } text-xs font-medium truncate text-center`}>
          {file.name}
        </div>
      </button>
      
      {/* Download button */}
      <div className="flex justify-center px-3 py-2 border-t border-gray-200 bg-white/50">
        <button 
          onClick={() => onDownload(file)}
          disabled={isDownloading}
          className={`px-3 py-1 rounded text-xs flex items-center justify-center w-full ${
            isDownloading ? 'cursor-not-allowed opacity-70 bg-gray-100' : 
            downloadError ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' : 
            'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
          } transition-colors`}
          title={downloadError ? `Error: ${downloadError}` : "Download file"}
        >
          {isDownloading ? (
            <svg className="animate-spin w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : downloadError ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Error</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download</span>
            </>
          )}
        </button>
      </div>
      
      {/* Error message tooltip */}
      {downloadError && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-red-200 rounded-lg p-3 text-xs text-red-700 shadow-lg z-10 max-w-[250px] mx-auto transform-gpu animate-fade-in-down">
          <div className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className="flex-1">
              <p className="font-medium mb-1">Download Failed</p>
              <p className="text-red-600">{downloadError}</p>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-t border-l border-red-200"></div>
        </div>
      )}
    </div>
  );
};

export default FilePreview; 