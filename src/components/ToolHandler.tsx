import React, { useEffect, useState } from 'react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { LiveServerToolCall, LiveServerToolCallCancellation } from '@google/genai';
import { API_URL } from '@/config/api';

/**
 * ToolHandler - Component that listens for toolcall events from the Live API
 * 
 * This component:
 * 1. Accesses the LiveAPI client from context
 * 2. Sets up event listeners for "toolcall" events
 * 3. Processes incoming tool calls
 * 4. Sends tool responses back to the client
 * 5. Triggers message sending for super_agent start action
 */
interface ToolHandlerProps {
  sendMessage?: (message: string) => void;
  handleAgentStopped?: () => void;
  taskUuid?: string | null;
}

const ToolHandler: React.FC<ToolHandlerProps> = ({ sendMessage, handleAgentStopped, taskUuid }) => {
  const { client } = useLiveAPIContext();
  const [currentTaskUuid, setCurrentTaskUuid] = useState<string | null>(null);

  // Effect to update the internal state when taskUuid prop changes
  useEffect(() => {
    if (taskUuid) {
      console.log('ToolHandler received taskUuid update:', taskUuid);
      setCurrentTaskUuid(taskUuid);
    }
  }, [taskUuid]);

  useEffect(() => {
    if (!client) return;
    
    // Function to handle incoming tool calls
    const handleToolCall = (toolCall: LiveServerToolCall) => {
      console.log('Tool call received:', toolCall);
      console.log('Current taskUuid in handler:', currentTaskUuid);
      // Process the tool call
      // You can implement specific handlers for different function calls here
      processFunctionCalls(toolCall);
    };

    // Function to handle tool call cancellations
    const handleToolCallCancellation = (cancellation: LiveServerToolCallCancellation) => {
      console.log('Tool call cancelled:', cancellation);
      // Handle the case where ids might be undefined
      if (cancellation.ids) {
        console.log('Cancelled IDs:', cancellation.ids);
      }
    };

    // Register listeners
    client.on('toolcall', handleToolCall);
    client.on('toolcallcancellation', handleToolCallCancellation);

    // Clean up listeners on unmount
    return () => {
      client.off('toolcall', handleToolCall);
      client.off('toolcallcancellation', handleToolCallCancellation);
    };
  }, [client, currentTaskUuid, sendMessage, handleAgentStopped]);

  // Process function calls received from the tool call
  const processFunctionCalls = (toolCall: LiveServerToolCall) => {
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
  };

  // Example handler for super_agent function
  const handleSuperAgent = async (args: any) => {
    // Args is already an object, no need to parse
    const { action, prompt } = args;
    console.log('Action:', action);
    switch(action) {
      case 'start':
        console.log('Triggering message flow for super_agent start action');
        if (sendMessage) {
          sendMessage(prompt);
        }
        return { 
          status: 'started',
          message: 'Task started successfully'
        };
      
      case 'status':
        try {
          console.log('Fetching task status');
          console.log('Task UUID:', currentTaskUuid || taskUuid);
          if(!(currentTaskUuid || taskUuid)) {
            return "There is no task running. Please start a task first."
          }
          // Fetch task status from API using taskUuid if available
          const idToUse = currentTaskUuid || taskUuid;
          console.log(`Fetching status for task: ${idToUse}`);
          const response = await fetch(`${API_URL}/api/task/status/${idToUse}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch task status');
          }
          
          const statusData = await response.json();
          return { 
            status: statusData.status, 
            task_id: idToUse,
            message: statusData.message
          };
        } catch (error) {
          console.error('Error fetching task status:', error);
          return { 
            status: 'error', 
            message: `Error fetching task status: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      
      case 'stop':
        if(!(currentTaskUuid || taskUuid)) {
          return "There is no task running. Please start a task first."
        }
        // Stop a task
        console.log('Triggering agent stopped event handler for super_agent stop action');
        if (handleAgentStopped) {
          await handleAgentStopped();
        }
        return { 
          status: 'stopped', 
          message: 'Task stopped successfully' 
        };
        
      default:
        return { 
          error: `Unknown action: ${action}` 
        };
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default ToolHandler;