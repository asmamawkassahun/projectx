import React, { useEffect, useRef, useState, Dispatch, SetStateAction, RefObject } from 'react';

interface SlideViewerProps {
  file: {
    name: string;
    path: string;
  };
  currentSlide: number;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  totalSlides: number; 
  setTotalSlides: Dispatch<SetStateAction<number>>;
  isPresenting: boolean;
  setIsPresenting: Dispatch<SetStateAction<boolean>>;
  slideContainerRef: RefObject<HTMLDivElement>;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ 
  file, 
  currentSlide, 
  setCurrentSlide, 
  totalSlides, 
  setTotalSlides,
  isPresenting,
  setIsPresenting,
  slideContainerRef
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [slideUrl, setSlideUrl] = useState<string | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [autoAdvanceInterval, setAutoAdvanceInterval] = useState(5); // Default: 5 seconds
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch the slide content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(file.path);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error("Failed to load slide content:", err);
      }
    };

    fetchContent();
  }, [file.path]);

  // Process slide content and inject Tailwind CSS
  const processedContent = React.useMemo(() => {
    if (!content) return "";
    
    // Create a container for the slides
    const slidesContainer = `
      <div class="slides-container">
        ${content}
      </div>
    `;
    
    // Add Tailwind CSS and any necessary styling
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Slide Presentation</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0;
              overflow: hidden; 
              height: 100vh; 
              width: 100vw;
              background-color: #f0f0f0;
            }
            .slides-container { 
              height: 100%; 
              width: 100%; 
            }
            .slide { 
              display: none; 
              height: 100%; 
              width: 100%; 
              overflow: hidden;
            }
            .slide.active { 
              display: block; 
            }
            .progress {
              position: fixed;
              bottom: 0;
              left: 0;
              height: 4px;
              background-color: #34d399;
              transition: width 0.3s ease;
              z-index: 40;
            }
            
            /* Presentation mode styles */
            body.presentation-mode {
              background-color: #000;
            }
            
            body.presentation-mode .slide {
              display: none;
              opacity: 0;
              transition: opacity 0.5s ease;
            }
            
            body.presentation-mode .slide.active {
              display: flex;
              flex-direction: column;
              opacity: 1;
              justify-content: center;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            
            /* Make text more visible in presentation mode */
            body.presentation-mode h1, 
            body.presentation-mode h2, 
            body.presentation-mode h3 {
              text-shadow: 0 0 8px rgba(0,0,0,0.3);
            }
          </style>
          <script>
            // Function to initialize slides
            document.addEventListener('DOMContentLoaded', function() {
              // Hide all slides initially
              const slides = document.querySelectorAll('.slide');
              slides.forEach(slide => {
                slide.classList.remove('active');
              });
              
              // Activate the first slide
              if (slides.length > 0) {
                slides[0].classList.add('active');
              }
            });
            
            // Function to handle messages from parent frame
            window.addEventListener('message', function(event) {
              const message = event.data;
              
              // Handle slide navigation
              if (message.action === 'goToSlide') {
                const slideNumber = message.slideNumber;
                const slides = document.querySelectorAll('.slide');
                
                // Hide all slides
                slides.forEach(slide => {
                  slide.classList.remove('active');
                });
                
                // Show the target slide
                const targetSlide = document.getElementById('slide-' + slideNumber);
                if (targetSlide) {
                  targetSlide.classList.add('active');
                }
              }
              
              // Handle presentation mode toggle
              if (message.action === 'togglePresentationMode') {
                if (message.enabled) {
                  document.body.classList.add('presentation-mode');
                } else {
                  document.body.classList.remove('presentation-mode');
                }
              }
            });
          </script>
        </head>
        <body>
          ${slidesContainer}
          <div class="progress" id="progress-bar"></div>
        </body>
      </html>
    `;
  }, [content]);

  // Create a blob URL for the slide content
  useEffect(() => {
    if (!processedContent) return;
    
    // Create a blob with the processed HTML
    const blob = new Blob([processedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setSlideUrl(url);

    // Count the number of slides
    if (content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const slides = doc.querySelectorAll('.slide');
      setTotalSlides(slides.length);
    }

    // Cleanup blob URL when component unmounts
    return () => {
      if (slideUrl) {
        URL.revokeObjectURL(slideUrl);
      }
    };
  }, [content, processedContent, setTotalSlides]);

  const goToSlide = (slideNumber: number) => {
    // Ensure slide number is within bounds
    const targetSlide = Math.max(1, Math.min(slideNumber, totalSlides));
    setCurrentSlide(targetSlide);
    
    // Update slide visibility in the iframe using postMessage
    const iframe = slideContainerRef.current?.querySelector('iframe');
    if (iframe?.contentWindow) {
      // Send message to iframe to change slide
      iframe.contentWindow.postMessage({
        action: 'goToSlide',
        slideNumber: targetSlide
      }, '*');
      
      // Update progress bar directly in this context
      const progressWidth = `${(targetSlide / totalSlides) * 100}%`;
      if (iframe.contentWindow.document) {
        const progressBar = iframe.contentWindow.document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = progressWidth;
        }
      }
    }
  };

  const handlePrevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const handleNextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const toggleAutoAdvance = () => {
    const newAutoAdvanceState = !isAutoAdvancing;
    setIsAutoAdvancing(newAutoAdvanceState);
    
    if (newAutoAdvanceState) {
      // Start auto-advancing
      startAutoAdvanceTimer();
    } else {
      // Stop auto-advancing
      stopAutoAdvanceTimer();
    }
  };

  const startAutoAdvanceTimer = () => {
    // Clear any existing timer
    stopAutoAdvanceTimer();
    
    // Set new timer
    autoAdvanceTimerRef.current = setInterval(() => {
      // Check if we're at the last slide
      if (currentSlide >= totalSlides) {
        // Either stop or loop back to first slide
        goToSlide(1); // Loop back to first slide
      } else {
        // Go to next slide
        goToSlide(currentSlide + 1);
      }
    }, autoAdvanceInterval * 1000);
  };

  const stopAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = parseInt(e.target.value, 10);
    setAutoAdvanceInterval(newInterval);
    
    // Restart timer if auto-advancing is already active
    if (isAutoAdvancing) {
      startAutoAdvanceTimer();
    }
  };

  const handleFullscreen = () => {
    if (slideContainerRef.current) {
      if (!isFullscreen) {
        if (slideContainerRef.current.requestFullscreen) {
          slideContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const togglePresentation = () => {
    const newPresentingState = !isPresenting;
    setIsPresenting(newPresentingState);
    
    // Update presentation mode in the iframe using postMessage
    const iframe = slideContainerRef.current?.querySelector('iframe');
    if (iframe?.contentWindow) {
      // Send message to iframe to toggle presentation mode
      iframe.contentWindow.postMessage({
        action: 'togglePresentationMode',
        enabled: newPresentingState
      }, '*');
      
      if (newPresentingState) {
        // Start from the first slide when entering presentation mode
        goToSlide(1);
        
        // Attempt to request fullscreen if not already in fullscreen
        if (!isFullscreen && slideContainerRef.current?.requestFullscreen) {
          slideContainerRef.current.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
          });
        }
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
          handleNextSlide();
          break;
        case 'ArrowLeft':
          handlePrevSlide();
          break;
        case 'f':
        case 'F':
          handleFullscreen();
          break;
        case 'Escape':
          if (isPresenting) {
            setIsPresenting(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, totalSlides, isPresenting]);

  // Keep iframe presentation mode in sync with isPresenting state
  useEffect(() => {
    const iframe = slideContainerRef.current?.querySelector('iframe');
    if (iframe?.contentWindow) {
      // Use postMessage to communicate with the iframe
      iframe.contentWindow.postMessage({
        action: 'togglePresentationMode',
        enabled: isPresenting
      }, '*');
    }
    
    // Stop auto-advance if exiting presentation mode
    if (!isPresenting && isAutoAdvancing) {
      setIsAutoAdvancing(false);
      stopAutoAdvanceTimer();
    }
  }, [isPresenting]);
  
  // Handle auto-advance interval changes
  useEffect(() => {
    if (isAutoAdvancing) {
      startAutoAdvanceTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvanceInterval, currentSlide]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopAutoAdvanceTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up event listener for iframe load to initialize first slide
  const handleIframeLoad = () => {
    const iframe = slideContainerRef.current?.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      // Initialize slide and presentation mode
      setTimeout(() => {
        // Give the iframe time to fully initialize before sending messages
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            action: 'goToSlide',
            slideNumber: currentSlide
          }, '*');
          
          if (isPresenting) {
            iframe.contentWindow.postMessage({
              action: 'togglePresentationMode',
              enabled: true
            }, '*');
          }
        }
      }, 100);
    }
  };

  // If content is not loaded yet, show loading state
  if (!content) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-gray-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={slideContainerRef} 
      className="h-full w-full bg-gray-900 relative flex flex-col"
    >
      {/* Iframe to display the slides */}
      {slideUrl && (
        <iframe
          src={slideUrl}
          className="w-full flex-1"
          sandbox="allow-same-origin allow-scripts"
          title="Slide Presentation"
          onLoad={handleIframeLoad}
        />
      )}

      {/* Controls */}
      <div className="bg-gray-800 text-white p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <button 
            onClick={handlePrevSlide}
            disabled={currentSlide <= 1}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-md text-xs sm:text-sm"
          >
            Previous
          </button>
          <button 
            onClick={handleNextSlide}
            disabled={currentSlide >= totalSlides}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-md text-xs sm:text-sm"
          >
            Next
          </button>
          <span className="mx-1 sm:mx-4 text-xs sm:text-sm whitespace-nowrap">
            Slide {currentSlide} of {totalSlides}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Auto-advance controls */}
          <div className="flex items-center gap-1 px-1 rounded-md bg-gray-700">
            <button
              onClick={toggleAutoAdvance}
              className={`px-2 py-1 rounded-l-md text-xs sm:text-sm ${
                isAutoAdvancing ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isAutoAdvancing ? "Stop auto-advancing" : "Start auto-advancing"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isAutoAdvancing ? (
                  <>
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </>
                ) : (
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                )}
              </svg>
            </button>
            
            <select
              value={autoAdvanceInterval}
              onChange={handleIntervalChange}
              className="text-xs sm:text-sm bg-gray-700 border-none text-white py-1 px-1 rounded-r-md focus:ring-0 focus:outline-none appearance-none"
              title="Auto-advance interval"
            >
              <option value="3">3s</option>
              <option value="5">5s</option>
              <option value="10">10s</option>
              <option value="15">15s</option>
              <option value="30">30s</option>
            </select>
          </div>

          <button 
            onClick={togglePresentation}
            className={`px-2 py-1 ${isPresenting ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'} rounded-md text-xs sm:text-sm flex items-center gap-1`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <span className="hidden sm:inline">
              {isPresenting ? 'Exit Slideshow' : 'Start Slideshow'}
            </span>
          </button>
          <button 
            onClick={handleFullscreen}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs sm:text-sm flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isFullscreen ? (
                <>
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </>
              ) : (
                <>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </>
              )}
            </svg>
            <span className="hidden sm:inline">
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer; 