import React, { useState, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import FileIcon from './FileIcon';
import type { Components } from 'react-markdown';
import InChatUpdates from './in_chat_updates/InChatUpdates';

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

interface MessagePart {
  text: string;
  style: string;
}

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string | null;
  timestamp?: Date;
  isLoading?: boolean;
  files?: File[];
  markdownFiles?: MarkdownFile[];
  onFileClick?: (file: File) => void;
  onMarkdownFileClick?: (file: MarkdownFile) => void;
  type?: string;
  toolName?: string;
  isActive?: boolean;
  messageParts?: MessagePart[];
  markdownData?: { filename: string; path: string; file_url?: string; content?: string; };
  inChatUpdates?: any[];
}

// Add helper function to detect file type
const isHtmlFile = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ['html', 'htm'].includes(ext) || filename.toLowerCase().includes('html');
};

// Add a new FilePreview component
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

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  role, 
  content, 
  timestamp,
  isLoading = false,
  files = [],
  markdownFiles = [],
  onFileClick,
  onMarkdownFileClick,
  type,
  toolName,
  isActive = false,
  messageParts = [],
  markdownData,
  inChatUpdates = []
}) => {
  const isUser = role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<{[key: string]: boolean}>({});
  const [downloadErrors, setDownloadErrors] = useState<{[key: string]: string}>({});
  
  // If this is a json_only message, render just the code block without the chat bubble
  if (type === 'json_only') {
    const match = /```json\n([\s\S]*?)\n```/.exec(content || '');
    if (match) {
      return (
        <div className="w-full px-4 my-4">
          <div className="code-block relative rounded-lg overflow-hidden bg-zinc-800/50 max-w-full">
            <div className="bg-zinc-800/50 px-4 py-2 text-xs text-zinc-200 font-mono border-b border-zinc-700/50 flex items-center justify-between">
              <span>json</span>
              <span className="text-zinc-300">code</span>
            </div>
            <div className="overflow-x-auto">
              <pre className="p-4 text-[13px] leading-relaxed text-zinc-50 whitespace-pre-wrap break-all">
                <code className="language-json text-zinc-50">
                  {match[1]}
                </code>
              </pre>
            </div>
          </div>
        </div>
      );
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatFullTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Define custom markdown components
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return (
        <div className="code-block relative my-3 rounded-lg overflow-hidden bg-gray-50 max-w-full border border-gray-200">
          {match && (
            <div className="bg-gray-100 px-4 py-2 text-xs font-mono border-b border-gray-200 flex items-center justify-between">
              <span className="text-gray-600">{match[1]}</span>
              <span className="text-gray-500">code</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <pre className="p-4 text-[13px] leading-relaxed whitespace-pre-wrap">
              <code className={`${match ? `language-${match[1]}` : ''}`} {...props}>
                {children}
              </code>
            </pre>
          </div>
        </div>
      );
    },
    p({ children }) {
      return <p className="mb-3 leading-relaxed font-normal">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    pre({ children }) {
      return <pre>{children}</pre>;
    },
    a({ href, children }) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {children}
        </a>
      );
    },
    // Add specific styling for HTML preview
    div({ children }) {
      return <div>{children}</div>;
    },
    span({ children }) {
      return <span>{children}</span>;
    },
    h1({ children }) {
      return <h1 className="text-2xl font-semibold mb-4">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-xl font-semibold mb-3">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-lg font-semibold mb-2">{children}</h3>;
    },
    h4({ children }) {
      return <h4 className="font-semibold mb-2">{children}</h4>;
    },
    strong({ children }) {
      return <strong className="font-semibold">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic">{children}</em>;
    }
  };

  // Handle file download
  const handleDownload = (file: File) => {
    // Prevent multiple downloads of the same file
    if (downloadingFiles[file.path]) {
      return false;
    }

    // Clear previous errors for this file
    if (downloadErrors[file.path]) {
      setDownloadErrors(prev => {
        const updated = {...prev};
        delete updated[file.path];
        return updated;
      });
    }

    // Set loading state for this file
    setDownloadingFiles(prev => ({...prev, [file.path]: true}));
    
    // For files, we need to fetch the content first to ensure download
    fetch(file.path, {
      method: 'GET',
      cache: 'no-store', // Prevent caching issues
      mode: 'cors',      // Allow cross-origin requests
      credentials: 'same-origin',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a blob URL to force download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Show temporary success indicator (we could add a visual toast here)
        console.log(`Successfully downloaded ${file.name}`);
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          // Clear loading state
          setDownloadingFiles(prev => {
            const updated = {...prev};
            delete updated[file.path];
            return updated;
          });
        }, 100);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        // Set a more user-friendly error message
        const errorMessage = error.message || 'Failed to download';
        const userFriendlyError = errorMessage.includes('Failed to download: 404') 
          ? 'File not found' 
          : errorMessage.includes('Failed to download: 403')
          ? 'Access denied'
          : errorMessage.includes('Failed to download: 5')
          ? 'Server error'
          : 'Download failed';
          
        setDownloadErrors(prev => ({
          ...prev,
          [file.path]: userFriendlyError
        }));
        
        // Clear loading state
        setDownloadingFiles(prev => {
          const updated = {...prev};
          delete updated[file.path];
          return updated;
        });
      });
      
    // Prevent event bubbling
    return false;
  };
  
  // Handle markdown file download
  const handleMarkdownDownload = (file: MarkdownFile) => {
    // Prevent multiple downloads of the same file
    if (downloadingFiles[file.path]) {
      return false;
    }

    // Clear previous errors for this file
    if (downloadErrors[file.path]) {
      setDownloadErrors(prev => {
        const updated = {...prev};
        delete updated[file.path];
        return updated;
      });
    }

    // Set loading state for this file
    setDownloadingFiles(prev => ({...prev, [file.path]: true}));

    try {
      if (file.file_url) {
        // For remote files that have a URL, fetch it first to handle potential errors
        fetch(file.file_url, { 
          method: 'GET',
          cache: 'no-store',
          mode: 'cors',
          credentials: 'same-origin'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            // Create a blob URL to force download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              // Clear loading state
              setDownloadingFiles(prev => {
                const updated = {...prev};
                delete updated[file.path];
                return updated;
              });
            }, 100);
          })
          .catch(error => {
            console.error('Error downloading markdown file:', error);
            // Same user-friendly error handling as in handleDownload
            const errorMessage = error.message || 'Failed to download';
            const userFriendlyError = errorMessage.includes('Failed to download: 404') 
              ? 'File not found' 
              : errorMessage.includes('Failed to download: 403')
              ? 'Access denied'
              : errorMessage.includes('Failed to download: 5')
              ? 'Server error'
              : 'Download failed';
              
            setDownloadErrors(prev => ({
              ...prev,
              [file.path]: userFriendlyError
            }));
            
            // Clear loading state
            setDownloadingFiles(prev => {
              const updated = {...prev};
              delete updated[file.path];
              return updated;
            });
          });
      } else {
        // For markdown files without URL, create a blob to ensure it downloads
        const blob = new Blob([file.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          // Clear loading state
          setDownloadingFiles(prev => {
            const updated = {...prev};
            delete updated[file.path];
            return updated;
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error downloading markdown file:', error);
      setDownloadErrors(prev => ({
        ...prev,
        [file.path]: error instanceof Error ? error.message : 'Download failed'
      }));
      // Clear loading state
      setDownloadingFiles(prev => {
        const updated = {...prev};
        delete updated[file.path];
        return updated;
      });
    }
    
    // Prevent event bubbling
    return false;
  };

  // Get the appropriate icon for the status update based on the tool name or type
  const getStatusIcon = () => {    
    if (type === 'live_status') {
      switch (toolName) {
        case 'web_browser':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          );
        case 'bash':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
          );
        case 'filesystem_manager':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <path d="M20 11H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"></path>
              <path d="M14 7V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10"></path>
              <path d="M18 7V5a2 2 0 0 0-2-2h-2"></path>
            </svg>
          );
        case 'task_planner':
          if (content?.includes("Completed step") || content?.includes("Completed:")) {
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            );
          } else {
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            );
          }
        default:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          );
      }
    }
    
    // Default icon for thinking state
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    );
  };

  // Get the appropriate style for message part based on its style identifier
  const getStyleForMessagePart = (style: string): string => {
    switch (style) {
      case 'url':
        return 'text-indigo-600 font-mono tracking-tight';
      case 'command':
        return 'text-indigo-600 font-mono tracking-tight';
      case 'filename':
        return 'text-indigo-600 font-mono tracking-tight';
      case 'query':
        return 'text-indigo-600 font-mono tracking-tight';
      case 'task':
        return 'text-gray-700 font-medium';
      case 'task-completed':
        return 'text-gray-700 font-medium';
      case 'step':
        return 'text-gray-700 font-medium';
      case 'step-completed':
        return 'text-gray-700 font-medium';
      case 'success':
        return 'text-indigo-600 font-normal';
      case 'normal':
      default:
        return 'text-gray-600 font-normal';
    }
  };

  // Get background color based on tool name
  const getStatusBgColor = () => {
    if (type === 'live_status') {
      if (toolName === 'task_planner') {
        if (content?.includes("Completed step") || content?.includes("Completed:")) {
          return 'bg-indigo-50';
        } else if (content?.includes('Step') || content?.includes('Working on') && !content?.includes('Planning')) {
          return 'bg-gray-50';
        }
      }
      return 'bg-gray-50';
    }
    
    return 'bg-gray-50';
  };

  // Get the pulse color based on tool name
  const getPulseColor = () => {
    if (toolName === 'task_planner') {
      if (content?.includes("Completed step") || content?.includes("Completed:")) {
        return 'bg-indigo-500';
      } else if (content?.includes('Step') || content?.includes('Working on') && !content?.includes('Planning')) {
        return 'bg-indigo-500';
      }
    }
    return 'bg-indigo-500';
  };

  // Parse status message and convert it to structured MessagePart[] format
  const parseStatusMessage = (content: string): ReactNode => {
    let messageParts: MessagePart[] = [];
    
    // Handle null or undefined content
    if (!content) {
      return <span className="text-gray-600 font-normal">No message</span>;
    }
    
    // Style different parts based on patterns
    if (content.startsWith('Browsing ')) {
      const url = content.substring(9); // Remove 'Browsing ' prefix
      messageParts = [
        { text: 'Browsing ', style: 'normal' },
        { text: url, style: 'url' }
      ];
    } 
    else if (content.startsWith('Executing: ')) {
      const command = content.substring(11); // Remove 'Executing: ' prefix
      messageParts = [
        { text: 'Executing: ', style: 'normal' },
        { text: command, style: 'command' }
      ];
    }
    else if (content.includes('file ')) {
      // Handle all file operations with a filename
      if (content.startsWith('Reading file ') || 
         content.startsWith('Writing to file ') || 
         content.startsWith('Creating file ') ||
         content.startsWith('Deleting file ') ||
         content.startsWith('Moving file ') ||
         content.startsWith('Copying file ') ||
         content.startsWith('Replacing file ') ||
         content.startsWith('Viewing file ') ||
         content.startsWith('Checking if file exists ')) {
        
        const parts = content.split(' file ');
        const action = parts[0];
        const filename = parts[1];
        
        messageParts = [
          { text: action + ' file ', style: 'normal' },
          { text: filename, style: 'filename' }
        ];
      }
      // Handle "Inserting text into file" case separately
      else if (content.startsWith('Inserting text into file ')) {
        const filename = content.substring('Inserting text into file '.length);
        messageParts = [
          { text: 'Inserting text into file ', style: 'normal' },
          { text: filename, style: 'filename' }
        ];
      }
      // Handle "Deleting lines from file" case
      else if (content.startsWith('Deleting lines from file ')) {
        const filename = content.substring('Deleting lines from file '.length);
        messageParts = [
          { text: 'Deleting lines from file ', style: 'normal' },
          { text: filename, style: 'filename' }
        ];
      }
    }
    else if (content.startsWith('Searching for ') && content.includes(' in ')) {
      const queryStart = 'Searching for '.length;
      const inIndex = content.indexOf(' in ');
      const query = content.substring(queryStart, inIndex);
      const filename = content.substring(inIndex + 4); // +4 for ' in ' length
      
      messageParts = [
        { text: 'Searching for ', style: 'normal' },
        { text: query, style: 'query' },
        { text: ' in ', style: 'normal' },
        { text: filename, style: 'filename' }
      ];
    }
    else if (content.startsWith('Searching the web for ')) {
      const query = content.substring(21); // Remove 'Searching the web for ' prefix
      messageParts = [
        { text: 'Searching the web for ', style: 'normal' },
        { text: query, style: 'query' }
      ];
    }
    else if (content.startsWith('Listing directory contents')) {
      messageParts = [
        { text: 'Listing directory contents', style: 'normal' }
      ];
    }
    else if (content.startsWith('Working on: ')) {
      const task = content.substring(12); // Remove 'Working on: ' prefix
      messageParts = [
        { text: 'Working on: ', style: 'normal' },
        { text: task, style: 'task' }
      ];
    }
    else if (content.startsWith('Completed: ')) {
      const task = content.substring(11); // Remove 'Completed: ' prefix
      messageParts = [
        { text: 'Completed: ', style: 'success' },
        { text: task, style: 'task-completed' }
      ];
    }
    else if (content.startsWith('Clicking element')) {
      messageParts = [
        { text: 'Clicking element', style: 'normal' }
      ];
    }
    else if (content.startsWith('Opening browser')) {
      messageParts = [
        { text: 'Opening browser', style: 'normal' }
      ];
    }
    else if (content.startsWith('Scrolling')) {
      messageParts = [
        { text: 'Scrolling', style: 'normal' }
      ];
    }
    else if (content.startsWith('Taking screenshot')) {
      messageParts = [
        { text: 'Taking screenshot', style: 'normal' }
      ];
    }
    else if (content.startsWith('Typing text')) {
      messageParts = [
        { text: 'Typing text', style: 'normal' }
      ];
    }
    else if (content.startsWith('Opening new tab')) {
      messageParts = [
        { text: 'Opening new tab', style: 'normal' }
      ];
    }
    else if (content.startsWith('Working on step ')) {
      const step = content.substring('Working on step '.length);
      messageParts = [
        { text: 'Working on step ', style: 'normal' },
        { text: step, style: 'step' }
      ];
    }
    else if (content.startsWith('Completed step ')) {
      const step = content.substring('Completed step '.length);
      messageParts = [
        { text: 'Completed step ', style: 'success' },
        { text: step, style: 'step-completed' }
      ];
    }
    else if (content.startsWith('Completing task...')) {
      messageParts = [
        { text: 'Completing task...', style: 'success' }
      ];
    }
    else if (content.startsWith('Undoing last operation')) {
      messageParts = [
        { text: 'Undoing last operation', style: 'normal' }
      ];
    }
    // Default case
    else {
      messageParts = [
        { text: content, style: 'normal' }
      ];
    }
    
    return renderMessageParts(messageParts);
  };

  // Render message parts with appropriate styling
  const renderMessageParts = (messageParts: MessagePart[]): ReactNode => {
    return (
      <>
        {messageParts.map((part, index) => (
          <span key={index} className={getStyleForMessagePart(part.style)}>
            {part.text}
          </span>
        ))}
      </>
    );
  };

  // File attachments section - updated to use our new FilePreview component
  const renderFileAttachments = () => {
    if (!(files?.length > 0 || markdownFiles?.length > 0)) return null;

    return (
      <div className="px-3 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files?.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onFileClick={onFileClick!}
              onDownload={handleDownload}
              isDownloading={!!downloadingFiles[file.path]}
              downloadError={downloadErrors[file.path]}
            />
          ))}
          {markdownFiles?.map((file, index) => (
            <FilePreview
              key={`md-${index}`}
              file={file}
              isMarkdown={true}
              onFileClick={onMarkdownFileClick!}
              onDownload={handleMarkdownDownload}
              isDownloading={!!downloadingFiles[file.path]}
              downloadError={downloadErrors[file.path]}
            />
          ))}
        </div>
      </div>
    );
  };

  // Add a helper to check if this status update is about an HTML file
  const isHtmlFileStatus = (): boolean => {
    // Check if this is a file operation status
    if (type !== 'live_status' || toolName !== 'filesystem_manager') return false;
    
    // Extract the filename from the status message
    let filename = '';
    if (content?.startsWith('Reading file ')) {
      filename = content.substring('Reading file '.length);
    } else {
      // Only 'Reading file' operations should be clickable
      return false;
    }
    
    // Check if the filename has an HTML extension
    return isHtmlFile(filename);
  };

  // Update the isMarkdownFileStatus function to avoid conflicts with HTML files
  const isMarkdownFileStatus = (): boolean => {
    // If markdownData is explicitly provided, this is a markdown file
    if (markdownData) return true;
    
    // Check if this is a file operation status
    if (type !== 'live_status' || toolName !== 'filesystem_manager') return false;
    
    // Extract the filename from the status message
    let filename = '';
    if (content?.startsWith('Reading file ')) {
      filename = content.substring('Reading file '.length);
    } else {
      // Only 'Reading file' operations should be clickable
      return false;
    }
    
    // Skip HTML files
    if (isHtmlFile(filename)) return false;
    
    // Check if the filename has a markdown extension
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn'];
    return markdownExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  // Handle clicking on a markdown file status update
  const handleMarkdownStatusClick = () => {
    if (!onMarkdownFileClick || !isMarkdownFileStatus()) return;

    // Extract filename from content
    let filename = '';
    let path = '';
    let fileContent = "Loading content...";
    let fileUrl = undefined;
    
    if (markdownData) {
      filename = markdownData.filename;
      path = markdownData.path;
      fileUrl = markdownData.file_url;
      
      // Use the content from markdownData if available
      if (markdownData.content) {
        fileContent = markdownData.content;
      }
    } else {
      // Extract filename from status message content
      if (content?.startsWith('Reading file ')) {
        filename = content.substring('Reading file '.length);
      } else if (content?.startsWith('Writing to file ')) {
        filename = content.substring('Writing to file '.length);
      } else if (content?.startsWith('Creating file ')) {
        filename = content.substring('Creating file '.length);
      }
      
      path = filename; // Use filename as path if not provided
    }
    
    // Create a temporary markdown file object to pass to the handler
    const markdownFile: MarkdownFile = {
      name: filename,
      path: path,
      content: fileContent,
      file_url: fileUrl
    };
    
    onMarkdownFileClick(markdownFile);
  };

  // Handle clicking on an HTML file status update
  const handleHtmlStatusClick = () => {
    if (!onFileClick || !isHtmlFileStatus()) return;

    // Extract filename from content
    let filename = '';
    if (content?.startsWith('Reading file ')) {
      filename = content.substring('Reading file '.length);
    }
    
    // Create a file object to pass to the handler
    const file: File = {
      name: filename,
      path: filename // Use filename as path if not provided
    };
    
    onFileClick(file);
  };

  // Render a status update UI for various operation types
  if (type === 'live_status') {    
    const shouldAnimate = isActive !== undefined ? isActive : true;
    const isTaskStep = toolName === 'task_planner' && 
      (content?.includes("Starting step") || content?.includes("Completed step") || 
       content?.includes("Working on:") || content?.includes("Completed:"));
    const isCompleted = content?.includes("Completed step") || content?.includes("Completed:");
    const isClickable = isMarkdownFileStatus() || isHtmlFileStatus();
    const isHtmlClick = isHtmlFileStatus();
    
    // Determine message content to display (either from messageParts prop or by parsing content)
    const messageContent = messageParts && messageParts.length > 0 
      ? renderMessageParts(messageParts) 
      : parseStatusMessage(content || '');
    
    return (
      <div className="mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start px-4"
        >
          <div 
            className={`${getStatusBgColor()} text-gray-800 rounded-${isTaskStep ? 'xl' : 'full'} p-2.5 px-4 ${isTaskStep ? 'max-w-[95%]' : 'max-w-[85%]'} flex items-center gap-3 border border-gray-200 shadow-sm ${isClickable ? `cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors group` : ''}`}
            onClick={isHtmlClick ? handleHtmlStatusClick : isMarkdownFileStatus() ? handleMarkdownStatusClick : undefined}
            title={isClickable ? `Click to view file content` : undefined}
          >
            <div className="flex-shrink-0 relative">
              {getStatusIcon()}
              {shouldAnimate && !isCompleted && (
                <motion.div 
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${getPulseColor()} rounded-full`}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
            {shouldAnimate && !isCompleted ? (
              <motion.div 
                className="text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {messageContent}
              </motion.div>
            ) : (
              <div className="text-sm">
                {messageContent}
              </div>
            )}
            {isClickable && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 ml-1 group-hover:text-indigo-700">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span className="text-xs text-indigo-600 group-hover:text-indigo-700 hidden group-hover:inline transition-all">
                  View file
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Add in-chat updates for status updates */}
        {inChatUpdates && inChatUpdates.length > 0 && (
          <div className="w-full mt-2 pl-5">
            <InChatUpdates updates={inChatUpdates} />
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4 px-4`}
    >
      <div 
        className={`max-w-[85%] rounded-2xl relative group ${
          role === 'user' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {timestamp && (
          <div className="absolute -top-6 left-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {formatFullTimestamp(new Date(timestamp))}
          </div>
        )}
        <div className={`px-4 py-3 ${(files?.length || markdownFiles?.length) ? 'pb-2' : ''} ${(content?.length || 0) < 10 ? 'min-w-[4rem]' : ''}`}>
          <div className={`prose max-w-none flex-1 ${role === 'user' ? 'prose-invert' : ''}`}>
            <ReactMarkdown components={components}>
              {content || ''}
            </ReactMarkdown>
          </div>
          
          {/* Copied feedback message */}
          {isCopied && (
            <motion.div 
              className="absolute -bottom-9 right-2 bg-white text-indigo-600 text-xs px-2 py-1 rounded-md border border-gray-200 shadow-md z-10"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              Copied to clipboard!
            </motion.div>
          )}

          {isLoading && (
            <div className="mt-2 flex items-center gap-1.5">
              <motion.div 
                className="w-2 h-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-gray-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          )}
        </div>

        {renderFileAttachments()}
        
        {/* Copy button that appears on hover */}
        <button
          onClick={handleCopy}
          className="absolute bottom-1 -right-3 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-indigo-600 hover:border-indigo-200 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
          title={isCopied ? "Copied!" : "Copy message"}
        >
          {isCopied ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </motion.div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ChatMessage; 