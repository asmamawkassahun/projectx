import { useState, useEffect } from 'react';
import { ExtendedMessage, InChatUpdate } from '@/types/voice-agent';

// Function to generate a unique ID for messages
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const useVoiceAgentMessages = () => {
  // State for conversation and messages
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<ExtendedMessage[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [showCenteredPulse, setShowCenteredPulse] = useState(true);

  // Effect to extract task title from first user message
  useEffect(() => {
    // Find user and assistant messages for title/description
    const userMessages = messages.filter(msg => msg.role === 'user');
    const assistantMessages = messages.filter(msg => msg.role === 'assistant' && msg.display === 'conversation');
    
    if (userMessages.length > 0 && !taskTitle) {
      setTaskTitle(userMessages[0].content);
    }
    
    if (assistantMessages.length > 0 && !taskDescription) {
      setTaskDescription(assistantMessages[0].content);
    }
  }, [messages, taskTitle, taskDescription]);

  // Effect to handle displayed events
  useEffect(() => {
    // Filter messages that should be displayed as events
    const eventMessages = messages.filter(msg => 
      msg.type === 'event' || 
      msg.type === 'live_status' || 
      msg.display === 'costar_event'
    );
    
    if (eventMessages.length > 0) {
      // Get the latest events for display
      const latestEvents = eventMessages.slice(-12);
      setDisplayedEvents(latestEvents);
    }
  }, [messages]);

  // Handle in-chat updates
  const handleInChatUpdate = (data: any) => {
    if (!data) return;
    
    // Create update object
    const update: InChatUpdate = {
      id: generateId(),
      tool: data.tool,
      event_type: data.event_type,
      data: data.data,
      timestamp: new Date()
    };
    
    // Simply attach to the most recent message
    setMessages(prev => {
      if (prev.length === 0) return prev;
      
      const messages = [...prev];
      const lastIndex = messages.length - 1;
      
      // Add to the most recent message, regardless of type
      messages[lastIndex] = {
        ...messages[lastIndex],
        inChatUpdates: [...(messages[lastIndex].inChatUpdates || []), update]
      };
      
      // Also update displayed events if this is a system/event message
      if (messages[lastIndex].type === 'event' || 
          messages[lastIndex].type === 'live_status' || 
          messages[lastIndex].display === 'costar_event') {
        setDisplayedEvents(prev => {
          const events = [...prev];
          const displayedLastIndex = events.findIndex(e => e.id === messages[lastIndex].id);
          
          if (displayedLastIndex !== -1) {
            events[displayedLastIndex] = {
              ...events[displayedLastIndex],
              inChatUpdates: [...(events[displayedLastIndex].inChatUpdates || []), update]
            };
          }
          
          return events;
        });
      }
      
      return messages;
    });
  };

  // Add a status update message
  const addStatusUpdate = (data: any) => {
    if (!data.message) return;

    const statusMessage: ExtendedMessage = {
      id: generateId(),
      role: 'system',
      content: data.message || 'Executing...',
      timestamp: new Date(),
      type: 'live_status',
      display: 'costar_event',
      toolName: data.tool_name,
      inChatUpdates: [] // Initialize empty array for status messages
    };
    
    setMessages(prev => [...prev, statusMessage]);
  };

  // Add an assistant message
  const addAssistantMessage = (message: string, type: string = 'completed', files: any[] = []) => {
    const assistantMessage: ExtendedMessage = {
      id: generateId(),
      role: 'assistant',
      content: message,
      timestamp: new Date(),
      type,
      display: 'conversation',
      inChatUpdates: [],
      files
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // If this is the first assistant message, set it as task description
    if (!taskDescription && messages.some(msg => msg.role === 'user')) {
      setTaskDescription(message);
    }
  };

  // Add a system event message
  const addSystemEventMessage = (message: string, type: string, toolName?: string) => {
    const eventMessage: ExtendedMessage = {
      id: generateId(),
      role: 'system',
      content: message,
      timestamp: new Date(),
      type,
      display: 'costar_event',
      toolName,
      inChatUpdates: []
    };
    
    setMessages(prev => [...prev, eventMessage]);
  };

  // Add a user message
  const addUserMessage = (message: string, type: string = 'regular') => {
    const userMessage: ExtendedMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      type,
      display: 'conversation',
      inChatUpdates: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Set task title if this is the first message
    if (messages.length === 0) {
      setTaskTitle(message);
    }
  };

  return {
    messages,
    displayedEvents,
    taskTitle,
    taskDescription,
    showCenteredPulse,
    setShowCenteredPulse,
    handleInChatUpdate,
    addStatusUpdate,
    addAssistantMessage,
    addSystemEventMessage,
    addUserMessage
  };
}; 