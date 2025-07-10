import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ExtendedMessage, InChatUpdate } from '@/types/voice-agent';

// Import the InChatUpdates component
import InChatUpdates from '../in_chat_updates/InChatUpdates';
// Import FilePreview component
import FilePreview from '../FilePreview';

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

interface EventsDisplayProps {
  displayedEvents: ExtendedMessage[];
  onFileClick?: (file: File) => void;
  onMarkdownFileClick?: (file: MarkdownFile) => void;
}

// Format timestamp for display
const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EventsDisplay: React.FC<EventsDisplayProps> = ({ 
  displayedEvents, 
  onFileClick, 
  onMarkdownFileClick 
}) => {
  if (displayedEvents.length === 0) return null;

  // Get the latest event
  const latestEvent = displayedEvents[displayedEvents.length - 1];
  
  // Determine if we have in-chat updates to display
  const hasInChatUpdates = latestEvent?.inChatUpdates && latestEvent.inChatUpdates.length > 0;
  
  // State for file downloads
  const [downloadingFiles, setDownloadingFiles] = useState<{[key: string]: boolean}>({});
  const [downloadErrors, setDownloadErrors] = useState<{[key: string]: string}>({});
  
  // Check if task is completed
  const isTaskCompleted = latestEvent?.type === 'completed';
  
  // Check if there are files to show
  const hasFiles = latestEvent?.files && latestEvent.files.length > 0;
  const hasMarkdownFiles = latestEvent?.markdownFiles && latestEvent.markdownFiles.length > 0;
  
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
      cache: 'no-store', 
      mode: 'cors',      
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
        // For remote files that have a URL, fetch it first
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
            setDownloadErrors(prev => ({
              ...prev,
              [file.path]: error.message
            }));
            
            // Clear loading state
            setDownloadingFiles(prev => {
              const updated = {...prev};
              delete updated[file.path];
              return updated;
            });
          });
      } else {
        // For markdown files without URL, create a blob from content
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
        [file.path]: (error as Error).message || 'Download failed'
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
  
  // Render file attachments
  const renderFileAttachments = () => {
    if (!isTaskCompleted || (!(hasFiles || hasMarkdownFiles))) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-8"
      >
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mr-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div className="text-sm text-indigo-700 font-medium">Files</div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {latestEvent.files?.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onFileClick={onFileClick || (() => {})}
                onDownload={handleDownload}
                isDownloading={!!downloadingFiles[file.path]}
                downloadError={downloadErrors[file.path]}
              />
            ))}
            {latestEvent.markdownFiles?.map((file, index) => (
              <FilePreview
                key={`md-${index}`}
                file={file}
                isMarkdown={true}
                onFileClick={onMarkdownFileClick || (() => {})}
                onDownload={handleMarkdownDownload}
                isDownloading={!!downloadingFiles[file.path]}
                downloadError={downloadErrors[file.path]}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* Main content area */}
      <div className="w-full flex-grow flex justify-center">
        {/* Center column for events */}
        <div className="relative w-full max-w-3xl h-full flex flex-col justify-end">
          {/* If we have in-chat updates, add bottom padding to make room for the updates card */}
          <div 
            className={cn(
              "relative w-full flex flex-col items-center",
              hasInChatUpdates ? "pb-[220px] md:pb-[180px]" : "pb-4"
            )}
            style={{ minHeight: '250px' }}
          >
            {/* Events stack */}
            <div className="w-full relative flex flex-col items-center justify-end" style={{ height: '50vh' }}>
              {/* Latest event at bottom */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`latest-${latestEvent.id}`}
                  className={cn(
                    "py-2 px-5 rounded-full text-sm max-w-[90%] z-20 absolute bottom-0",
                    latestEvent.content.startsWith("Working on") || 
                    latestEvent.content.startsWith("Executing")
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-300 text-indigo-900 font-medium" 
                      : latestEvent.type === 'live_status' 
                        ? "bg-indigo-100 border border-indigo-300 text-indigo-900" 
                        : "bg-gray-100 border border-gray-300 text-gray-900"
                  )}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    } 
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -45, 
                    scale: 0.9,
                    transition: { 
                      duration: 0.4,
                      ease: [0.25, 1, 0.5, 1]
                    } 
                  }}
                >
                  <div className="flex items-center">
                    {(latestEvent.content.startsWith("Working on") ||
                      latestEvent.content.startsWith("Executing")) && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 mr-2">
                        <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <span>{latestEvent.content}</span>
                    {latestEvent.timestamp && (
                      <span className="ml-2 text-xs opacity-60">
                        {formatTime(latestEvent.timestamp)}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Previous events stacked above */}
              <AnimatePresence mode="sync" initial={false}>
                {displayedEvents.slice(0, -1).reverse().map((event, index) => (
                  <motion.div
                    key={event.id}
                    className={cn(
                      "py-2 px-5 rounded-full text-sm max-w-[85%] absolute bottom-0",
                      event.content.startsWith("Working on") || event.content.startsWith("Executing")
                        ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 text-indigo-800" 
                        : event.type === 'live_status' 
                          ? "bg-indigo-50 border border-indigo-200 text-indigo-800" 
                          : "bg-gray-50 border border-gray-200 text-gray-800"
                    )}
                    custom={index}
                    variants={{
                      initial: { opacity: 0, y: 0, scale: 0.9, bottom: 0 },
                      animate: (index: number) => ({
                        opacity: Math.max(0.2, 0.6 - (index * 0.05)),
                        y: -((index + 1) * 45),
                        bottom: 0,
                        scale: Math.max(0.7, 0.9 - (index * 0.03)),
                        filter: index < 8 ? `blur(${Math.min(2, index * 0.4)}px)` : `blur(2px)`,
                        transition: { 
                          duration: 0.5,
                          ease: [0.34, 1.25, 0.64, 1]
                        }
                      }),
                      exit: { 
                        opacity: 0, 
                        y: -140,
                        scale: 0.8,
                        transition: { 
                          duration: 0.4,
                          ease: [0.25, 1, 0.5, 1]
                        } 
                      }
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="flex items-center">
                      {(event.content.startsWith("Working on") || event.content.startsWith("Executing")) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500/70 mr-2">
                          <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      <span>{event.content}</span>
                      {event.timestamp && (
                        <span className="ml-2 text-xs opacity-60">
                          {formatTime(event.timestamp)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* File attachments section */}
          {renderFileAttachments()}

          {/* In-chat updates card - fixed to bottom of container */}
          {hasInChatUpdates && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden"
              >
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                      <div className="text-xs uppercase text-indigo-700 font-medium tracking-wider">Live Updates</div>
                    </div>
                    <div className="text-xs text-indigo-400">
                      {formatTime(new Date())}
                    </div>
                  </div>
                </div>
                <div className="p-4 max-h-[160px] overflow-auto">
                  <InChatUpdates updates={latestEvent.inChatUpdates as InChatUpdate[]} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsDisplay; 