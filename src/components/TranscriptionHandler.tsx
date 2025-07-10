import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { Message } from '@/types';
import clsx from 'clsx';

/**
 * TranscriptionHandler - Component that handles message transcription and display
 * 
 * This component:
 * 1. Manages message state
 * 2. Renders only the messages UI
 * 3. Handles transcription processing and consolidation
 * 4. Doesn't handle overall conversation layout
 */
interface TranscriptionHandlerProps {
}

const TranscriptionHandler: React.FC<TranscriptionHandlerProps> = () => {
  const { client } = useLiveAPIContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Message states
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Transcription processing states
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [pendingAssistantMessage, setPendingAssistantMessage] = useState<string | null>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
  const [userMessageTimer, setUserMessageTimer] = useState<number | null>(null);
  const [assistantMessageTimer, setAssistantMessageTimer] = useState<number | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to add or update a message
  const updateMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages(prev => {
      // Check if there's a recent message from the same role to update
      if (prev.length > 0 && prev[prev.length - 1].role === role) {
        const lastMessage = prev[prev.length - 1];
        const now = new Date();
        const timeDiff = now.getTime() - lastMessage.timestamp.getTime();
        
        // If the last message is recent (within 5 seconds), update it
        if (timeDiff < 5000) {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            content: content,
            timestamp: now
          };
          return newMessages;
        }
      }
      
      // Otherwise add as a new message
      return [...prev, {
        role,
        content,
        timestamp: new Date(),
        inChatUpdates: [],
        type: role === 'user' ? 'regular' : undefined
      }];
    });
  }, []);

  // Process pending user message
  useEffect(() => {
    if (!pendingUserMessage) return;

    // Clear any existing timer
    if (userMessageTimer !== null) {
      window.clearTimeout(userMessageTimer);
    }

    // Create a new timer
    const timerId = window.setTimeout(() => {
      updateMessage('user', pendingUserMessage);
      setPendingUserMessage(null);
    }, 1000); // Consolidate after 1 second of no new input

    setUserMessageTimer(timerId);
    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [pendingUserMessage, updateMessage]);

  // Process pending assistant message
  useEffect(() => {
    if (!pendingAssistantMessage) return;

    // Clear any existing timer
    if (assistantMessageTimer !== null) {
      window.clearTimeout(assistantMessageTimer);
    }

    // Create a new timer
    const timerId = window.setTimeout(() => {
      updateMessage('assistant', pendingAssistantMessage);
      setPendingAssistantMessage(null);
    }, 1000); // Consolidate after 1 second of no new input

    setAssistantMessageTimer(timerId);
    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [pendingAssistantMessage, updateMessage]);

  // Set up event listeners for transcriptions
  useEffect(() => {
    if (!client) return;
    
    // Handle input transcription (user's speech)
    const onInputTranscription = (text: string) => {
      if (!text.trim()) return;
      
      const now = Date.now();
      const isNewSession = now - lastMessageTimestamp > 5000; // 5 second gap defines a new session

      if (isNewSession || !pendingUserMessage) {
        // Start a new message
        setPendingUserMessage(text);
      } else {
        // Append to existing message without adding a space between each letter
        setPendingUserMessage(prev => prev ? prev + text : text);
      }
      
      setLastMessageTimestamp(now);
    };

    // Handle output transcription (AI's speech)
    const onOutputTranscription = (text: string) => {
      if (!text.trim()) return;
      
      const now = Date.now();
      const isNewSession = now - lastMessageTimestamp > 5000; // 5 second gap defines a new session

      if (isNewSession || !pendingAssistantMessage) {
        // Start a new message
        setPendingAssistantMessage(text);
      } else {
        // Append to existing message without adding a space between each letter
        setPendingAssistantMessage(prev => prev ? prev + text : text);
      }
      
      setLastMessageTimestamp(now);
    };

    // Register event listeners
    client.on('inputTranscription', onInputTranscription)
          .on('outputTranscription', onOutputTranscription);

    // Cleanup function
    return () => {
      client.off('inputTranscription', onInputTranscription)
            .off('outputTranscription', onOutputTranscription);
    };
  }, [client, lastMessageTimestamp, pendingUserMessage, pendingAssistantMessage]);

  // Just render the messages, not the entire conversation area
  return (
    <div className="flex-1 flex flex-col space-y-4">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={clsx(
            "px-4 py-3 rounded-lg max-w-[90%]",
            message.role === 'user' 
              ? "bg-blue-600 text-white self-end" 
              : message.role === 'system'
              ? "bg-gray-700 text-gray-200 self-center"
              : "bg-gray-800 text-white self-start"
          )}
        >
          {message.content}
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default TranscriptionHandler; 