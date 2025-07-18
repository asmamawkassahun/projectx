// import React, { useRef, useState, useEffect, useCallback } from 'react';
// import ControlTray from './control-tray/ControlTray';
// import ToolHandler from './ToolHandler';
// import { motion, AnimatePresence } from 'framer-motion';
// import CenteredAudioPulse from './CenteredAudioPulse';
// import VideoPreview from './VideoPreview';
// import ThinkingIndicator from './ThinkingIndicator';
// import { audioContext } from '@/lib/utils';
// // Import our combined replay hook
// import { useCombinedReplay } from '@/hooks/useCombinedReplay';

// // Import new components
// import VoiceAgentHeader from './VoiceAgentHeader';
// import AudioReplayControls from './AudioReplayControls';
// import EventDisplayContainer from './EventDisplayContainer';
// import TaskInfoDisplay from './TaskInfoDisplay';
// import TaskPlanDisplay from './task/TaskPlanDisplay';

// // Import custom hooks
// import { useVoiceAgentMessages } from '@/hooks/useVoiceAgentMessages';
// import { usePusherConnection } from '@/hooks/usePusherConnection';
// import { useTaskPlan } from '@/hooks/useTaskPlan';
// import { useAudioContext } from '@/hooks/useAudioContext';
// import { API_URL } from '@/config/api';

// export default function VoiceAgent() {
//   // Video reference for displaying the active stream
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // State for video stream
//   const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

//   // State for URL parameters
//   const [urlHasConversationId, setUrlHasConversationId] = useState(false);
//   const [urlIsReplayMode, setUrlIsReplayMode] = useState(false);

//   // VoiceAgent-specific UI state
//   const [isReplayMode, setIsReplayMode] = useState(false);
//   const [showReplayButton, setShowReplayButton] = useState(false);

//   // State for conversation management
//   const [conversationId, setConversationId] = useState<string | null>(null);

//   // Track if initialization has already happened to prevent multiple calls
//   const hasInitialized = useRef(false);

//   // Check URL for parameters in useEffect to avoid server-side window access
//   useEffect(() => {
//     // Only access window when in browser environment
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       setUrlHasConversationId(urlParams.has('conversationId'));
//       setUrlIsReplayMode(urlParams.get('replay') === '1');
//     }
//   }, []);

//   // Use our custom hooks
//   const { audioContext, resumeContext } = useAudioContext();

//   const {
//     taskPlan,
//     currentStep,
//     showPlanInCenter,
//     planVisible,
//     updateTaskPlan,
//     updateStepStatus,
//     resetTaskPlan
//   } = useTaskPlan();

//   // Use the messages hook
//   const {
//     messages,
//     displayedEvents,
//     taskTitle,
//     taskDescription,
//     showCenteredPulse,
//     setShowCenteredPulse,
//     handleInChatUpdate,
//     addStatusUpdate,
//     addAssistantMessage,
//     addSystemEventMessage,
//     addUserMessage
//   } = useVoiceAgentMessages();

//   // Create a ref to hold the event handler to avoid dependency issues
//   const eventHandlerRef = useRef<((event: any) => void) | null>(null);

//   // Use our combined replay hook with all replay functionality
//   const {
//     combinedEvents,
//     currentIndex,
//     isReplaying,
//     isPlaying,
//     hasFinished,
//     audioError,
//     initializeReplay,
//     startReplay,
//     pauseReplay,
//     jumpToEnd,
//     isLoading,
//     setSessionId
//   } = useCombinedReplay({
//     apiUrl: '/api',
//     delayBetweenEvents: 300,
//     onEvent: (event) => eventHandlerRef.current?.(event)
//   });

//   // Use Pusher connection hook
//   const {
//     sessionId: pusherSessionId,
//     isProcessing,
//     isTaskActive,
//     isThinking,
//     taskUuid: pusherTaskUuid,
//     setIsProcessing,
//     setIsTaskActive,
//     setIsThinking,
//     connectToPusher,
//     registerEventHandlers,
//     sendMessage: pusherSendMessage,
//     stopAgent
//   } = usePusherConnection(conversationId);

//   // Log any replay errors
//   useEffect(() => {
//     if (audioError) {
//       console.error('Replay error:', audioError);
//     }
//   }, [audioError]);

//   // Function to create a new conversation
//   const createConversation = useCallback(async (sessId: string, title?: string) => {
//     if (!sessId) {
//       console.error('Cannot create conversation: No session ID provided');
//       return null;
//     }

//     try {
//       console.log('Creating a new conversation for session:', sessId);

//       const response = await fetch(`${API_URL}/api/audio/conversation/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           session_id: sessId,
//           title: title || `Voice Conversation ${new Date().toLocaleString()}`
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Update state with the new conversation ID
//       if (data.conversation_id) {
//         console.log('New conversation created with ID:', data.conversation_id);
//         setConversationId(data.conversation_id);
//         setSessionId(sessId);

//         // Update URL with the new conversation ID for sharing/persistence
//         // BUT don't set replay=1 for new conversations
//         if (typeof window !== 'undefined') {
//           const url = new URL(window.location.href);
//           url.searchParams.set('conversationId', data.conversation_id);
//           // Ensure replay mode is not set for new conversations
//           url.searchParams.delete('replay');
//           window.history.replaceState({}, '', url.toString());
//           console.log('URL updated with conversation ID, replay mode disabled');
//         }

//         // Ensure we're not in replay mode for new conversations
//         console.log('Setting replay mode to false for new conversation');
//         setIsReplayMode(false);
//         setShowReplayButton(false);

//         return data.conversation_id;
//       }

//       return null;
//     } catch (error) {
//       console.error('Failed to create audio conversation:', error);
//       return null;
//     }
//   }, [setSessionId, setIsReplayMode, setShowReplayButton]);

//   // Initialize conversation based on URL parameters and session
//   const initializeConversation = useCallback(async (sessId?: string) => {
//     // Skip on server-side
//     if (typeof window === 'undefined') {
//       return { conversationId: null, isReplay: false };
//     }

//     // Check URL for conversation ID and replay flag
//     const urlParams = new URLSearchParams(window.location.search);
//     const convId = urlParams.get('conversationId');
//     const isReplay = urlParams.get('replay') === '1';

//     console.log('Initializing conversation - conversationId:', convId, 'replay mode:', isReplay);

//     if (convId && isReplay) {
//       // Use existing conversation ID from URL with replay mode
//       setConversationId(convId);
//       console.log('Conversation ID found in URL with replay mode:', convId);

//       // Initialize replay with this conversation ID
//       const success = await initializeReplay(convId);
//       if (success) {
//         setIsReplayMode(true);
//         setShowReplayButton(true);
//       }
//       return { conversationId: convId, isReplay: success };
//     } else if (convId) {
//       // ConversationId exists but not in replay mode
//       setConversationId(convId);
//       setIsReplayMode(false);
//       setShowReplayButton(false);
//       console.log('Conversation ID found but not in replay mode:', convId);
//       return { conversationId: convId, isReplay: false };
//     } else if (sessId) {
//       // No conversation ID in URL but session ID provided
//       // Create new conversation
//       const newConvId = await createConversation(sessId);

//       if (newConvId) {
//         // Conversation created successfully
//         console.log('New conversation created, not in replay mode');
//         return { conversationId: newConvId, isReplay: false };
//       }
//     }

//     setIsReplayMode(false);
//     setShowReplayButton(false);
//     return { conversationId: null, isReplay: false };
//   }, [initializeReplay, createConversation, setConversationId]);

//   // Initialize with conversation ID from URL or create new one if needed
//   useEffect(() => {
//     if (hasInitialized.current) {
//       console.log('Skipping VoiceAgent initialization - already done');
//       return;
//     }

//     if (!pusherSessionId) {
//       console.error('No pusherSessionId found');
//       return;
//     }

//     console.log('Initializing VoiceAgent with pusherSessionId:', pusherSessionId || 'none');
//     hasInitialized.current = true;

//     // Handle the initialization logic
//     initializeConversation(pusherSessionId || undefined).then(result => {
//       if (result.conversationId) {
//         console.log('Conversation initialized with ID:', result.conversationId, 'isReplay:', result.isReplay);
//       } else {
//         console.error('Failed to initialize conversation');
//       }
//     }).catch(error => {
//       console.error('Error initializing conversation:', error);
//       // Reset the flag on error so it can be retried
//       hasInitialized.current = false;
//     });
//   }, [pusherSessionId]); // Only depend on pusherSessionId, which is stable

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isThinking]);

//   // Connect to Pusher and set up event handlers
//   useEffect(() => {
//     connectToPusher();

//     const cleanupHandlers = registerEventHandlers({
//       onStatusUpdate: handleStatusUpdate,
//       onCompleteEvent: handleCompleteEvent,
//       onErrorEvent: handleErrorEvent,
//       onAgentStoppedEvent: handleAgentStoppedEvent,
//       onInChatUpdatesEvent: handleInChatUpdate
//     });

//     return () => {
//       cleanupHandlers();
//     };
//   }, []);

//   // Log state changes for debugging
//   useEffect(() => {
//     console.log('State changes - isReplayMode:', isReplayMode, 'showReplayButton:', showReplayButton);
//   }, [isReplayMode, showReplayButton]);

//   // Hide the centered pulse when we have events to show
//   useEffect(() => {
//     if (displayedEvents.length > 0) {
//       setShowCenteredPulse(false);
//     }
//   }, [displayedEvents, setShowCenteredPulse]);

//   // Computed value to determine if we should show normal content
//   const showContent = !showReplayButton;

//   // Control tray visibility depends on whether we're in replay mode
//   const showControlTray = !isReplayMode;

//   // Handle Status Updates from the agent
//   const handleStatusUpdate = (data: any) => {
//     if (!data) return;

//     // Handle task plan updates (both initial creation and structural updates)
//     if (data.task_plan) {
//       console.log("Received task plan update in VoiceAgent:", data.task_plan);

//       // Simply update the task plan - the useTaskPlan hook handles it appropriately
//       updateTaskPlan(data.task_plan.map((stepObj: any) => stepObj.step));

//       // If there's a plan update message, log it
//       if (data.plan_updated && data.message) {
//         console.log("Plan update message in VoiceAgent:", data.message);
//       }

//       return;
//     }

//     // Handle plan step status updates
//     if (data.step_status && data.step_index !== undefined) {
//       updateStepStatus(data.step_index, data.step_status);
//       return;
//     }

//     // Start task if not already active
//     if (!isTaskActive && data.message) {
//       setIsTaskActive(true);
//     }

//     // Handle live status updates from executor and exe_tool
//     if (data.type === 'live_status') {
//       setIsThinking(false);
//       addStatusUpdate(data);
//       return;
//     }

//     // Handle thinking status event
//     if (data.type === 'thinking') {
//       setIsThinking(true);
//       return;
//     }

//     // For any other status update, hide the thinking indicator
//     setIsThinking(false);

//     // Handle regular message updates - go to conversation messages
//     if (data.message && !data.type) {
//       addAssistantMessage(data.message);
//       return;
//     }

//     // Otherwise add to messages as an event
//     if (data.message) {
//       addSystemEventMessage(data.message, data.type, data.tool_name);
//     }
//   };

//   // Handle completion events
//   const handleCompleteEvent = (data: any) => {
//     setIsThinking(false);

//     // Get any files from the completion event
//     const files = data.files || [];

//     if (data.message) {
//       addAssistantMessage(data.message, 'completed', files);
//     }

//     setIsProcessing(false);
//     setIsTaskActive(false);
//     resetTaskPlan();
//   };

//   // Handle error events
//   const handleErrorEvent = (data: any) => {
//     setIsThinking(false);

//     if (data.message) {
//       addAssistantMessage(data.message, 'error');
//     }

//     setIsProcessing(false);
//   };

//   // Handle agent stopped event
//   const handleAgentStoppedEvent = (data: any) => {
//     setIsThinking(false);
//     setIsProcessing(false);
//     setIsTaskActive(false);
//     resetTaskPlan();

//     // Add a system message indicating the task was stopped
//     addSystemEventMessage(
//       data.message || 'Task was stopped by the user.',
//       'stopped'
//     );
//   };

//   // Handle user message - used during replay
//   const handleUserMessage = (data: any) => {
//     if (data && data.content) {
//       addUserMessage(data.content, data.type || 'regular');
//     }
//   };

//   // Set up the event handler for replay
//   eventHandlerRef.current = useCallback((event: any) => {
//     switch (event.eventType) {
//       case 'status_update':
//         handleStatusUpdate(event.data);
//         break;
//       case 'complete':
//         handleCompleteEvent(event.data);
//         break;
//       case 'error':
//         handleErrorEvent(event.data);
//         break;
//       case 'agent_stopped':
//         handleAgentStoppedEvent(event.data);
//         break;
//       case 'in_chat_updates':
//         handleInChatUpdate(event.data);
//         break;
//       case 'user_message':
//         handleUserMessage(event.data);
//         break;
//       default:
//         console.log(`Unknown event type: ${event.eventType}`);
//     }
//   }, [handleStatusUpdate, handleCompleteEvent, handleErrorEvent, handleAgentStoppedEvent, handleInChatUpdate, handleUserMessage]);

//   // Send a message from the user
//   const sendMessage = async (message: string) => {
//     addUserMessage(message, isProcessing ? 'intervention' : 'regular');

//     if (!isProcessing) {
//       setIsProcessing(true);
//     }

//     console.log('Sending message to Pusher:', message, isProcessing ? 'intervention' : 'regular', 'conversationId:', conversationId);

//     // Send message to backend
//     const taskResponse = await pusherSendMessage(
//       message,
//       isProcessing ? 'intervention' : 'regular'
//     );

//     console.log('Task response:', taskResponse);
//   };

//   // Function to begin replay of the combined events
//   const handleStartReplay = async () => {
//     // Hide pulse and replay button
//     setShowCenteredPulse(false);
//     setShowReplayButton(false);

//     // Start the replay
//     await startReplay();
//   };

//   // Function to jump to end of replay
//   const handleJumpToResults = () => {
//     // Hide pulse and replay button
//     setShowCenteredPulse(false);
//     setShowReplayButton(false);

//     // Jump to end of replay
//     jumpToEnd();
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-background">
//       {/* Main content */}
//       <main className="flex-grow flex flex-col">
//         <div className="fixed inset-0 z-[9999] bg-background/95 flex flex-col">
//           {/* Header with logo */}
//           <VoiceAgentHeader
//             isReplayMode={isReplayMode}
//             isReplaying={isReplaying}
//             currentAudioIndex={currentIndex}
//             audioMessagesCount={combinedEvents.length}
//           />

//           {/* Only show these components if we're not in initial replay state with button */}
//           {showContent && (
//             <>
//               {/* Task Info Display - title and description */}
//               <TaskInfoDisplay
//                 taskTitle={taskTitle}
//                 taskDescription={taskDescription}
//               />

//               {/* Task Plan Display */}
//               <TaskPlanDisplay
//                 taskPlan={taskPlan}
//                 currentStep={currentStep}
//                 showPlanInCenter={showPlanInCenter}
//                 planVisible={planVisible}
//               />
//             </>
//           )}

//           {/* Main content area with task updates */}
//           <div className="flex-1 flex flex-col relative px-4 overflow-hidden">
//             {/* Loading indicator when fetching audio/task data */}
//             <AnimatePresence>
//               {isLoading && (
//                 <motion.div
//                   className="absolute inset-0 flex items-center justify-center z-30"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="flex flex-col items-center space-y-4">
//                     <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-primary font-medium">Loading audio data...</p>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Centered AudioPulse - shown at the beginning or after replay completes, but hidden during active replay */}
//             <AnimatePresence>
//               {showCenteredPulse && !isReplaying && !showReplayButton && displayedEvents.length === 0 && !isLoading && (
//                 <motion.div
//                   className="absolute inset-0 flex items-center justify-center"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.8 }}
//                 >
//                   <CenteredAudioPulse isActive={true} />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Audio Replay Controls - now uses combined replay */}
//             <AnimatePresence>
//               {!isLoading && (
//                 <AudioReplayControls
//                   isReplayMode={isReplayMode}
//                   isReplaying={isReplaying}
//                   isPlaying={isPlaying}
//                   showReplayButton={showReplayButton}
//                   audioMessages={combinedEvents}
//                   currentAudioIndex={currentIndex}
//                   setShowCenteredPulse={setShowCenteredPulse}
//                   setShowReplayButton={setShowReplayButton}
//                   startReplay={handleStartReplay}
//                   pauseReplay={pauseReplay}
//                   jumpToResults={handleJumpToResults}
//                   audioContext={audioContext || undefined}
//                 />
//               )}
//             </AnimatePresence>

//             {/* Status Updates and Event Messages - only shown when not in initial replay state and not loading */}
//             {showContent && !isLoading && (
//               <EventDisplayContainer
//                 displayedEvents={displayedEvents}
//                 isReplayMode={isReplayMode}
//                 isReplaying={isReplaying}
//               />
//             )}

//             {/* Thinking indicator - use existing component */}
//             <AnimatePresence>
//               {isThinking && showContent && !isLoading && <ThinkingIndicator />}
//             </AnimatePresence>

//             {/* Reference for scrolling to bottom */}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Tool Handler that listens for tool calls */}
//           <ToolHandler
//             sendMessage={sendMessage}
//             handleAgentStopped={stopAgent}
//             taskUuid={pusherTaskUuid}
//           />

//           {/* Video Preview component - shown when there's an active stream */}
//           <VideoPreview
//             videoStream={videoStream}
//             videoRef={videoRef}
//             onVideoStreamChange={setVideoStream}
//             isVisible={showContent}
//           />

//           {/* Control Tray - only show when NOT in replay mode */}
//           {showControlTray && !isLoading && (
//             <div className="absolute bottom-8 inset-x-0 flex justify-center z-20">
//               <ControlTray
//                 videoRef={videoRef}
//                 supportsVideo={true}
//                 onVideoStreamChange={setVideoStream}
//                 conversationId={conversationId || undefined}
//               />
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
