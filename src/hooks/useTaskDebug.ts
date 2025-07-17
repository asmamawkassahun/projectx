import { useControls, button } from "leva";
import { mockupData } from "@/mockup-data";
import { useRef } from "react";

interface UseTaskDebugOptions {
  onTaskEvent?: (event: any) => void;
  onChatEvent?: (event: any) => void;
  onInChatUpdate?: (event: any) => void;
  handleReplayEvent?: (event: any) => void;
  prefix?: string;
  showAdvancedControls?: boolean;
}

export function useTaskDebug(options: UseTaskDebugOptions = {}) {
  const {
    onTaskEvent,
    onChatEvent,
    onInChatUpdate,
    handleReplayEvent,
    prefix = "Task",
    showAdvancedControls = true,
  } = options;
  const debugEventCounter = useRef(1);
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === "true";

  if (!isDebug) {
    return null;
  }

  const events = mockupData.events;

  const debugControls = useControls({
    [`${prefix}: Show Task`]: button(() => {
      console.log(`Debug: Creating task via ${prefix}`);
      const taskCreatedEvent = {
        eventType: "task_created",
        data: events[0].event_data,
      };
      if (handleReplayEvent) {
        handleReplayEvent(taskCreatedEvent);
      } else {
        onTaskEvent?.(taskCreatedEvent);
      }
    }),
    [`${prefix}: Next Event`]: button(() => {
      const event = events[debugEventCounter.current];
      console.log(`Debug: Processing event via ${prefix}`, event);
      debugEventCounter.current++;

      if (!event) {
        console.log("Debug: No more events");
        return;
      }

      // Create the event object in the format expected by handleReplayEvent
      const replayEvent = {
        eventType: event.event_type,
        data: event.event_data,
      };

      if (handleReplayEvent) {
        // Use the handleReplayEvent function which has its own switch logic
        handleReplayEvent(replayEvent);
      } else {
        // Fallback to the old switch logic if handleReplayEvent is not provided
        switch (event.event_type) {
          case "audio_message":
            console.log(
              `Debug: Audio message received via ${prefix}:`,
              event.event_data
            );
            onChatEvent?.(event);
            break;
          case "in_chat_updates":
            console.log(
              `Debug: InChatUpdates event received via ${prefix}:`,
              event.event_data
            );
            onInChatUpdate?.(event.event_data);
            break;
          case "status_update":
            console.log(
              `Debug: Status update received via ${prefix}:`,
              event.event_data
            );
            // Handle different types of status updates
            if (event.event_data.type === "thinking") {
              console.log(`Debug: Thinking status via ${prefix}`);
            } else if (event.event_data.type === "live_status") {
              console.log(
                `Debug: Live status via ${prefix} - Tool: ${event.event_data.tool_name}`
              );
            } else if (event.event_data.task_plan) {
              console.log(
                `Debug: Task plan update via ${prefix} - Steps: ${event.event_data.task_plan.length}`
              );
            } else if (event.event_data.step_status) {
              console.log(
                `Debug: Step status update via ${prefix} - Step: ${event.event_data.step_index}, Status: ${event.event_data.step_status}`
              );
            } else if (event.event_data.type === "waiting_user_response") {
              console.log(`Debug: Waiting for user response via ${prefix}`);
            } else {
              console.log(
                `Debug: General status update via ${prefix}:`,
                event.event_data.message || "No message"
              );
            }
            onTaskEvent?.({
              eventType: event.event_type,
              data: event.event_data,
            });
            break;
          case "task_created":
          case "complete":
          case "error":
          case "agent_stopped":
            console.log(`Debug: Task event received via ${prefix}:`, event);
            onTaskEvent?.({
              eventType: event.event_type,
              data: event.event_data,
            });
            break;
          default:
            console.log(
              `Debug: Unknown event type via ${prefix}: ${event.event_type}`
            );
        }
      }
    }),
    [`${prefix}: Reset Counter`]: button(() => {
      debugEventCounter.current = 1;
      console.log(`Debug: Event counter reset to 1 via ${prefix}`);
    }),
    [`${prefix}: Show State`]: button(() => {
      console.log(
        `Debug: Current event counter via ${prefix}:`,
        debugEventCounter.current
      );
      console.log(
        `Debug: Total events available via ${prefix}:`,
        events.length
      );
      if (debugEventCounter.current <= events.length) {
        const nextEvent = events[debugEventCounter.current];
        console.log(`Debug: Next event will be via ${prefix}:`, nextEvent);
      }
    }),
    ...(showAdvancedControls && {
      [`${prefix}: Jump to Event`]: button(() => {
        const targetIndex = Math.floor(Math.random() * events.length);
        debugEventCounter.current = targetIndex;
        console.log(`Debug: Jumped to event ${targetIndex} via ${prefix}`);
        const event = events[targetIndex];
        console.log(`Debug: Target event via ${prefix}:`, event);
      }),
      [`${prefix}: Simulate Error`]: button(() => {
        console.log(`Debug: Simulating error via ${prefix}`);
        const errorEvent = {
          eventType: "error",
          data: { message: "Simulated error for debugging" },
        };
        if (handleReplayEvent) {
          handleReplayEvent(errorEvent);
        } else {
          onTaskEvent?.(errorEvent);
        }
      }),
      [`${prefix}: Simulate Complete`]: button(() => {
        console.log(`Debug: Simulating completion via ${prefix}`);
        const completeEvent = {
          eventType: "complete",
          data: {
            files: [{ name: "debug-file.txt", content: "Debug file content" }],
          },
        };
        if (handleReplayEvent) {
          handleReplayEvent(completeEvent);
        } else {
          onTaskEvent?.(completeEvent);
        }
      }),
    }),
  });

  return debugControls;
}
