"use client";

import { API_URL } from "@/config/api";
import { PusherEventType, pusherManager } from "@/lib/pusher";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

// Import components
import ChatSection from "@/components/ChatSection";
import ControlSummaryModal from "@/components/ControlSummaryModal";
import Header from "@/components/Header";
import RightPanel from "@/components/RightPanel";

// Import types
import { ConnectionStatus, File, MarkdownFile, Message, Task, ViewMode } from "@/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserStreamUrl, setBrowserStreamUrl] = useState<string | null>(null);
  const [clarificationMode, setClarificationMode] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTaskActive, setIsTaskActive] = useState<boolean>(false);
  // const [activeAgentCount, setActiveAgentCount] = useState<number>(0);
  const [taskUuid, setTaskUuid] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clarificationModeRef = useRef<boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  // Add a state variable for the thinking indicator
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Add a state variable to track if we're loading task history
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Add a state variable to track task status with the correct backend status options
  const [taskStatus, setTaskStatus] = useState<"created" | "in_progress" | "completed" | "failed" | "waiting_user_response" | null>(null);

  // State variables for browser control
  const [userHasControl, setUserHasControl] = useState<boolean>(false);
  const [showControlSummaryModal, setShowControlSummaryModal] = useState<boolean>(false);
  const [controlSummary, setControlSummary] = useState<string>("");

  // Add a state variable to track if we're in replay mode
  const [isReplayMode, setIsReplayMode] = useState<boolean>(false);
  const [isReplayInProgress, setIsReplayInProgress] = useState<boolean>(false);
  const [replayTimeouts, setReplayTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [taskEvents, setTaskEvents] = useState<any[]>([]);

  // Add state variable to track if input should be disabled due to URL parameter
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  // State variables for file viewing
  const [viewMode, setViewMode] = useState<ViewMode>("computer");
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [currentMarkdownFile, setCurrentMarkdownFile] = useState<MarkdownFile | null>(null);

  // State variables for task plan
  const [taskPlan, setTaskPlan] = useState<Task[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlanExpanded, setIsPlanExpanded] = useState<boolean>(false);

  // State for media control visibility
  const [isControlTrayVisible, setIsControlTrayVisible] = useState<boolean>(false);

  // Add state for session status
  const [sessionStatus, setSessionStatus] = useState<"active" | "deactive">("active");

  // Function to toggle the control tray
  const toggleControlTray = useCallback(() => {
    setIsControlTrayVisible((prev) => !prev);
  }, []);

  // Keep ref in sync with clarificationMode state
  useEffect(() => {
    clarificationModeRef.current = clarificationMode;
  }, [clarificationMode]);

  // Add an effect to load browser URL from localStorage
  useEffect(() => {
    const savedBrowserUrl = localStorage.getItem("browserStreamUrl");
    if (savedBrowserUrl) {
      console.log("Retrieved browser URL from localStorage:", savedBrowserUrl);
      setBrowserStreamUrl(savedBrowserUrl);
    }
  }, []);

  // Connect to Pusher when component mounts
  const connectToPusher = useCallback(
    async (providedSessionId?: string | null) => {
      try {
        setConnectionStatus("connecting");

        // First, ensure any existing connection is properly closed
        pusherManager.disconnect();

        const sessionIdToUse = providedSessionId || sessionId;

        if (sessionIdToUse) {
          console.log("Connecting to Pusher with existing session ID:", sessionIdToUse);
          await pusherManager.connect(sessionIdToUse);
          setConnectionStatus("connected");
          setSessionId(sessionIdToUse);
          cleanupEventListeners();
          setupEventListeners();
        } else {
          console.log("Connecting to Pusher with new session ID");
          const newSessionId = await pusherManager.connect();
          console.log("Connected to Pusher with session ID:", newSessionId);
          setConnectionStatus("connected");
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error("Failed to connect to Pusher:", error);
        setConnectionStatus("disconnected");
      }
    },
    [sessionId]
  );

  // Handle Pusher errors
  const handleErrorEvent = useCallback((data: any) => {
    console.error("Pusher error:", data);

    // Hide the thinking indicator
    setIsThinking(false);

    // Set task status to failed on error
    setTaskStatus("failed");

    if (data.type === "connection_error") {
      setConnectionStatus("disconnected");
    }

    if (data.message) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    }

    setIsProcessing(false);
  }, []);

  // Setup event listeners
  useEffect(() => {
    let isConnecting = true;

    if (isConnecting) {
      connectToPusher(sessionId).catch((error) => {
        console.error("Failed to connect in initial effect:", error);
        setConnectionStatus("disconnected");
      });

      setupEventListeners();

      isConnecting = false;
    }

    return () => {
      cleanupEventListeners();
    };
  }, []);

  // Check for task UUID in URL on initial load
  useEffect(() => {
    // Get task UUID from URL if available (format: ?task=uuid)
    const params = new URLSearchParams(window.location.search);
    const urlTaskUuid = params.get("task");

    // Check for replay parameter to disable input
    const replayParam = params.get("replay");
    if (replayParam === "1") {
      setIsInputDisabled(true);
    }

    if (urlTaskUuid) {
      setTaskUuid(urlTaskUuid);
      // Set loading state to true immediately when task UUID is found
      setIsLoadingHistory(true);

      // Load task history from API
      const loadTaskHistory = async () => {
        try {
          const response = await fetch(`${API_URL}/api/task/${urlTaskUuid}`);

          if (!response.ok) {
            throw new Error(`Failed to load task: ${response.status}`);
          }

          const taskData = await response.json();

          // Store task events for jump to results feature
          setTaskEvents(taskData.events || []);

          // Check session status and disable input if deactive
          if (taskData.session_status === "deactive") {
            setSessionStatus("deactive");
            setIsInputDisabled(true);
          } else {
            setSessionStatus("active");
          }

          // re connect to pusher with existing session id
          await connectToPusher(taskData.session_id).catch(console.error);

          // Set task status directly from API response
          if (["created", "in_progress", "completed", "failed"].includes(taskData.status)) {
            console.log("Setting task status:", taskData.status);
            setTaskStatus(taskData.status);

            // Set active states when task is in progress
            if (taskData.status === "in_progress") {
              setIsTaskActive(true);
              setIsProcessing(true);
            }
          }

          // Set replay mode to true when loading task history
          setIsReplayMode(true);
          setIsReplayInProgress(true);

          // Set session ID from task
          setSessionId(taskData.session_id);

          // Set stream URL if available
          if (taskData.stream_url) {
            setBrowserStreamUrl(taskData.stream_url);
            localStorage.setItem("browserStreamUrl", taskData.stream_url);
          }

          // Start with empty messages
          setMessages([]);

          // Define consistent delay for replay
          const eventDelay = 200; // 200ms between events
          let currentDelay = eventDelay;
          const timeouts: NodeJS.Timeout[] = [];

          // Process events with delay - reusing the same event handlers used for real-time events
          // for consistency between live sessions and replayed sessions
          for (let i = 0; i < taskData.events.length; i++) {
            const event = taskData.events[i];

            // Schedule the event processing with delay
            const timeout = setTimeout(() => {
              const eventType = event.event_type;
              const eventData = event.event_data;

              // Use the same handlers as for live events
              switch (eventType) {
                case "status_update":
                  handleStatusUpdate(eventData);
                  break;
                case "complete":
                  handleCompleteEvent(eventData);
                  break;
                case "error":
                  handleErrorEvent(eventData);
                  break;
                case "agent_stopped":
                  handleAgentStoppedEvent(eventData);
                  break;
                case "in_chat_updates":
                  handleInChatUpdatesEvent(eventData);
                  break;
                case "user_message":
                  // Add user message directly
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "user",
                      content: eventData.content,
                      timestamp: new Date(event.timestamp || new Date()),
                      type: eventData.type || "regular",
                    },
                  ]);
                  break;
                default:
                  // For any other event types, use generic processing
                  if (eventData) {
                    console.log(`Processing event of type: ${eventType}`, eventData);
                  }
              }
            }, currentDelay);

            timeouts.push(timeout);
            currentDelay += eventDelay;
          }

          // Store timeouts so they can be cleared if needed
          setReplayTimeouts(timeouts);

          // Connect to same session for continued interaction after replay is done
          const finalTimeout = setTimeout(() => {
            // Make sure thinking is turned off at the end of replay
            setIsThinking(false);
            // Set loading state to false once history is processed
            setIsLoadingHistory(false);
            // Keep replay mode on for smoother experience but mark replay as complete
            setIsReplayInProgress(false);
          }, currentDelay);

          timeouts.push(finalTimeout);
        } catch (error) {
          console.error("Error loading task history:", error);
          toast.error("Failed to load task history");
          // Make sure to set loading state to false on error
          setIsLoadingHistory(false);
        }
      };

      loadTaskHistory();
    }
  }, []);

  // Add handler for task_created event
  const handleTaskCreated = (data: any) => {
    if (!data || !data.task_uuid) return;

    console.log("Task created:", data);
    setTaskUuid(data.task_uuid);
    if (taskStatus !== "completed" && taskStatus !== "failed") {
      setTaskStatus("created");
    }

    // Update URL with task UUID without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("task", data.task_uuid);
    window.history.pushState({}, "", url.toString());
  };

  // Setup Pusher event listeners
  const setupEventListeners = () => {
    pusherManager.addEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    pusherManager.addEventListener(PusherEventType.Complete, handleCompleteEvent);
    pusherManager.addEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.addEventListener(PusherEventType.InChatUpdates, handleInChatUpdatesEvent);
    pusherManager.addEventListener(PusherEventType.AgentStopped, handleAgentStoppedEvent);
    pusherManager.addEventListener(PusherEventType.TaskCreated, handleTaskCreated);
    pusherManager.addEventListener(PusherEventType.SessionStatus, handleSessionStatusEvent);

    pusherManager.pusher?.connection.bind("state_change", (states: any) => {
      console.log("Pusher connection state changed:", states);
      if (states.current === "disconnected" || states.current === "failed") {
        setConnectionStatus("disconnected");
      }
    });
  };

  // Clean up event listeners
  const cleanupEventListeners = () => {
    pusherManager.removeEventListener(PusherEventType.StatusUpdate, handleStatusUpdate);
    pusherManager.removeEventListener(PusherEventType.Complete, handleCompleteEvent);
    pusherManager.removeEventListener(PusherEventType.Error, handleErrorEvent);
    pusherManager.removeEventListener(PusherEventType.AgentStopped, handleAgentStoppedEvent);
    pusherManager.removeEventListener(PusherEventType.InChatUpdates, handleInChatUpdatesEvent);
    pusherManager.removeEventListener(PusherEventType.TaskCreated, handleTaskCreated);
    pusherManager.removeEventListener(PusherEventType.SessionStatus, handleSessionStatusEvent);
  };

  // Add cleanup effect
  useEffect(() => {
    // Clear localStorage on page load/refresh
    localStorage.removeItem("browserStreamUrl");
    return () => {
      localStorage.removeItem("browserStreamUrl");
    };
  }, []);

  // Modify the visibility change effect to not restore on page refresh
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        // Only reconnect to Pusher if needed
        if (connectionStatus !== "connected") {
          await connectToPusher(sessionId);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [connectionStatus, connectToPusher]);

  // Add timer effect
  useEffect(() => {
    if (isTaskActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTaskActive]);

  // Add polling for active agent count
  // useEffect(() => {
  //   const fetchActiveAgentCount = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/api/agent/count`);
  //       const data = await response.json();
  //       setActiveAgentCount(data.count);
  //     } catch (error) {
  //       console.error('Error fetching active agent count:', error);
  //     }
  //   };

  //   // Only start polling if there's an active task
  //   if (isTaskActive) {
  //     // Initial fetch
  //     fetchActiveAgentCount();

  //     // Set up polling every 10 seconds
  //     pollRef.current = setInterval(fetchActiveAgentCount, 10000);
  //   } else {
  //     // Clear polling if no active task
  //     if (pollRef.current) {
  //       clearInterval(pollRef.current);
  //       pollRef.current = null;
  //     }
  //   }

  //   return () => {
  //     if (pollRef.current) {
  //       clearInterval(pollRef.current);
  //       pollRef.current = null;
  //     }
  //   };
  // }, [isTaskActive]);

  // Modify the existing handleStatusUpdate function to update task status
  const handleStatusUpdate = (data: any) => {
    if (!data) return;

    // Handle waiting for user response type
    if (data.type === "waiting_user_response") {
      console.log("User response required - setting clarification mode");
      setClarificationMode(true);
      setTaskStatus("waiting_user_response");
    }

    // For any other status update type, clear clarification mode if it's currently active
    // Use ref to get current value without causing unnecessary re-renders
    if (clarificationModeRef.current) {
      console.log("Clearing clarification mode due to status update:", data.type || "general");
      setClarificationMode(false);
      setTaskStatus("in_progress");
    }

    // Handle stream URL updates
    if (data.stream_url) {
      console.log("Browser stream URL received:", data.stream_url);
      setBrowserStreamUrl(data.stream_url);
      localStorage.setItem("browserStreamUrl", data.stream_url);
      return;
    }

    // Handle task plan updates (both initial creation and structural updates)
    if (data.task_plan) {
      console.log("Received task plan update:", data.task_plan);

      // If this is a structural plan update (plan_updated flag is true), simply replace the plan
      if (data.plan_updated) {
        console.log("Processing structural plan update (add/modify steps) - replacing plan");

        // Simply replace the entire plan - the backend sends the complete updated structure
        setTaskPlan(
          data.task_plan.map((stepObj: any) => ({
            step: stepObj.step,
            status: stepObj.status || "pending", // Only default to pending if status is null/undefined
          }))
        );

        // Show a message about the plan update if provided
        if (data.message) {
          console.log("Plan update message:", data.message);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `📋 Plan Updated: ${data.message}`,
              timestamp: new Date(),
              type: "plan_update",
              inChatUpdates: [],
            },
          ]);
        }
      } else {
        // This is an initial plan creation - use the complete step objects from backend
        console.log("Processing initial plan creation");
        setTaskPlan(
          data.task_plan.map((stepObj: any) => ({
            step: stepObj.step,
            status: stepObj.status || "pending", // Only default to pending if status is null/undefined
          }))
        );
      }
      return;
    }

    // Handle plan step status updates
    if (data.step_status && data.step_index !== undefined) {
      setTaskPlan((prevPlan) => {
        if (!prevPlan || prevPlan.length === 0) return prevPlan;

        const newPlan = [...prevPlan];
        const stepIndex = data.step_index;

        if (stepIndex >= 0 && stepIndex < newPlan.length) {
          newPlan[stepIndex] = {
            ...newPlan[stepIndex],
            status: data.step_status,
          };

          // If a step is processing, update currentStep
          if (data.step_status === "processing") {
            setCurrentStep(stepIndex);
          }
        }

        return newPlan;
      });
      return;
    }

    // Start timer and set active state only if the task is not already completed
    if (!isTaskActive && data.message) {
      // Only set the task as active if it's either in_progress or created
      if (!taskStatus || taskStatus === "in_progress" || taskStatus === "created") {
        console.log("Setting task as active. Current task status:", taskStatus);
        setIsTaskActive(true);
      }
    }

    // Handle live status updates from executor and exe_tool
    if (data.type === "live_status") {
      // Hide the thinking indicator when we get a live status update
      setIsThinking(false);

      // Add status update message
      const statusMessage: Message = {
        role: "assistant",
        content: data.message || "Executing...",
        timestamp: new Date(),
        type: "live_status",
        toolName: data.tool_name,
        inChatUpdates: [], // Initialize empty array for all status messages
      };

      setMessages((prev) => [...prev, statusMessage]);
      return;
    }

    // Handle thinking status event
    if (data.type === "thinking") {
      // Show the thinking indicator
      setIsThinking(true);
      return;
    }

    // For any other status update, hide the thinking indicator
    setIsThinking(false);

    // Handle regular message updates
    if (data.message) {
      // Hide thinking indicator when we get a message
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          type: data.type,
          toolName: data.tool_name,
          inChatUpdates: [], // Initialize empty array for regular messages too
        },
      ]);
    }
  };

  // Handle in-chat updates events
  const handleInChatUpdatesEvent = (data: any) => {
    if (!data) return;

    // Create update object
    const update = {
      id: Math.random().toString(36).substr(2, 9),
      tool: data.tool,
      event_type: data.event_type,
      data: data.data,
      timestamp: new Date(),
    };

    // Simply attach to the most recent message
    setMessages((prev) => {
      if (prev.length === 0) return prev;

      const messages = [...prev];
      const lastIndex = messages.length - 1;

      // Add to the most recent message, regardless of type
      messages[lastIndex] = {
        ...messages[lastIndex],
        inChatUpdates: [...(messages[lastIndex].inChatUpdates || []), update],
      };

      return messages;
    });
  };

  // Modify the existing handleCompleteEvent function
  const handleCompleteEvent = (data: any) => {
    // Debug browser URL
    console.log("Complete event received. Current browser URL:", browserStreamUrl);
    console.log("Current view mode:", viewMode);
    console.log("Has browser:", Boolean(browserStreamUrl));
    console.log("Has markdown:", Boolean(currentMarkdownFile));

    // Hide the thinking indicator
    setIsThinking(false);

    // Update task status to completed
    setTaskStatus("completed");

    const files = data.files || [];

    // if message is empty and there are no files then do not add a message
    if (!data.message && files.length === 0) {
      setIsProcessing(false);
      setIsTaskActive(false); // Stop the timer
      setTaskPlan([]);
      setIsPlanExpanded(false);
      return;
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: data.message,
      timestamp: new Date(),
      files: files,
      type: "completed", // Add a type to mark this as a completion message
    };

    setMessages((prev) => [...prev, assistantMessage]);

    setIsProcessing(false);
    setIsTaskActive(false); // Stop the timer

    // Clear the plan when a task is completed
    setTaskPlan([]);
    setIsPlanExpanded(false);

    // If we have files, switch to files view and set them
    if (files && files.length > 0) {
      setCurrentFiles(files);
      setCurrentFileIndex(0);
      setViewMode("files");
    }

    const shouldKeepBrowserOpen = data.keep_browser_open === true || (data.message && data.message.includes("I'll keep the browser open"));

    if (!shouldKeepBrowserOpen && viewMode === "computer") {
      console.log("Clearing browser URL");
      setBrowserStreamUrl(null);
      localStorage.removeItem("browserStreamUrl");
    }
  };

  // Handle sending a new message
  const handleSendMessage = (message: string) => {
    if (!sessionId) return;

    // Keep isReplayMode true even when sending messages to prevent animations
    // setIsReplayMode(true);

    console.log("Sending message:", message);
    console.log("Session ID:", sessionId);

    setIsProcessing(true);

    // Reset thinking state
    setIsThinking(false);

    // If we're sending a new message after a completed or failed task,
    // we need to set the task status back to created (a new task will start)
    if (taskStatus !== "in_progress") {
      setTaskStatus("in_progress");
      setIsTaskActive(true);
    }

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
      type: isProcessing && !clarificationMode ? "intervention" : "regular",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Only set processing state when not already processing
    if (!isProcessing) {
      setIsProcessing(true);
    }

    // Send message with type based on if we're already processing
    pusherManager.sendMessage(message, isProcessing && !clarificationMode ? "intervention" : "regular", null, taskUuid);
  };

  const handleTakeControl = async () => {
    if (!sessionId) return;

    console.log("User taking control of browser");
    setUserHasControl(true);

    try {
      const response = await fetch(`${API_URL}/api/took_control/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Control event sent successfully:", data);
    } catch (error) {
      console.error("Error sending control event:", error);
    }
  };

  const handleFinishControl = () => {
    setUserHasControl(false);
    setShowControlSummaryModal(true);
  };

  const handleSubmitControlSummary = async () => {
    if (!sessionId) return;

    console.log("Submitting control summary:", controlSummary);

    setShowControlSummaryModal(false);
    setControlSummary("");

    try {
      const response = await fetch(`${API_URL}/api/took_control_response/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary: controlSummary }),
      });

      const data = await response.json();
      console.log("Control response sent successfully:", data);
    } catch (error) {
      console.error("Error sending control response:", error);
    }
  };

  const handleCuaClarificationEvent = (data: any) => {
    // Skip if data is empty or has no question
    if (!data || !data.question) {
      console.log("Skipping empty CUA clarification event");
      return;
    }

    // Hide the thinking indicator
    setIsThinking(false);

    console.log("Received CUA clarification request:", data);
    console.log("Setting clarification mode to true");
    console.log("Storing clarification ID:", data.id);

    // Extract the question and ID
    const question = data.question;
    const clarificationId = data.id;

    // Add assistant message asking the clarification question
    const assistantMessage: Message = {
      role: "assistant",
      content: question,
      timestamp: new Date(),
      requiresResponse: true, // Flag to indicate this needs a direct response
      clarificationId: clarificationId, // Store the ID for the response
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Set a special processing state that indicates we're waiting for user clarification
    setIsProcessing(false);
    setClarificationMode(true);
  };

  const handleFileClick = (file: { name: string; path: string }) => {
    const fileIndex = currentFiles.findIndex((f) => f.path === file.path);
    if (fileIndex !== -1) {
      setCurrentFileIndex(fileIndex);
      setViewMode("files");
    }
  };

  const handleNextFile = () => {
    if (currentFileIndex < currentFiles.length - 1) {
      setCurrentFileIndex((prev) => prev + 1);
    }
  };

  const handlePrevFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex((prev) => prev - 1);
    }
  };

  const toggleViewMode = () => {
    // Debug browser URL availability
    console.log("Toggle view mode. Current mode:", viewMode);
    console.log("Browser URL available:", Boolean(browserStreamUrl), browserStreamUrl);
    console.log("Has files:", currentFiles.length > 0);
    console.log("Has markdown:", Boolean(currentMarkdownFile));

    // Force browser view if it's available and we're not already in it
    if (viewMode !== "computer" && browserStreamUrl) {
      console.log("Switching to browser view");
      setViewMode("computer");
      return;
    }

    // Otherwise, if we're in computer view, go to files if available
    if (viewMode === "computer") {
      console.log("Switching from computer view to files");
      setViewMode(currentFiles.length > 0 ? "files" : "markdown");
    }
    // If in files view and no browser is available, go to markdown if available
    else if (viewMode === "files") {
      console.log("Switching from files view to markdown");
      setViewMode(currentMarkdownFile ? "markdown" : "computer");
    }
    // If in markdown view and no browser is available, go to files if available
    else {
      console.log("Switching from markdown view to files");
      setViewMode(currentFiles.length > 0 ? "files" : "computer");
    }
  };

  // Handle agent stopped event
  const handleAgentStoppedEvent = (data: any) => {
    console.log("Agent stopped event received:", data);

    // Hide the thinking indicator
    setIsThinking(false);

    // Update task status to failed when stopped
    setTaskStatus("failed");

    setIsProcessing(false);
    setIsTaskActive(false);

    // Clear the plan when a task is stopped
    setTaskPlan([]);
    setIsPlanExpanded(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Add a system message indicating the task was stopped
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: data.message || "Task was stopped by the user.",
        timestamp: new Date(),
        type: "stopped", // Add a type to mark this as a stopped message
      },
    ]);
  };

  // Handle session status event
  const handleSessionStatusEvent = (data: any) => {
    console.log("Session status event received:", data);

    if (data.session_status === "deactive") {
      setSessionStatus("deactive");
      setIsInputDisabled(true);

      // Add a system message about session expiry
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: data.message || "Session expired after 2.5 hours. Please start a new session.",
          timestamp: new Date(),
          type: "session_expired",
        },
      ]);
    }
  };

  const handleRetryConnection = () => {
    setConnectionStatus("connecting");
    connectToPusher(sessionId).catch((error) => {
      console.error("Failed to reconnect:", error);
      setConnectionStatus("disconnected");
    });
  };

  // Add the missing handleMarkdownFileClick handler
  const handleMarkdownFileClick = (file: { name: string; path: string; content: string; file_url?: string }) => {
    // Check if we need to load content from URL (only if content is empty or placeholder)
    if (file.file_url && (file.content === "Loading content..." || !file.content)) {
      // Show loading state
      setCurrentMarkdownFile({ ...file, content: "Loading content..." });
      setViewMode("markdown");

      // Fetch content from URL
      fetch(file.file_url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file content: ${response.status}`);
          }
          return response.text();
        })
        .then((content) => {
          // Update the current markdown file with fetched content
          const updatedFile = { ...file, content };
          setCurrentMarkdownFile(updatedFile);

          // Update the content in the message that contains this file
          setMessages((prev) => {
            return prev.map((message) => {
              // If this is a status message with markdownData matching this file
              if (message.markdownData?.filename === file.name && message.markdownData?.path === file.path) {
                return {
                  ...message,
                  markdownData: {
                    ...message.markdownData,
                    content: content,
                  },
                };
              }

              // If this message has markdownFiles array containing this file
              if (message.markdownFiles) {
                const fileIndex = message.markdownFiles.findIndex((f) => f.name === file.name && f.path === file.path);

                if (fileIndex >= 0) {
                  const updatedFiles = [...message.markdownFiles];
                  updatedFiles[fileIndex] = {
                    ...updatedFiles[fileIndex],
                    content: content,
                  };

                  return {
                    ...message,
                    markdownFiles: updatedFiles,
                  };
                }
              }

              return message;
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching markdown file:", error);
          setCurrentMarkdownFile({
            ...file,
            content: `Error loading content: ${error.message}`,
          });
        });
    } else {
      // We already have content, just display it
      setCurrentMarkdownFile(file);
      setViewMode("markdown");
    }
  };

  // Add handler for stopping the agent
  const handleStopAgent = async () => {
    console.log("Stopping agent");
    console.log("Session ID:", sessionId);
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_URL}/api/agent/stop/${sessionId}`, {
        method: "POST",
      });

      const data = await response.json();
      console.log("Agent stopped successfully:", data);

      // Reset processing state
      setIsProcessing(false);
      setIsTaskActive(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping agent:", error);
      toast.error("Failed to stop the agent");
    }
  };

  // Function to jump to end of replay
  const handleJumpToResults = () => {
    console.log("Jumping to results");

    // Clear all pending timeouts
    replayTimeouts.forEach((timeout) => clearTimeout(timeout));
    setReplayTimeouts([]);

    // Clear existing messages
    setMessages([]);

    // Process all events immediately without delays
    taskEvents.forEach((event: { event_type: string; event_data: any; timestamp?: string }) => {
      const eventType = event.event_type;
      const eventData = event.event_data;

      switch (eventType) {
        case "status_update":
          handleStatusUpdate(eventData);
          break;
        case "complete":
          handleCompleteEvent(eventData);
          break;
        case "error":
          handleErrorEvent(eventData);
          break;
        case "agent_stopped":
          handleAgentStoppedEvent(eventData);
          break;
        case "in_chat_updates":
          handleInChatUpdatesEvent(eventData);
          break;
        case "user_message":
          // Add user message directly
          setMessages((prev) => [
            ...prev,
            {
              role: "user",
              content: eventData.content,
              timestamp: new Date(event.timestamp || new Date()),
              type: eventData.type || "regular",
            },
          ]);
          break;
      }
    });

    // Make sure we stop loading and thinking indicators
    setIsThinking(false);
    setIsLoadingHistory(false);
    setIsReplayInProgress(false);

    // Scroll to bottom after a brief delay to allow rendering
    setTimeout(() => {
      const chatContainer = document.querySelector(".overflow-y-auto");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        connectionStatus={connectionStatus}
        isTaskActive={isTaskActive}
        elapsedTime={elapsedTime}
        activeAgentCount={0}
        onRetryConnection={handleRetryConnection}
        onStopAgent={handleStopAgent}
        taskStatus={taskStatus}
      />

      {/* Jump to Results button - only show during active replay */}
      {isReplayMode && isReplayInProgress && (
        <div className="fixed top-16 right-4 z-50">
          <button onClick={handleJumpToResults} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition-colors">
            Jump to Results
          </button>
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden ${messages.length === 0 ? "justify-center" : ""}`}>
        {/* Chat Section */}
        <ChatSection
          messages={messages}
          isThinking={isThinking}
          connectionStatus={connectionStatus}
          isProcessing={isProcessing}
          onSendMessage={handleSendMessage}
          onFileClick={handleFileClick}
          onMarkdownFileClick={handleMarkdownFileClick}
          isLoadingHistory={isLoadingHistory}
          isReplayMode={isReplayMode}
          clarificationMode={clarificationMode}
          isInputDisabled={isInputDisabled}
          sessionStatus={sessionStatus}
        />

        {/* Right Panel - only show when there are messages */}
        {messages.length > 0 && (
          <RightPanel
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
            browserStreamUrl={browserStreamUrl}
            userHasControl={userHasControl}
            onTakeControl={handleTakeControl}
            onFinishControl={handleFinishControl}
            currentFiles={currentFiles}
            currentFileIndex={currentFileIndex}
            onPrevFile={handlePrevFile}
            onNextFile={handleNextFile}
            currentMarkdownFile={currentMarkdownFile}
            tasks={taskPlan}
            currentStep={currentStep}
            isPlanExpanded={isPlanExpanded}
            toggleExpandPlan={() => setIsPlanExpanded(!isPlanExpanded)}
          />
        )}
      </div>

      {/* Control Summary Modal */}
      <ControlSummaryModal isOpen={showControlSummaryModal} controlSummary={controlSummary} setControlSummary={setControlSummary} onSubmit={handleSubmitControlSummary} />
    </div>
  );
}
