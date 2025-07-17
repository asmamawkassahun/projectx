import { API_URL } from "@/config/api";
import { AudioMessage } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePCMPlayer } from "./usePCMPlayer";

// Define our combined event types
export type EventType =
  | "status_update"
  | "complete"
  | "error"
  | "cua_clarification"
  | "agent_stopped"
  | "in_chat_updates"
  | "user_message"
  | "message"
  | "audio_message";

// Define the combined event interface
export interface CombinedEvent {
  id: string;
  eventType: EventType;
  timestamp: string;
  data: any;
  isAudioEvent?: boolean;
}

// Options for the combined replay hook
interface CombinedReplayOptions {
  onComplete?: () => void;
  delayBetweenEvents?: number;
  apiUrl?: string;
  playbackSpeed?: number;
  onEvent?: (event: CombinedEvent) => void;
  isNewVoice?: boolean;
}

/**
 * A hook for replaying a combined sequence of task events and audio messages
 */
export function useCombinedReplay(options: CombinedReplayOptions = {}) {
  // Get the PCM player for audio playback

  const {
    isReady: isAudioReady,
    isPlaying: isAudioPlaying,
    error: audioError,
    playFromBase64,
    stop: stopAudio,
    resumeAudioContext,
    setVolume,
    volume,
    audioContext,
  } = usePCMPlayer();

  // State for events and playback
  const [combinedEvents, setCombinedEvents] = useState<CombinedEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(
    options.playbackSpeed || 1.0
  );

  const [taskUuid, setTaskUuid] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<Error | null>(null);

  // Track timeouts for event playback
  const eventTimeouts = useRef<NodeJS.Timeout[]>([]);
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Options with defaults
  const { onComplete, delayBetweenEvents = 200, apiUrl = "/api" } = options;

  // Keep track of mounted state
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopReplay();

      // Clear any pending timeouts
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }

      eventTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      eventTimeouts.current = [];
    };
  }, []);

  // Fetch task events from the API
  const fetchTaskEvents = useCallback(
    async (taskId: string): Promise<any[]> => {
      if (!taskId) {
        console.error("Cannot fetch task events: No task ID provided");
        return [];
      }

      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}/api/task/${taskId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch task events: ${response.status}`);
        }

        const data = await response.json();

        // Validate and process timestamps for each event
        // Also standardize the format to ensure correct ordering
        const processedEvents = (data.events || []).map(
          (event: any, index: number) => {
            // Ensure each event has a valid timestamp
            if (!event.timestamp) {
              console.warn(
                `Task event ${index} missing timestamp, adding current time`
              );
              event.timestamp = new Date().toISOString();
            }

            // Standardize the timestamp format to ensure sorting works correctly
            try {
              // Force timestamp to be in standard ISO format
              const date = new Date(event.timestamp);
              event.timestamp = date.toISOString();
            } catch (e) {
              console.error(
                `Failed to parse timestamp for task event ${index}:`,
                e
              );
              event.timestamp = new Date().toISOString();
            }

            return event;
          }
        );

        console.log(`Fetched ${processedEvents.length} task events`);
        return processedEvents;
      } catch (error) {
        console.error("Error fetching task events:", error);
        setApiError(error instanceof Error ? error : new Error(String(error)));
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch audio messages from the API
  const fetchAudioMessages = useCallback(
    async (convId: string): Promise<AudioMessage[]> => {
      if (!convId) {
        console.error(
          "Cannot fetch audio messages: No conversation ID provided"
        );
        return [];
      }

      try {
        setIsLoading(true);

        // Build URL with optional is_new_voice parameter
        let url = `${API_URL}/api/audio/conversation/${convId}/messages`;
        if (options.isNewVoice) {
          url += "?is_new_voice=1";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio messages: ${response.status}`);
        }

        const data = await response.json();

        // Process and sort messages
        const processedMessages = data.messages
          // .filter((msg: AudioMessage) => msg.audio_base64 && msg.audio_base64.length > 0)
          .map((msg: AudioMessage, index: number) => {
            // Ensure each message has a valid created_at timestamp
            if (!msg.created_at) {
              console.warn(
                `Audio message ${index} missing timestamp, adding current time`
              );
              msg.created_at = new Date().toISOString();
            }

            // Standardize the timestamp format to ensure sorting works correctly
            try {
              // Force timestamp to be in standard ISO format
              const date = new Date(msg.created_at);
              msg.created_at = date.toISOString();
            } catch (e) {
              console.error(
                `Failed to parse timestamp for audio message ${index}:`,
                e
              );
              msg.created_at = new Date().toISOString();
            }

            return msg;
          })
          .sort((a: AudioMessage, b: AudioMessage) => {
            // Convert string dates to timestamps for comparison
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();

            // Use a small threshold to consider timestamps as "equal"
            const TIMESTAMP_THRESHOLD = 1000; // 1 second

            if (Math.abs(dateA - dateB) < TIMESTAMP_THRESHOLD) {
              // If timestamps are very close together, sort by role to maintain conversation flow
              return a.role === "user" ? -1 : 1;
            }

            return dateA - dateB;
          });

        console.log(`Fetched ${processedMessages.length} audio messages`);
        return processedMessages;
      } catch (error) {
        console.error("Error fetching audio messages:", error);
        setApiError(error instanceof Error ? error : new Error(String(error)));
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [options.isNewVoice]
  );

  // Function to merge task events and audio messages by timestamp
  const mergeEvents = useCallback(
    (taskEvents: any[], audioMessages: AudioMessage[]): CombinedEvent[] => {
      // Convert task events to our common format
      const formattedTaskEvents: CombinedEvent[] = taskEvents.map(
        (event, index) => ({
          id: `task-${index}`,
          eventType: event.event_type as EventType,
          timestamp: event.timestamp || new Date(0).toISOString(),
          data: event.event_data,
          isAudioEvent: false,
        })
      );

      // Convert audio messages to our common format
      const formattedAudioEvents: CombinedEvent[] = audioMessages.map(
        (message, index) => ({
          id: `audio-${index}`,
          eventType: "audio_message",
          timestamp: message.created_at || new Date(0).toISOString(),
          data: message,
          isAudioEvent: true,
        })
      );

      // Combine and sort by timestamp
      const combined = [...formattedTaskEvents, ...formattedAudioEvents].sort(
        (a, b) => {
          // Simple timestamp comparison
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();

          // Default to standard timestamp ordering
          return timeA - timeB;
        }
      );

      // Log the final order for debugging purposes
      if (combined.length > 0) {
        console.log(
          `Merged ${formattedTaskEvents.length} task events and ${formattedAudioEvents.length} audio messages`
        );
      }

      return combined;
    },
    []
  );

  // Function to find a task by conversation ID
  const findTaskByConversationId = useCallback(
    async (convId: string): Promise<string | null> => {
      if (!convId) {
        console.error("Cannot find task: No conversation ID provided");
        return null;
      }

      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_URL}/api/tasks/find?conversationId=${encodeURIComponent(
            convId
          )}`
        );

        if (!response.ok) {
          // If we get a 404, it just means there's no associated task
          // We should still continue with the replay process using just audio messages
          if (response.status === 404) {
            console.log(
              "No task found for conversation ID, will continue with audio messages only"
            );
            return null;
          }
          throw new Error(`Failed to find task: ${response.status}`);
        }

        const data = await response.json();
        return data.task_uuid || null;
      } catch (error) {
        console.error("Error finding task by conversation ID:", error);
        setApiError(error instanceof Error ? error : new Error(String(error)));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initialize replay by loading audio messages and task events if available
  const initializeReplay = useCallback(
    async (convId: string) => {
      // Skip on server-side
      if (typeof window === "undefined") {
        return false;
      }

      try {
        setIsLoading(true);

        console.log("Initializing replay for conversation ID:", convId);

        // Always fetch audio messages first before trying task events
        // This ensures we have audio messages even if the task lookup fails
        console.log("Fetching audio messages...");
        const audioMessages = await fetchAudioMessages(convId);
        console.log(`Retrieved ${audioMessages.length} audio messages`);

        // Try to find an associated task
        console.log("Looking for associated task...");
        const taskId = await findTaskByConversationId(convId);
        let taskEvents: any[] = [];

        // If we found a task, fetch its events
        if (taskId) {
          console.log("Found associated task with ID:", taskId);
          setTaskUuid(taskId);
          taskEvents = await fetchTaskEvents(taskId);
          console.log(`Retrieved ${taskEvents.length} task events`);
        } else {
          console.log(
            "No associated task found, will only replay audio messages"
          );
        }

        // Log timestamp information for debugging
        if (taskEvents.length > 0) {
          const taskTimestamps = taskEvents.map((event) => {
            const ts = event.timestamp || "missing";
            return `${event.event_type}: ${ts}`;
          });
          console.log("Task event timestamps:", taskTimestamps);
        }

        if (audioMessages.length > 0) {
          const audioTimestamps = audioMessages.map((msg) => {
            const ts = msg.created_at || "missing";
            return `${msg.role}: ${ts}`;
          });
          console.log("Audio message timestamps:", audioTimestamps);
        }

        // TIMESTAMP NORMALIZATION LOGIC
        // If we have both task events and audio messages, check if their timestamp formats are compatible
        if (taskEvents.length > 0 && audioMessages.length > 0) {
          // Check first task event and first audio message
          const taskTs = taskEvents[0].timestamp;
          const audioTs = audioMessages[0].created_at;

          console.log(
            `Comparing timestamp formats - Task: ${taskTs}, Audio: ${audioTs}`
          );

          // Check if one has timezone info but the other doesn't
          const taskHasTimezone = taskTs.includes("Z") || taskTs.includes("+");
          const audioHasTimezone =
            audioTs.includes("Z") || audioTs.includes("+");

          if (taskHasTimezone !== audioHasTimezone) {
            console.warn(
              "Timestamp format mismatch detected! Normalizing timestamps..."
            );

            // Normalize task event timestamps
            taskEvents = taskEvents.map((event) => {
              try {
                const date = new Date(event.timestamp);
                event.timestamp = date.toISOString();
              } catch (e) {
                console.error("Failed to normalize task timestamp:", e);
              }
              return event;
            });

            // Normalize audio message timestamps - create a new array instead of modifying the constant
            const normalizedAudioMessages = audioMessages.map((msg) => {
              const msgCopy = { ...msg }; // Create a copy to avoid mutating the original
              try {
                const date = new Date(msgCopy.created_at);
                msgCopy.created_at = date.toISOString();
              } catch (e) {
                console.error("Failed to normalize audio timestamp:", e);
              }
              return msgCopy;
            });

            // Use the normalized array going forward
            console.log("Timestamp normalization complete.");

            // Merge events by timestamp with normalized audio messages
            console.log(
              "Merging events by timestamp with normalized timestamps..."
            );
            const merged = mergeEvents(taskEvents, normalizedAudioMessages);
            console.log(`Created ${merged.length} combined events`);
            setCombinedEvents(merged);

            // Skip the regular merge below by returning early
            if (merged.length > 0) {
              // Update URL to include replay=1 flag
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("replay", "1");
                window.history.replaceState({}, "", url.toString());
                console.log("URL updated with replay=1 flag");
              }

              // return true;
            }

            return true;
          }
        }

        // Regular merge (only reached if no timestamp normalization was needed)
        console.log("Merging events by timestamp...");
        const merged = mergeEvents(taskEvents, audioMessages);
        console.log(`Created ${merged.length} combined events`);
        setCombinedEvents(merged);

        // If we have any events (task events OR audio messages), indicate replay is available
        if (merged.length > 0) {
          // Update URL to include replay=1 flag
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("replay", "1");
            window.history.replaceState({}, "", url.toString());
            console.log("URL updated with replay=1 flag");
          }

          return true;
        }

        // If we get here with no events at all (no task events AND no audio messages),
        // don't set replay mode
        console.log("No events found to replay");

        // Only remove replay flag if there are truly no events to replay
        // if (typeof window !== 'undefined') {
        //   const url = new URL(window.location.href);
        //   url.searchParams.delete('replay');
        //   window.history.replaceState({}, '', url.toString());
        //   console.log('URL updated to remove replay flag due to no events at all');
        // }

        return true;
      } catch (error) {
        console.error("Error initializing replay:", error);
        setApiError(error instanceof Error ? error : new Error(String(error)));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [findTaskByConversationId, fetchTaskEvents, fetchAudioMessages, mergeEvents]
  );

  // Function to process a specific task event by type
  const processTaskEvent = useCallback(
    (event: CombinedEvent) => {
      // Just call the onEvent callback if provided
      if (options.onEvent) {
        options.onEvent(event);
      }
    },
    [options.onEvent]
  );

  // Function to play an audio message
  const playAudioMessage = useCallback(
    async (message: AudioMessage): Promise<boolean> => {
      if (!isAudioReady) {
        console.error("Audio player not ready");
        return false;
      }

      try {
        // Make sure audio context is resumed first
        if (audioContext && audioContext.state === "suspended") {
          console.log("Audio context was suspended, attempting to resume...");
          await audioContext.resume();
        }

        // Clear any previous timeout
        if (audioTimeoutRef.current) {
          clearTimeout(audioTimeoutRef.current);
          audioTimeoutRef.current = null;
        }

        // Start playing the audio
        setIsPlaying(true);

        // Play the message - default to 16000Hz for user messages and 24000Hz for assistant
        const sampleRate = message.role === "user" ? 16000 : 24000;
        const result = await playFromBase64(
          message.audio_base64,
          sampleRate,
          playbackSpeed
        );

        if (result) {
          // Set a safety timeout to handle end of playback in case onComplete doesn't fire
          const approximateBytes = message.audio_base64.length * 0.75;
          const approximateSamples = approximateBytes / 2;
          const approximateDurationMs =
            ((approximateSamples / sampleRate) * 1000) / playbackSpeed;
          const safetyTimeoutMs = Math.min(
            15000,
            Math.max(2000, approximateDurationMs * 1.5)
          );

          return new Promise((resolve) => {
            audioTimeoutRef.current = setTimeout(() => {
              setIsPlaying(false);
              resolve(true);
            }, safetyTimeoutMs);
          });
        }

        return false;
      } catch (error) {
        console.error("Error playing audio message:", error);
        setIsPlaying(false);
        return false;
      }
    },
    [isAudioReady, audioContext, playFromBase64, playbackSpeed]
  );

  // Start replay of all events
  const startReplay = useCallback(async () => {
    if (combinedEvents.length === 0) {
      console.log("No events to replay");
      return false;
    }

    try {
      // Reset state
      setIsReplaying(true);
      setHasFinished(false);
      setIsStopped(false);
      setCurrentIndex(0);

      // Clear any existing timeouts
      eventTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      eventTimeouts.current = [];

      // Ensure audio context is ready
      if (audioContext && audioContext.state === "suspended") {
        await audioContext.resume();
      }

      console.log(`Starting replay of ${combinedEvents.length} events...`);

      // Log the sequence with detailed timestamp information
      const orderedEvents = [...combinedEvents];
      console.log("FINAL EVENT PLAYBACK SEQUENCE:");
      orderedEvents.forEach((event, index) => {
        const eventType = event.isAudioEvent
          ? `AUDIO (${(event.data as AudioMessage).role})`
          : `TASK (${event.eventType})`;

        const timestamp = event.timestamp;
        const dateObj = new Date(timestamp);
        const timeMs = dateObj.getTime();

        console.log(`${index}: ${eventType} - ${timestamp} (${timeMs}ms)`);
      });

      // Check for timestamp inversions as final debug
      let hasInversion = false;
      for (let i = 1; i < orderedEvents.length; i++) {
        const prevTime = new Date(orderedEvents[i - 1].timestamp).getTime();
        const currTime = new Date(orderedEvents[i].timestamp).getTime();

        if (prevTime > currTime) {
          console.error(`TIMESTAMP INVERSION at index ${i - 1} -> ${i}:`);
          console.error(
            `  Event ${i - 1}: ${orderedEvents[i - 1].eventType} at ${
              orderedEvents[i - 1].timestamp
            } (${prevTime}ms)`
          );
          console.error(
            `  Event ${i}: ${orderedEvents[i].eventType} at ${orderedEvents[i].timestamp} (${currTime}ms)`
          );
          hasInversion = true;
        }
      }

      if (hasInversion) {
        console.warn(
          "⚠️ Event sequence has timestamp inversions! Events may play out of order."
        );
      } else {
        console.log(
          "✓ Event sequence validation passed. No timestamp inversions detected."
        );
      }

      // Process events with consistent delay
      let currentDelay = 0;

      for (let i = 0; i < combinedEvents.length; i++) {
        const event = combinedEvents[i];

        const timeout = setTimeout(async () => {
          if (!isMountedRef.current || isStopped) return;

          setCurrentIndex(i);

          // Enhanced debug logging with timestamps
          const eventTime = new Date(event.timestamp);
          console.log(
            `Playing event ${i}/${combinedEvents.length - 1}: ${
              event.eventType
            } (timestamp: ${eventTime.toISOString()})`
          );

          if (
            event.isAudioEvent &&
            event.eventType === "audio_message" &&
            event.data?.audio_base64
          ) {
            // Play audio message
            const audioMessage = event.data as AudioMessage;
            console.log(
              `Playing audio message, role: ${audioMessage.role}, timestamp: ${event.timestamp}`
            );
            if (audioMessage?.content) {
              processTaskEvent(event);
            }
            // Wait for audio to finish playing
            await playAudioMessage(audioMessage);
          } else {
            // Process task event or user message - let parent handle it
            console.log(
              `Processing event: ${event.eventType}, timestamp: ${event.timestamp}`
            );
            processTaskEvent(event);
          }

          // Check if this is the last event
          if (i === combinedEvents.length - 1) {
            // Replay complete
            console.log("Replay complete");
            setIsReplaying(false);
            setHasFinished(true);
            setCurrentIndex(-1);
          }
        }, currentDelay);

        eventTimeouts.current.push(timeout);

        // Audio events need more time based on their duration
        if (event.isAudioEvent) {
          // Estimate audio duration based on base64 length
          const audioMessage = event.data as AudioMessage;
          const approximateBytes = audioMessage.audio_base64.length * 0.75;
          const approximateSamples = approximateBytes / 2;
          const sampleRate = audioMessage.role === "user" ? 16000 : 24000;
          const approximateDurationMs =
            ((approximateSamples / sampleRate) * 1000) / playbackSpeed;

          // Add audio duration plus a small buffer between events
          const audioDelay = approximateDurationMs + delayBetweenEvents;
          console.log(
            `Audio event ${i}, estimated duration: ${approximateDurationMs}ms, adding delay: ${audioDelay}ms`
          );
          currentDelay += audioDelay;
        } else {
          // Regular events just get the standard delay
          console.log(
            `Task event ${i}, adding standard delay: ${delayBetweenEvents}ms`
          );
          currentDelay += delayBetweenEvents;
        }
      }

      return true;
    } catch (error) {
      console.error("Error starting replay:", error);
      setIsReplaying(false);
      return false;
    }
  }, [
    combinedEvents,
    isStopped,
    audioContext,
    processTaskEvent,
    playAudioMessage,
    onComplete,
    delayBetweenEvents,
    playbackSpeed,
  ]);

  // Pause replay
  const pauseReplay = useCallback(async () => {
    await stopAudio();
    setIsReplaying(false);
    setIsPlaying(false);

    // Clear timeouts to pause event processing
    eventTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    eventTimeouts.current = [];
  }, [stopAudio]);

  // Stop replay
  const stopReplay = useCallback(async () => {
    await stopAudio();
    setIsReplaying(false);
    setIsPlaying(false);
    setIsStopped(true);
    setCurrentIndex(-1);

    // Clear timeouts
    eventTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    eventTimeouts.current = [];

    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
  }, [stopAudio]);

  // Jump to the end of replay (process all events immediately)
  const jumpToEnd = useCallback(() => {
    // Stop current replay
    stopReplay();

    // Process all events immediately
    combinedEvents.forEach((event) => {
      if (event.isAudioEvent) {
        // Skip audio playback for jump to end
        return;
      } else {
        // Let parent handle the event
        processTaskEvent(event);
      }
    });

    // Mark replay as complete
    setIsReplaying(false);
    setHasFinished(true);
    setCurrentIndex(-1);

    if (onComplete) {
      onComplete();
    }
  }, [combinedEvents, stopReplay, processTaskEvent, onComplete]);

  return {
    // State
    combinedEvents,
    currentIndex,
    isReplaying,
    isPlaying,
    hasFinished,
    audioError,
    apiError,
    isLoading,
    volume,
    taskUuid,
    sessionId,

    // API Functions
    fetchTaskEvents,
    fetchAudioMessages,
    initializeReplay,

    // Playback Controls
    startReplay,
    pauseReplay,
    stopReplay,
    jumpToEnd,
    setVolume,
    setPlaybackSpeed,

    // State setters for parent component control
    setTaskUuid,
    setSessionId,

    // Audio context
    audioContext,
  };
}
