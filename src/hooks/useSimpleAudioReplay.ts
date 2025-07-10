import { useState, useEffect, useRef, useCallback } from 'react';
import { usePCMPlayer } from './usePCMPlayer';
import { API_URL } from '@/config/api';
import { AudioMessage } from '@/types';

// Replay hook options
interface ReplayOptions {
  onComplete?: () => void;
  delayBetweenMessages?: number;
  apiUrl?: string;
  playbackSpeed?: number; // Added playback speed option (1.0 = normal speed)
}

/**
 * A simplified hook for replaying a sequence of audio messages
 * Now includes API fetching capabilities
 */
export function useSimpleAudioReplay(options: ReplayOptions = {}) {
  // Get the base PCM player
  const {
    isReady,
    isPlaying,
    error,
    playFromBase64,
    stop,
    resumeAudioContext,
    setVolume,
    volume,
    audioContext
  } = usePCMPlayer();
  
  // State for messages and playback
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isReplaying, setIsReplaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(options.playbackSpeed || 1.0);
  
  // State for API interactions
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  
  // Track the current timeout to ensure we can clear it
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Options with defaults
  const {
    onComplete,
    delayBetweenMessages = 500,
    apiUrl = '/api'
  } = options;
  
  // Keep track of mounted state to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopReplay();
      // Clear any pending timeouts
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

  // Handle playback completion and advance to next message
  useEffect(() => {
    // Only proceed if we're replaying and not currently playing
    if (isReplaying && !isPlaying && !isStopped) {
      console.log(`Message ${currentIndex} finished playing. isPlaying=${isPlaying}, currentIndex=${currentIndex}, total=${messages.length}`);
      
      if (currentIndex >= 0 && currentIndex < messages.length - 1) {
        // Move to next message after a short delay
        const timer = setTimeout(() => {
          if (isMountedRef.current) {
            console.log(`Advancing to next message ${currentIndex + 1}`);
            setCurrentIndex(prev => prev + 1);
          }
        }, delayBetweenMessages);
        
        return () => clearTimeout(timer);
      } else if (currentIndex === messages.length - 1) {
        // Reached the end of the messages
        console.log('Replay complete');
        setIsReplaying(false);
        setHasFinished(true);
        setCurrentIndex(-1);
        // Hide replay button instead of showing it when replay completes
        setShowReplayButton(false);
        
        // Call completion callback if provided
        if (onComplete) {
          onComplete();
        }
      }
    }
  }, [isPlaying, isReplaying, currentIndex, messages.length, onComplete, delayBetweenMessages, isStopped]);

  // Play the current message when the index changes
  useEffect(() => {
    if (!isReady || !isReplaying || isStopped) return;
    
    const playCurrentMessage = async () => {
      if (currentIndex >= 0 && currentIndex < messages.length) {
        const message = messages[currentIndex];
        console.log(`Playing message ${currentIndex}/${messages.length-1} - role: ${message.role}`);
        
        try {
          // Clear any previous timeout
          if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
            playbackTimeoutRef.current = null;
          }
          
          // Make sure audio context is resumed first
          if (audioContext && audioContext.state === 'suspended') {
            console.log('Audio context was suspended, attempting to resume...');
            await audioContext.resume();
            console.log('Audio context resumed successfully:', audioContext.state);
          }
          
          console.log(`Preparing to play message with base64 length: ${message.audio_base64.length}`);
          
          // Play the message - default to 16000Hz for user messages and 24000Hz for assistant
          const sampleRate = message.role === 'user' ? 16000 : 24000;
          console.log(`Using sample rate: ${sampleRate}Hz for ${message.role} message with speed: ${playbackSpeed}x`);
          
          // Force a small delay before playing to ensure audio context is fully ready
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Pass playback speed to the player
          const result = await playFromBase64(message.audio_base64, sampleRate, playbackSpeed);
          console.log(`playFromBase64 result: ${result ? 'success' : 'failed'}`);
          
          if (result) {
            // Set a safety timeout to advance to the next message in case onComplete doesn't fire
            // Estimate a reasonable duration based on base64 length (approx 1.33 chars per byte, 2 bytes per sample)
            const approximateBytes = message.audio_base64.length * 0.75;
            const approximateSamples = approximateBytes / 2;
            // Adjust duration for playback speed
            const approximateDurationMs = (approximateSamples / sampleRate) * 1000 / playbackSpeed;
            // Add a larger safety margin and raise the maximum cap to avoid cutting off longer audio
            const safetyTimeoutMs = Math.min(15000, Math.max(2000, approximateDurationMs * 2.0));
            
            console.log(`Setting safety timeout of ${safetyTimeoutMs}ms for message playback`);
            playbackTimeoutRef.current = setTimeout(() => {
              console.log(`Safety timeout fired for message ${currentIndex}, forcing advance`);
              if (isMountedRef.current && isReplaying && currentIndex < messages.length - 1) {
                setCurrentIndex(prev => prev + 1);
              } else if (isMountedRef.current && isReplaying && currentIndex === messages.length - 1) {
                // Last message, complete replay
                setIsReplaying(false);
                setHasFinished(true);
                setCurrentIndex(-1);
                setShowReplayButton(false);
                if (onComplete) {
                  onComplete();
                }
              }
            }, safetyTimeoutMs);
          } else {
            console.error('Failed to play audio, attempting to move to next message');
            // Move to next after a delay to avoid infinite loop
            setTimeout(() => {
              if (isMountedRef.current && currentIndex < messages.length - 1) {
                setCurrentIndex(prev => prev + 1);
              }
            }, 500);
          }
        } catch (err) {
          console.error('Error playing message:', err);
          // Try to recover by moving to the next message after a delay
          setTimeout(() => {
            if (isMountedRef.current) {
              setCurrentIndex(prev => Math.min(prev + 1, messages.length - 1));
            }
          }, 500);
        }
      }
    };
    
    playCurrentMessage();
    
    // Clean up function
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
    };
  }, [currentIndex, messages, isReplaying, isReady, playFromBase64, audioContext, isStopped, onComplete, playbackSpeed]);

  // Function to fetch audio messages from the API
  const fetchAudioMessages = useCallback(async (convId: string) => {
    if (!convId) {
      console.error('Cannot fetch messages: No conversation ID provided');
      return false;
    }
    
    try {
      setIsLoading(true);
      setApiError(null);
      
      console.log(`Fetching audio messages for conversation ${convId}`);
      const response = await fetch(`${API_URL}/audio/conversation/${convId}/messages`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and sort messages
      const sortedMessages = data.messages
        .filter((msg: AudioMessage) => msg.audio_base64 && msg.audio_base64.length > 0)
        .sort((a: AudioMessage, b: AudioMessage) => {
          // Convert string dates to timestamps for comparison
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          
          // Use a small threshold (e.g., 1 second = 1000ms) to consider timestamps as "equal"
          // This helps with nearly simultaneous messages being properly ordered
          const TIMESTAMP_THRESHOLD = 1000; // 1 second
          
          if (Math.abs(dateA - dateB) < TIMESTAMP_THRESHOLD) {
            // If timestamps are very close together, sort by role to maintain conversation flow
            // User messages should come before agent responses
            return a.role === 'user' ? -1 : 1;
          }
          
          return dateA - dateB;
        });
      
      console.log(`Fetched ${sortedMessages.length} audio messages`);
      
      // Set messages in state
      setMessages(sortedMessages);
      
      // If we have audio messages, show the replay button
      if (sortedMessages.length > 0) {
        setShowReplayButton(true);
        setIsReplayMode(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to fetch audio messages:', error);
      setApiError(error instanceof Error ? error : new Error('Unknown error fetching messages'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Function to create a new conversation
  const createConversation = useCallback(async (sessionId: string, title?: string) => {
    if (!sessionId) {
      console.error('Cannot create conversation: No session ID provided');
      return null;
    }
    
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await fetch(`${API_URL}/audio/conversation/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          title: title || `Voice Conversation ${new Date().toLocaleString()}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setConversationId(data.conversation_id);
      return data.conversation_id;
    } catch (error) {
      console.error('Failed to create audio conversation:', error);
      setApiError(error instanceof Error ? error : new Error('Unknown error creating conversation'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Initialize with conversation ID from URL or create new one
  const initializeConversation = useCallback(async (sessionId?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const convId = urlParams.get('conversationId');
    
    if (convId) {
      // Use existing conversation ID from URL
      setConversationId(convId);
      console.log('Conversation ID found in URL:', convId);
      
      // Fetch messages for this conversation
      const success = await fetchAudioMessages(convId);
      return { conversationId: convId, isReplay: success };
    } else if (sessionId) {
      // Create new conversation when we have a session ID but no conversation ID
      const newConvId = await createConversation(sessionId);
      
      if (newConvId) {
        // Add conversation ID to URL
        const url = new URL(window.location.href);
        url.searchParams.set('conversationId', newConvId);
        window.history.replaceState({}, '', url.toString());
        
        // No need to fetch messages as this is a new conversation
        return { conversationId: newConvId, isReplay: false };
      }
    }
    
    return { conversationId: null, isReplay: false };
  }, [fetchAudioMessages, createConversation]);

  // Set messages for replay (manual override)
  const setReplayMessages = useCallback((newMessages: AudioMessage[]) => {
    setMessages(newMessages);
    setHasFinished(false);
    setCurrentIndex(-1);
    
    // If we have messages, show the replay button
    if (newMessages.length > 0) {
      setShowReplayButton(true);
      setIsReplayMode(true);
    }
  }, []);

  // Start replay from the beginning
  const startReplay = useCallback(async () => {
    if (!isReady || messages.length === 0) {
      console.log('Cannot start replay: player not ready or no messages');
      return false;
    }
    
    try {
      // Make sure audio context is resumed first (handles autoplay restrictions)
      if (audioContext && audioContext.state === 'suspended') {
        console.log('Audio context is suspended, attempting to resume before starting replay');
        await audioContext.resume();
        console.log('Audio context resumed successfully:', audioContext.state);
      }
      
      // Stop any current playback
      await stop();
      
      // Reset state
      setIsReplaying(true);
      setHasFinished(false);
      setIsStopped(false);
      setShowReplayButton(false);
      
      // Start from the beginning
      console.log('Starting replay from beginning');
      setCurrentIndex(0);
      
      return true;
    } catch (error) {
      console.error('Failed to start replay:', error);
      return false;
    }
  }, [isReady, messages.length, audioContext, stop]);

  // Pause replay
  const pauseReplay = useCallback(async () => {
    await stop();
    setIsReplaying(false);
  }, [stop]);

  // Stop replay
  const stopReplay = useCallback(async () => {
    await stop();
    setIsReplaying(false);
    setIsStopped(true);
    setCurrentIndex(-1);
  }, [stop]);

  // Resume paused replay
  const resumeReplay = useCallback(async () => {
    if (!isReady) return false;
    
    try {
      // Resume audio context first
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Resume playback from current position
      setIsReplaying(true);
      setIsStopped(false);
      
      return true;
    } catch (error) {
      console.error('Failed to resume replay:', error);
      return false;
    }
  }, [isReady, audioContext]);

  return {
    // State
    messages,
    currentIndex,
    isReplaying,
    isPlaying,
    hasFinished,
    error,
    apiError,
    isLoading,
    volume,
    isReady,
    conversationId,
    isReplayMode,
    showReplayButton,
    playbackSpeed,
    
    // API Controls
    fetchAudioMessages,
    createConversation,
    initializeConversation,
    
    // Playback Controls
    setReplayMessages,
    startReplay,
    pauseReplay,
    stopReplay,
    resumeReplay,
    setVolume,
    setPlaybackSpeed,
    setShowReplayButton,
    
    // Internal access
    audioContext
  };
} 