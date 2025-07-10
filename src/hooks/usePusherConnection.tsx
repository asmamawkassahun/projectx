import { useState, useEffect, useCallback } from 'react';
import { PusherEventType, pusherManager } from '@/lib/pusher';
import { API_URL } from '@/config/api';

export const usePusherConnection = (conversationId?: string | null) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [taskUuid, setTaskUuid] = useState<string | null>(null);

  // Connect to Pusher when component mounts
  const connectToPusher = useCallback(async () => {
    try {
      // Reuse existing connection if available, otherwise create a new one
      if (!pusherManager.pusher) {
        console.log('Connecting to Pusher with new session ID');
        const newSessionId = await pusherManager.connect();
        console.log('Connected to Pusher with session ID:', newSessionId);
        setSessionId(newSessionId);
      } else {
        console.log('Reusing existing Pusher connection');
        const newSessionId = await pusherManager.connect();
        setSessionId(newSessionId);
      }
    } catch (error) {
      console.error('Failed to connect to Pusher:', error);
    }
  }, []);

  // Register event handlers
  const registerEventHandlers = useCallback((handlers: {
    onStatusUpdate: (data: any) => void;
    onCompleteEvent: (data: any) => void;
    onErrorEvent: (data: any) => void;
    onAgentStoppedEvent: (data: any) => void;
    onInChatUpdatesEvent: (data: any) => void;
  }) => {
    const { 
      onStatusUpdate,
      onCompleteEvent, 
      onErrorEvent, 
      onAgentStoppedEvent, 
      onInChatUpdatesEvent 
    } = handlers;

    pusherManager.addEventListener(PusherEventType.StatusUpdate, onStatusUpdate);
    pusherManager.addEventListener(PusherEventType.Complete, onCompleteEvent);
    pusherManager.addEventListener(PusherEventType.Error, onErrorEvent);
    pusherManager.addEventListener(PusherEventType.AgentStopped, onAgentStoppedEvent);
    pusherManager.addEventListener(PusherEventType.InChatUpdates, onInChatUpdatesEvent);

    // Return cleanup function
    return () => {
      pusherManager.removeEventListener(PusherEventType.StatusUpdate, onStatusUpdate);
      pusherManager.removeEventListener(PusherEventType.Complete, onCompleteEvent);
      pusherManager.removeEventListener(PusherEventType.Error, onErrorEvent);
      pusherManager.removeEventListener(PusherEventType.AgentStopped, onAgentStoppedEvent);
      pusherManager.removeEventListener(PusherEventType.InChatUpdates, onInChatUpdatesEvent);
    };
  }, []);

  // Send a message through Pusher
  const sendMessage = useCallback(async (
    message: string, 
    type: 'regular' | 'intervention' = 'regular'
  ) => {
    if (!isProcessing) {
      setIsProcessing(true);
    }
    
    console.log('Sending message to Pusher:', message, type, 'conversationId:', conversationId);
    
    // Send message to backend with conversationId
    const taskResponse = await pusherManager.sendMessage(
      message, 
      type,
      conversationId // This is optional in the updated API
    );
    
    console.log('Task response:', taskResponse);
    setTaskUuid(taskResponse.task_uuid);
    return taskResponse;
  }, [isProcessing, conversationId]);

  // Stop the agent
  const stopAgent = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`${API_URL}/api/agent/stop/${sessionId}`, {
        method: 'POST',
      });
      
      await response.json();
      
      setIsProcessing(false);
      setIsTaskActive(false);
      
    } catch (error) {
      console.error('Error stopping agent:', error);
    }
  }, [sessionId]);

  return {
    sessionId,
    isProcessing,
    isTaskActive,
    isThinking,
    taskUuid,
    setIsProcessing,
    setIsTaskActive,
    setIsThinking,
    connectToPusher,
    registerEventHandlers,
    sendMessage,
    stopAgent
  };
}; 