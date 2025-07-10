"use client"

import { useEffect, useState, useCallback, memo } from 'react';
import { useLiveAPIContext } from "@/contexts/LiveAPIContext"
import { LiveServerToolCall, LiveServerToolCallCancellation } from '@google/genai';
import { API_URL } from '@/config/api';
import { useSendMessageCostarMinimal } from '@/hooks/use-gemini-api';

interface UnifiedToolHandlerProps {
  conversationId: string | null
  taskUuid?: string | null
  sessionId: string | null
}

const UnifiedToolHandler = ({ conversationId, taskUuid, sessionId }: UnifiedToolHandlerProps) => {
  const { client } = useLiveAPIContext();
  const { sendMessage } = useSendMessageCostarMinimal();

  // console.log("[UNIFIED TOOL HANDLER] RENDERED")

  // Example handler for super_agent function
  const handleSuperAgent = useCallback(async (args: any) => {
    // Args is already an object, no need to parse
    const { action, prompt } = args;
    console.log('Action:', action);
    switch(action) {
      case 'start':
        console.log('Triggering message flow for super_agent start action');
        console.log('Session ID:', sessionId);
        console.log('Conversation ID:', conversationId);
        if(sessionId && conversationId) {
          const response = await sendMessage({
            message: prompt,
            messageType: 'regular',
            sessionId: sessionId,
            conversationId: conversationId
          });
          console.log('Response:', response);
          return response;
        }else{
          return "Can't start task facing some technical issues. Please try again later."
          }
      
      case 'intervention':
        console.log('Triggering intervention for super_agent');
        console.log('Session ID:', sessionId);
        console.log('Conversation ID:', conversationId);
        console.log('Task UUID:', taskUuid);
        if(sessionId && conversationId) {
          if(!taskUuid) {
            return "There is no task running. Please start a task first."
          }
          const response = await sendMessage({
            message: prompt,
            messageType: 'intervention',
            sessionId: sessionId,
            conversationId: conversationId
          });
          console.log('Intervention response:', response);
          return response;
        }else{
          return "Can't send intervention facing some technical issues. Please try again later."
        }

      case 'status':
        try {
          console.log('Fetching task status');
          console.log('Task UUID:', taskUuid);
          if(!(taskUuid)) {
            return "There is no task running. Please start a task first."
          }
          // Fetch task status from API using taskUuid if available
          console.log(`Fetching status for task: ${taskUuid}`);
          const response = await fetch(`${API_URL}/api/task/status/${taskUuid}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch task status');
          }
          
          const statusData = await response.json();
          return statusData?.summary || "No summary available";
        } catch (error) {
          console.error('Error fetching task status:', error);
          return "Can't fetch task status facing some technical issues. Please try again later."
        }
      
      case 'stop':
        if(!(taskUuid)) {
          return "There is no task running. Please start a task first."
        }
        // Stop a task
        console.log('Triggering agent stopped event handler for super_agent stop action');
        try {
          console.log('Stopping agent with session ID:', sessionId);
          if (!sessionId) {
            return "Can't stop agent facing some technical issues. Please try again later."
          }
          
          const response = await fetch(`${API_URL}/api/agent/stop/${sessionId}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to stop agent');
          }
          
          const data = await response.json();
          console.log('Agent stopped successfully:', data);
          
          return "Task stopped successfully"
        } catch (error) {
          console.error('Error stopping agent:', error);
          return "Can't stop agent facing some technical issues. Please try again later."
        }

      case 'send_user_answer':
        console.log('Sending user answer to super_agent');
        console.log('Session ID:', sessionId);
        console.log('Conversation ID:', conversationId);
        console.log('Task UUID:', taskUuid);
        console.log('User answer:', args.answer);
        
        if(sessionId && conversationId) {
          if(!taskUuid) {
            return "There is no task running. Please start a task first."
          }
          const response = await sendMessage({
            message: args.answer,
            messageType: 'regular',
            sessionId: sessionId,
            conversationId: conversationId,
            taskUuid: taskUuid
          });
          console.log('User answer response:', response);
          
          // Fire event to reset waiting state in unified agent
          window.dispatchEvent(new CustomEvent('user-answer-sent'));
          
          return response;
        } else {
          return "Can't send user answer facing some technical issues. Please try again later."
        }
        
      default:
        return "Unknown action"
    }
  }, [taskUuid, sessionId, conversationId, sendMessage]);

  // Process function calls received from the tool call
  const processFunctionCalls = useCallback((toolCall: LiveServerToolCall) => {
    if (!client) return;
    
    // Handle the case where functionCalls might be undefined
    if (!toolCall.functionCalls) {
      console.log('No function calls in tool call');
      return;
    }
    
    toolCall.functionCalls.forEach(async (functionCall) => {
      const { name, args, id } = functionCall;
      
      try {
        let result;
        
        // Handle different function calls based on their name
        switch(name) {
          case 'super_agent':
            // Example handling for super_agent
            result = await handleSuperAgent(args);
            break;
          // Add more cases for other function types as needed
          default:
            result = { error: `Function ${name} not implemented` };
        }
        
        // Send the response back to the client
        client.sendToolResponse({
          functionResponses: [
            {
              response: { result: JSON.stringify(result) },
              id: id,
            }
          ]
        });
        
      } catch (error) {
        console.error(`Error processing function call ${name}:`, error);
        
        // Send error response
        client.sendToolResponse({
          functionResponses: [
            {
              response: { error: `Error processing ${name}: ${error}` },
              id: functionCall.id,
            }
          ]
        });
      }
    });
  }, [client, handleSuperAgent]);

  useEffect(() => {
    if (!client) {
      console.log('UnifiedToolHandler: Client is null, cannot register event listeners');
      return;
    }
    
    console.log('UnifiedToolHandler: Client is available, registering event listeners');
    
    // Function to handle incoming tool calls
    const handleToolCall = (toolCall: LiveServerToolCall) => {
      console.log('UnifiedToolHandler: Tool call received in handleToolCall:', toolCall);
      console.log('UnifiedToolHandler: Current taskUuid in handler:', taskUuid);
      // Process the tool call
      processFunctionCalls(toolCall);
    };

    // Function to handle tool call cancellations
    const handleToolCallCancellation = (cancellation: LiveServerToolCallCancellation) => {
      console.log('UnifiedToolHandler: Tool call cancelled:', cancellation);
      // Handle the case where ids might be undefined
      if (cancellation.ids) {
        console.log('UnifiedToolHandler: Cancelled IDs:', cancellation.ids);
      }
    };

    // Register listeners
    console.log('UnifiedToolHandler: Registering toolcall event listener');
    client.on('toolcall', handleToolCall);
    client.on('toolcallcancellation', handleToolCallCancellation);

    console.log('UnifiedToolHandler: Tool handler mounted with:', {
      taskUuid,
      sessionId,
      conversationId
    });
    
    // Clean up listeners on unmount
    return () => {
      console.log('UnifiedToolHandler: Cleaning up event listeners');
      client.off('toolcall', handleToolCall);
      client.off('toolcallcancellation', handleToolCallCancellation);
    };
  }, [client, taskUuid, processFunctionCalls]);

  // Track component lifecycle
  useEffect(() => {
    console.log('ToolHandlerComponent: Component mounted');
    return () => {
      console.log('ToolHandlerComponent: Component unmounting');
    };
  }, []);

  return null;
}

// Use React.memo with custom comparison to see what's changing
UnifiedToolHandler.displayName = 'UnifiedToolHandler';

export default memo(UnifiedToolHandler, (prevProps, nextProps) => {
  const conversationIdSame = prevProps.conversationId === nextProps.conversationId;
  const taskUuidSame = prevProps.taskUuid === nextProps.taskUuid;
  const sessionIdSame = prevProps.sessionId === nextProps.sessionId;
  
  const areEqual = conversationIdSame && taskUuidSame && sessionIdSame;
  
  if (!areEqual) {
    console.log("[UNIFIED TOOL HANDLER] MEMO: Props changed, allowing re-render", {
      conversationIdSame,
      taskUuidSame,
      sessionIdSame,
    });
  } else {
    console.log("[UNIFIED TOOL HANDLER] MEMO: Props same, SKIPPING re-render");
  }
  
  // Return true if props are equal (skip render)
  // Return false if props are different (allow render)
  return areEqual;
}); 