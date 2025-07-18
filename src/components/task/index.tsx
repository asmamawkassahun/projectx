import { useTaskDebug } from "@/hooks/useTaskDebug";
import { PusherEventType, pusherManager } from "@/lib/pusher";
import { File, TaskStep } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import CostarTask from "../chat-v2/costar-task";
import TaskPlanner from "./task-planner";
import { TaskError } from "./task-error";
import { TaskLoader } from "./task-loader";
import { TaskLayout } from "./task-layout";
import { useTasksSteps } from "@/contexts/TasksStepsContext";

type ViewMode = "planner" | "execution";

type TaskStatus =
  | "created"
  | "in_progress"
  | "completed"
  | "failed"
  | "waiting_user_response"
  | null;

interface TaskProps {
  setTaskUuid: (uuid: string | null) => void;
  isReplayMode?: boolean;

  onTaskViewChange?: (show: boolean) => void;
  onWaitingUserResponseChange?: (waiting: boolean) => void;
  connectToPusher?: () => Promise<string>;
  connectionStatus?: "connected" | "disconnected" | "connecting";
}

const Task = ({
  setTaskUuid,
  connectionStatus,
  isReplayMode = false,

  onTaskViewChange,
  onWaitingUserResponseChange,
}: TaskProps) => {
  // Task visualization state
  const [showTaskView, setShowTaskView] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(null);

  // Task-related state
  const [viewMode, setViewMode] = useState<ViewMode>("planner");

  const { steps, setSteps, setActiveStep } = useTasksSteps();
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(null);
  const [acknowledgmentMessage, setAcknowledgmentMessage] =
    useState<string>("");
  const [hasReceivedLiveStatus, setHasReceivedLiveStatus] = useState(false);
  const [currentLiveStatusParts, setCurrentLiveStatusParts] = useState<
    Array<{ text: string; style: string }>
  >([]);

  // Files state for completed tasks
  const [completedFiles, setCompletedFiles] = useState<File[]>([]);

  // Additional state for waiting_user_response
  const [isWaitingUserResponse, setIsWaitingUserResponse] = useState(false);

  // Create a ref for the CostarTask component to handle status updates during replay
  const costarTaskRef = useRef<{
    handleStatusUpdate: (data: any) => void;
  } | null>(null);

  // Listen for user answer sent event to reset waiting state
  useEffect(() => {
    const handleUserAnswerSent = () => {
      console.log("User answer sent event received - resetting waiting state");
      setIsWaitingUserResponse(false);
      onWaitingUserResponseChange?.(false);
    };

    window.addEventListener("user-answer-sent", handleUserAnswerSent);

    return () => {
      window.removeEventListener("user-answer-sent", handleUserAnswerSent);
    };
  }, [onWaitingUserResponseChange]);

  // Handle task plan updates from status_update events
  const handleStatusUpdate = useCallback(
    (data: any) => {
      console.log("Task component: handleStatusUpdate called with data:", data);
      setCurrentStatus(data);
      if (!data) return;

      // Handle waiting for user response type
      if (data.type === "waiting_user_response") {
        console.log(
          "User response required - setting waiting state and task status"
        );
        setIsWaitingUserResponse(true);
        onWaitingUserResponseChange?.(true);
        setTaskStatus("waiting_user_response");
        return;
      }

      // For any other status update type, set task status to in_progress if currently waiting
      if (
        taskStatus === "waiting_user_response" &&
        data.type !== "waiting_user_response"
      ) {
        console.log(
          "Setting task status to in_progress due to status update:",
          data.type
        );
        setTaskStatus("in_progress");
      }

      // Handle task plan updates
      if (data.task_plan) {
        console.log("Task plan received:", data.task_plan);

        // If this is a structural plan update (plan_updated flag is true), simply replace the plan
        if (data.plan_updated) {
          console.log(
            "Processing structural plan update in Task component (add/modify steps) - replacing plan"
          );

          // Simply replace the entire plan - the backend sends the complete updated structure
          setSteps(
            data.task_plan.map((stepObj: any) => ({
              name: stepObj.step,
              status: stepObj.status || "pending", // Only default to pending if status is null/undefined
            }))
          );

          // Log the plan update message if provided
          if (data.message) {
            console.log("Plan update message:", data.message);
          }
        } else {
          // This is an initial plan creation - use the complete step objects from backend
          console.log("Processing initial plan creation in Task component");
          setSteps(
            data.task_plan.map((stepObj: any) => ({
              name: stepObj.step,
              status: stepObj.status || "pending", // Only default to pending if status is null/undefined
            }))
          );
        }

        return;
      }

      // Handle plan step status updates
      if (data.step_status && data.step_index !== undefined) {
        const stepIndex = data.step_index;
        console.log("Step status update received:", {
          stepIndex,
          status: data.step_status,
        });

        if (stepIndex >= 0) {
          // If a step is processing, update currentStep
          if (data.step_status === "processing") {
            console.log("Updating currentStep to:", stepIndex);
            setActiveStep(stepIndex);
          }
        }
        return;
      }

      // Handle live status updates (from executor and exe_tool)
      if (data.type === "live_status") {
        setHasReceivedLiveStatus(true);

        // If we receive a live status update but don't have a plan and task view isn't shown,
        // activate the task view (this handles cases where we start execution without planning)
        if (!showTaskView && steps.length === 0) {
          console.log("Activating task view due to live status without plan");
          setShowTaskView(true);
          onTaskViewChange?.(true);
          // setViewMode("execution");
          setIsTaskActive(true);
          setTaskStatus("in_progress");
        }

        // Handle structured message_parts if available
        if (data.message_parts && Array.isArray(data.message_parts)) {
          setCurrentLiveStatusParts(data.message_parts);
        } else if (data.message) {
          // Fallback to plain message if message_parts not available
          setCurrentLiveStatusParts([{ text: data.message, style: "normal" }]);
        }
        return;
      }

      // Handle initial acknowledgment message (first status_update with message)
      if (data.message && !hasReceivedLiveStatus && !acknowledgmentMessage) {
        setAcknowledgmentMessage(data.message);
        setIsTaskActive(true);
        setTaskStatus("in_progress");

        // Also activate task view if not already shown
        if (!showTaskView) {
          console.log(
            "Activating task view due to initial acknowledgment message"
          );
          setShowTaskView(true);
          onTaskViewChange?.(true);
        }
        return;
      }
    },
    [
      isTaskActive,
      hasReceivedLiveStatus,
      acknowledgmentMessage,
      showTaskView,
      taskStatus,
    ]
  );

  // Handle task completion
  const handleCompleteEvent = (data: any) => {
    console.log("Complete event received:", data);

    // Update task status to completed
    setTaskStatus("completed");
    setIsTaskActive(false);

    // Handle files from completion data
    const files = data.files || [];
    if (files.length > 0) {
      setCompletedFiles(files);
    }

    // Clear live status when task completes
    setHasReceivedLiveStatus(false);
    setCurrentLiveStatusParts([]);
  };

  // Handle errors
  const handleErrorEvent = (data: any) => {
    setTaskStatus("failed");
    setIsTaskActive(false);
  };

  // Handle agent stopped
  const handleAgentStoppedEvent = (data: any) => {
    setTaskStatus("failed");
    setIsTaskActive(false);
  };

  const handleTaskCreated = (data: any) => {
    console.log("Task created event received:", data);
    setShowTaskView(true);
    onTaskViewChange?.(true);
    setTaskUuid(data.task_uuid);
  };

  // Setup Pusher event listeners
  const setupEventListeners = () => {
    pusherManager.addEventListener(
      PusherEventType.TaskCreated,
      handleTaskCreated
    );
    pusherManager.addEventListener(
      PusherEventType.StatusUpdate,
      handleStatusUpdate
    );
    pusherManager.addEventListener(
      PusherEventType.Complete,
      handleCompleteEvent
    );
    pusherManager.addEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.addEventListener(
      PusherEventType.AgentStopped,
      handleAgentStoppedEvent
    );
  };

  // Clean up event listeners
  const cleanupEventListeners = () => {
    pusherManager.removeEventListener(
      PusherEventType.TaskCreated,
      handleTaskCreated
    );
    pusherManager.removeEventListener(
      PusherEventType.StatusUpdate,
      handleStatusUpdate
    );
    pusherManager.removeEventListener(
      PusherEventType.Complete,
      handleCompleteEvent
    );
    pusherManager.removeEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.removeEventListener(
      PusherEventType.AgentStopped,
      handleAgentStoppedEvent
    );
  };

  // Setup event listeners when component mounts
  useEffect(() => {
    if (connectionStatus === "connected") {
      setupEventListeners();
    }
    return () => {
      cleanupEventListeners();
    };
  }, [connectionStatus]);

  // Handle replay events
  const handleReplayEvent = (event: any) => {
    switch (event.eventType) {
      case "status_update":
        handleStatusUpdate(event.data);
        // Also call CostarTask's handleStatusUpdate during replay for VM view management
        if (costarTaskRef.current) {
          costarTaskRef.current.handleStatusUpdate(event.data);
        }
        break;
      case "in_chat_updates":
        console.log("InChatUpdates event received in Task:", event.data);
        // Forward in-chat updates to CardDeckSwiper via custom event
        window.dispatchEvent(
          new CustomEvent("replay-inchat-updates", { detail: event.data })
        );
        break;
      case "task_created":
        handleTaskCreated(event.data);
        break;
      case "complete":
        handleCompleteEvent(event.data);
        break;
      case "error":
        handleErrorEvent(event.data);
        break;
      case "agent_stopped":
        handleAgentStoppedEvent(event.data);
        break;
      default:
        console.log(`Unknown event type during replay: ${event.eventType}`);
    }
  };

  // Expose replay event handler for parent component
  useEffect(() => {
    if (isReplayMode) {
      // Listen for replay events from parent
      const handleReplayEventFromParent = (event: CustomEvent) => {
        handleReplayEvent(event.detail);
      };

      window.addEventListener(
        "replay-task-event",
        handleReplayEventFromParent as EventListener
      );

      return () => {
        window.removeEventListener(
          "replay-task-event",
          handleReplayEventFromParent as EventListener
        );
      };
    }
  }, [isReplayMode, handleReplayEvent]);

  // Debug functionality
  useTaskDebug({
    handleReplayEvent: handleReplayEvent,
    onChatEvent: (event) => {
      console.log("Debug: Chat event received in Task component:", event);
      // Forward chat events to parent via custom event
      window.dispatchEvent(
        new CustomEvent("debug-chat-event", { detail: event })
      );
    },
    onInChatUpdate: (event) => {
      console.log("Debug: InChatUpdate received in Task component:", event);
      // Forward in-chat updates to parent via custom event
      window.dispatchEvent(
        new CustomEvent("debug-inchat-update", { detail: event })
      );
    },
    prefix: "Task",
    showAdvancedControls: true,
  });

  if (!showTaskView) {
    return null; // Don't render anything if task view is not active
  }

  return (
    <AnimatePresence mode="wait">
      {taskStatus === "failed" ? (
        <TaskError />
      ) : (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6,
          }}
          className="fixed inset-0 flex z-30 bg-black text-white"
        >
          {/* SIDE BAR */}
          <div className="bg-green-500">SIDE BAR</div>
          <div className="flex flex-col justify-center w-full gap-[64px] max-w-[689px] mx-auto">
            {viewMode === "planner" ? (
              <motion.div
                key="planner"
                className="w-full max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {steps.length > 0 ? (
                  <TaskPlanner setViewMode={setViewMode} />
                ) : (
                  <TaskLoader />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="execution"
                className="w-full max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <CostarTask
                  isTaskCompleted={taskStatus === "completed"}
                  files={completedFiles}
                  ref={costarTaskRef}
                  isReplayMode={isReplayMode}
                  setShowTaskView={setShowTaskView}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Task;
