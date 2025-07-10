import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighterPrism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SlideViewer from './SlideViewer';

interface FileViewerProps {
  file: {
    name: string;
    path: string;
  };
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlBlobUrl, setHtmlBlobUrl] = useState<string | null>(null);
  const filePathRef = useRef<string>('');
  const blobUrlRef = useRef<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  // Image viewer states
  const [imageScale, setImageScale] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const [showImageControls, setShowImageControls] = useState<boolean>(false);
  
  // Slide viewer specific states
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Add these video-related states after other state declarations
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileType = (filename: string) => {
    const ext = getFileExtension(filename);
    // Prioritize HTML detection by checking for HTML extensions first
    if (['html', 'htm'].includes(ext)) return 'html';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';
    if (ext === 'pdf') return 'pdf';
    if (['txt', 'json'].includes(ext)) return 'text';
    if (ext === 'md') return 'markdown';
    if (filename.endsWith('.slides.html')) return 'slides';
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rb'].includes(ext)) return 'code';
    return 'unsupported';
  };

  const getLanguage = (filename: string) => {
    const ext = getFileExtension(filename);
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rb': 'ruby',
      'json': 'json',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
    };
    return languageMap[ext] || 'text';
  };

  const injectLightThemeStyles = (htmlContent: string) => {
    // Don't modify the original HTML content
    return htmlContent;
  };

  // Handle file download
  const handleDownload = () => {
    // Prevent multiple downloads
    if (isDownloading) {
      return false;
    }
    
    // Clear any previous error
    setError(null);
    
    // Set downloading state
    setIsDownloading(true);
    
    // Use fetch and blob for all file types to force download
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
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
        }, 100);
      })
      .catch(error => {
        console.error('Error during download process:', error);
        setError(`Failed to download file: ${error.message}`);
        setIsDownloading(false);
      });
      
    // Prevent default behavior
    return false;
  };

  // Handle opening HTML in full page
  const handleOpenFullPage = () => {
    // Use the original file path instead of blob URL for remote files
    window.open(file.path, '_blank');
  };

  // Effect to create and clean up blob URL only when file changes
  useEffect(() => {
    // Only create a new blob URL if we're switching to a different file
    if (file.path !== filePathRef.current) {
      // Clean up the previous blob URL when switching files
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      
      filePathRef.current = file.path;
      
      const fetchContent = async () => {
        try {
          const fileType = getFileType(file.name);
          
          // For HTML files, just update the content for display purposes
          // but we'll directly use the original URL in the iframe
          if (fileType === 'html') {
            const response = await fetch(file.path);
            const text = await response.text();
            setContent(text);
            // We don't create a blob URL for HTML anymore
            return;
          }
          
          // For other text-based file types
          if (['text', 'code', 'markdown'].includes(fileType)) {
            const response = await fetch(file.path);
            const text = await response.text();
            setContent(text);
          }
        } catch (err) {
          setError('Failed to load file content');
        }
      };

      fetchContent();
    }
    
    // Cleanup blob URL when component unmounts
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [file]);

  // Markdown table of contents generator
  const extractHeadings = (markdown: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
    
    return headings;
  };

  // For Markdown rendering
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighterPrism
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-3 shadow-lg text-sm"
          showLineNumbers
          wrapLines
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighterPrism>
      ) : (
        <code className={`${className} px-1 py-0.5 rounded-md bg-gray-100 font-mono text-xs border border-gray-200`} {...props}>
          {children}
        </code>
      );
    },
    img({ node, ...props }: any) {
      return (
        <span className="flex justify-center my-4 transition-all duration-300 hover:scale-[1.01]">
          <img className="max-w-full rounded-lg shadow-md border border-gray-200 filter saturate-[1]" {...props} />
        </span>
      );
    },
    a({ node, ...props }: any) {
      return (
        <a 
          {...props} 
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium no-underline border-b border-blue-200 hover:border-blue-400 pb-[1px] text-sm" 
          target="_blank"
          rel="noopener noreferrer"
        />
      );
    },
    blockquote({ node, ...props }: any) {
      return (
        <blockquote className="border-l-4 border-blue-400 pl-3 py-0.5 my-4 bg-gray-50 pr-3 rounded-r-md text-gray-700 italic shadow-sm text-sm" {...props} />
      );
    },
    h1({ node, ...props }: any) {
      return <h1 className="text-xl font-bold mt-6 mb-3 pb-1 border-b border-gray-200 text-gray-800" {...props} />;
    },
    h2({ node, ...props }: any) {
      return <h2 className="text-lg font-bold mt-5 mb-2 text-gray-800 flex items-center gap-1 before:content-[''] before:block before:w-1 before:h-4 before:bg-blue-400 before:rounded-sm" {...props} />;
    },
    h3({ node, ...props }: any) {
      return <h3 className="text-base font-semibold mt-4 mb-2 text-gray-800" {...props} />;
    },
    p({ node, ...props }: any) {
      return <p className="my-2 leading-relaxed text-gray-700 text-sm" {...props} />;
    },
    ul({ node, ...props }: any) {
      return <ul className="my-2 ml-4 space-y-1 list-disc marker:text-blue-500 text-sm" {...props} />;
    },
    ol({ node, ...props }: any) {
      return <ol className="my-2 ml-4 space-y-1 list-decimal marker:text-blue-500 marker:font-medium text-sm" {...props} />;
    },
    li({ node, ...props }: any) {
      return <li className="pl-1 text-gray-700 text-sm" {...props} />;
    },
    hr({ node, ...props }: any) {
      return <hr className="my-4 border-gray-200" {...props} />;
    },
    table({ node, ...props }: any) {
      return (
        <div className="my-3 w-full overflow-x-auto rounded-md shadow-md">
          <table className="w-full border-collapse text-xs" {...props} />
        </div>
      );
    },
    thead({ node, ...props }: any) {
      return <thead className="bg-gray-100" {...props} />;
    },
    tbody({ node, ...props }: any) {
      return <tbody className="divide-y divide-gray-200" {...props} />;
    },
    tr({ node, ...props }: any) {
      return <tr className="border-b border-gray-200" {...props} />;
    },
    th({ node, ...props }: any) {
      return <th className="px-2 py-2 text-left font-medium text-gray-700 border-b-2 border-gray-300 text-xs" {...props} />;
    },
    td({ node, ...props }: any) {
      return <td className="px-2 py-2 text-gray-700 border-gray-200 text-xs" {...props} />;
    },
  };

  // Image viewer keyboard controls and zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const fileType = getFileType(file.name);
      if (fileType !== 'image') return;
      
      // Zoom controls
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setImageScale(prev => Math.min(prev + 0.1, 3));
      }
      else if (e.key === '-') {
        e.preventDefault();
        setImageScale(prev => Math.max(prev - 0.1, 0.5));
      }
      else if (e.key === '0') {
        e.preventDefault();
        setImageScale(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [file.name]);
  
  // Reset zoom when changing images
  useEffect(() => {
    setImageScale(1);
  }, [file.path]);

  // Add this function to format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    const fileType = getFileType(file.name);

    switch (fileType) {
      case 'html':
        return (
          <div className="h-full w-full bg-gray-50 relative">
            <iframe
              ref={iframeRef}
              src={file.path} // Use the original file path directly
              className="w-full h-full bg-gray-50"
              style={{ 
                height: '100%',
                width: '100%',
                backgroundColor: '#f8f9fa'
              }}
              sandbox="allow-same-origin allow-scripts"
              title={file.name}
              key={`iframe-${file.path}`} // Use key to prevent re-rendering on parent state changes
            />
            <button
              onClick={handleOpenFullPage}
              className="absolute top-2 left-2 bg-white hover:bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shadow-sm border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              </svg>
              Open Full Page
            </button>
          </div>
        );

      case 'image':
        return (
          <div className="h-full w-full overflow-auto bg-gray-50 flex items-center justify-center p-4">
            <div 
              className="relative max-w-full max-h-full rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group"
              onMouseEnter={() => setShowImageControls(true)}
              onMouseLeave={() => setShowImageControls(false)}
            >
              <img 
                ref={imageRef}
                src={file.path} 
                alt={file.name} 
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `scale(${imageScale})` }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 to-transparent p-3 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-sm font-medium truncate">{file.name}</h3>
              </div>
              
              {/* Image controls */}
              <div className={`absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full text-white transition-opacity duration-200 flex ${showImageControls ? 'opacity-80 hover:opacity-100' : 'opacity-0'}`}>
                <button 
                  onClick={() => setImageScale(prev => Math.max(prev - 0.1, 0.5))}
                  className="p-2 hover:bg-black/30 rounded-l-full"
                  title="Zoom out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                <button 
                  onClick={() => setImageScale(1)}
                  className="p-2 hover:bg-black/30 border-l border-r border-white/20"
                  title="Reset zoom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                <button 
                  onClick={() => setImageScale(prev => Math.min(prev + 0.1, 3))}
                  className="p-2 hover:bg-black/30 rounded-r-full"
                  title="Zoom in"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
              </div>
              
              {/* Zoom indicator */}
              {imageScale !== 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-mono">
                  {Math.round(imageScale * 100)}%
                </div>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="h-full w-full overflow-auto bg-gray-50 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full rounded-lg shadow-lg overflow-hidden bg-black">
              <video 
                ref={videoRef}
                src={file.path} 
                controls
                className="max-w-full max-h-full" 
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration);
                  }
                }}
                onTimeUpdate={(e) => {
                  if (videoRef.current) {
                    setVideoCurrentTime(videoRef.current.currentTime);
                    setIsPlaying(!videoRef.current.paused);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Video info overlay */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                <span className={isPlaying ? 'animate-pulse text-red-400' : ''}>
                  {isPlaying ? 'Playing' : 'Paused'}
                </span>
                <span>•</span>
                <span>{file.name}</span>
              </div>
              
              {/* Video time indicator */}
              {videoDuration && (
                <div className="absolute bottom-12 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-mono">
                  {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                </div>
              )}
              
              {/* Fullscreen button */}
              <button 
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="absolute bottom-12 left-3 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white text-xs opacity-70 hover:opacity-100 transition-opacity duration-200"
                title="Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="h-full w-full overflow-auto bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="mb-4 flex items-center">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 truncate max-w-[300px]">{file.name}</h3>
                  <p className="text-xs text-gray-500">Audio file</p>
                </div>
              </div>
              <div className="relative">
                <audio 
                  src={file.path} 
                  controls
                  className="w-full rounded" 
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="h-full overflow-auto bg-gray-50">
            <Document
              file={file.path}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setError('Failed to load PDF')}
              className="text-gray-800"
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && (
              <div className="flex justify-center mt-4 text-gray-800">
                <button 
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 rounded-l-md text-gray-700 border border-gray-300"
                >
                  Previous
                </button>
                <span className="px-4 py-1 bg-gray-100 border-t border-b border-gray-300 text-gray-700">
                  {pageNumber} of {numPages}
                </span>
                <button 
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 rounded-r-md text-gray-700 border border-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );

      case 'markdown':
        return (
          <div className="h-full w-full overflow-auto bg-gray-50">
            <div className="px-4 md:px-6 py-4 md:py-6 max-w-4xl mx-auto">
              <article className="prose prose-sm max-w-none">
                {content ? (
                  <ReactMarkdown
                    key={file.path}
                    components={MarkdownComponents}
                    remarkPlugins={[remarkGfm]}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-500">
                    <div className="animate-pulse flex gap-2 items-center">
                      <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">Loading markdown content...</span>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="h-full w-full overflow-hidden bg-gray-50">
            <SyntaxHighlighter
              language={getLanguage(file.name)}
              style={vs2015}
              customStyle={{
                margin: 0,
                padding: '12px',
                height: '100%',
                background: '#f8f9fa',
                color: '#212529',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.4'
              }}
              showLineNumbers={true}
              wrapLongLines={false}
              className="text-gray-800 h-full"
            >
              {content || ''}
            </SyntaxHighlighter>
          </div>
        );

      case 'text':
        return (
          <div className="h-full w-full bg-gray-50 font-mono text-gray-800 text-sm">
            <pre className="h-full overflow-auto p-3 whitespace-pre-wrap break-words">
              {content}
            </pre>
          </div>
        );

      case 'slides':
        return (
          <SlideViewer
            file={file}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            totalSlides={totalSlides}
            setTotalSlides={setTotalSlides}
            isPresenting={isPresenting}
            setIsPresenting={setIsPresenting}
            slideContainerRef={slideContainerRef}
          />
        );

      default:
        return (
          <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <svg 
                className="w-12 h-12 mx-auto mb-3 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <p className="text-gray-700 text-sm">This file type is not supported yet</p>
              <p className="text-xs mt-1 text-gray-600">File: {file.name}</p>
            </div>
          </div>
        );
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 bg-gray-50">
        <div className="text-center">
          <svg 
            className="w-12 h-12 mx-auto mb-3 text-red-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-gray-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 relative">
      {renderContent()}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shadow-sm border border-gray-200 ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin h-3 w-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FileViewer; 