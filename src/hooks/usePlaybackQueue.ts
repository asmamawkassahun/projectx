import { useState, useEffect, useCallback, useRef } from 'react';
import { usePCMPlayer } from './usePCMPlayer';

export interface QueuedAudio {
  id: string;
  audioBase64: string;
  sampleRate?: number;
  metadata?: Record<string, any>;
}

/**
 * Hook to manage sequential playback of multiple audio files
 */
export function usePlaybackQueue() {
  // Use the PCM player hook
  const {
    isReady,
    isPlaying,
    error,
    playFromBase64,
    stop,
    setVolume,
    volume,
    audioContext,
    sampleRate
  } = usePCMPlayer();
  
  // Queue state
  const [queue, setQueue] = useState<QueuedAudio[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isQueuePlaying, setIsQueuePlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<QueuedAudio | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [playbackDelay, setPlaybackDelay] = useState(300); // ms between tracks
  
  // Track completed items
  const completedRef = useRef<Set<string>>(new Set());

  // Process the next item in the queue when current item finishes
  useEffect(() => {
    // When a track finishes playing and we're not manually stopping
    if (!isPlaying && isQueuePlaying && currentIndex >= 0 && autoAdvance) {
      const current = queue[currentIndex];
      
      // Add to completed set
      if (current) {
        completedRef.current.add(current.id);
        console.log(`Item completed: ${current.id} at index ${currentIndex}`);
      }
      
      // Move to next item after delay
      if (currentIndex < queue.length - 1) {
        console.log(`Auto-advancing to next item from ${currentIndex} to ${currentIndex + 1}`);
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, playbackDelay);
        
        return () => clearTimeout(timer);
      } else {
        // Reached end of queue
        console.log('Reached end of queue in usePlaybackQueue hook');
        setIsQueuePlaying(false);
        setCurrentIndex(-1);
        setCurrentItem(null);
      }
    }
  }, [isPlaying, isQueuePlaying, currentIndex, queue, autoAdvance, playbackDelay]);

  // Update current item when index changes
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      const item = queue[currentIndex];
      setCurrentItem(item);
      
      // Play the current item if queue is active
      if (isQueuePlaying && isReady) {
        console.log(`Playing item ${currentIndex}/${queue.length-1}: ${item.id}`);
        playFromBase64(item.audioBase64, item.sampleRate);
      }
    } else {
      setCurrentItem(null);
    }
  }, [currentIndex, queue, isQueuePlaying, isReady, playFromBase64]);

  // Add item(s) to the queue
  const enqueue = useCallback((items: QueuedAudio | QueuedAudio[]) => {
    setQueue(prev => {
      const itemsArray = Array.isArray(items) ? items : [items];
      return [...prev, ...itemsArray];
    });
    
    // If not currently playing anything, start playback with the first added item
    if (currentIndex === -1 && isQueuePlaying) {
      setCurrentIndex(queue.length); // Will be the index of the first new item
    }
  }, [queue.length, currentIndex, isQueuePlaying]);

  // Clear the entire queue
  const clearQueue = useCallback(async () => {
    await stop();
    setQueue([]);
    setCurrentIndex(-1);
    setCurrentItem(null);
    setIsQueuePlaying(false);
    completedRef.current.clear();
  }, [stop]);

  // Start playing the queue
  const startQueue = useCallback(() => {
    if (queue.length === 0) return;
    
    setIsQueuePlaying(true);
    
    // If we're not currently playing anything, start with the first item
    if (currentIndex === -1) {
      console.log('Starting queue from beginning');
      setCurrentIndex(0);
    } else if (!isPlaying && currentItem) {
      // Resume current item if it's paused
      console.log(`Resuming playback at item ${currentIndex}`);
      playFromBase64(currentItem.audioBase64, currentItem.sampleRate);
    }
  }, [queue, currentIndex, isPlaying, currentItem, playFromBase64]);

  // Pause the queue
  const pauseQueue = useCallback(async () => {
    setIsQueuePlaying(false);
    await stop();
  }, [stop]);

  // Skip to the next track
  const next = useCallback(async () => {
    if (currentIndex < queue.length - 1) {
      await stop();
      console.log(`Manually advancing to next item: ${currentIndex + 1}`);
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('Already at the last item in queue');
    }
  }, [currentIndex, queue.length, stop]);

  // Skip to the previous track
  const previous = useCallback(async () => {
    if (currentIndex > 0) {
      await stop();
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, stop]);

  // Skip to a specific track
  const skipTo = useCallback(async (index: number) => {
    if (index >= 0 && index < queue.length) {
      await stop();
      setCurrentIndex(index);
    }
  }, [queue.length, stop]);

  // Check if an item has been played
  const hasBeenPlayed = useCallback((id: string) => {
    return completedRef.current.has(id);
  }, []);

  return {
    // State
    queue,
    currentIndex,
    currentItem,
    isQueuePlaying,
    isPlaying,
    isReady,
    error,
    autoAdvance,
    playbackDelay,
    volume,
    
    // Controls
    enqueue,
    clearQueue,
    startQueue,
    pauseQueue,
    next,
    previous,
    skipTo,
    setVolume,
    setAutoAdvance,
    setPlaybackDelay,
    hasBeenPlayed,
    
    // Expose for debugging
    audioContext,
    sourceSampleRate: sampleRate
  };
} 