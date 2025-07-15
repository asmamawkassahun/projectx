"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import {
  LiveServerToolCall,
  LiveServerToolCallCancellation,
} from "@google/genai";
import { API_URL } from "@/config/api";
import { useSendMessageCostarMinimal } from "@/hooks/use-gemini-api";
import { useConversationStore } from "@/stores/conversation-store";
import { useJWTAuthContext } from "@/config/Auth";

interface UnifiedToolHandlerProps {
  taskUuid?: string | null;
  sessionId: string | null;
}

const UnifiedToolHandler = ({
  taskUuid,
  sessionId,
}: UnifiedToolHandlerProps) => {
  const { client } = useLiveAPIContext();
  const { conversationId } = useConversationStore();

  const { sendMessage } = useSendMessageCostarMinimal();
  const { user } = useJWTAuthContext();

  // Check if a function should generate dynamic UI (similar to Android version)
  const shouldGenerateUI = useCallback((functionName: string) => {
    switch (functionName) {
      case "list_emails":
      case "summarize_emails":
      case "write_draft_for_new_email":
      case "write_draft_for_reply":
      case "list_events":
      case "check_availability":
      case "find_contact":
        return true;
      case "send_email":
      case "coordinate_meeting":
      case "create_event":
      case "update_event":
      case "delete_event":
        // These are action-based functions that might not need UI generation
        // You can enable them if needed
        return false;
      default:
        return false;
    }
  }, []);

  // Get access token from JWT auth context (similar to Android AsyncStorage)
  const getAccessToken = useCallback(() => {
    try {
      // Use user from JWT auth context which should include googleAccessToken
      if (!user) {
        console.log("No user found in JWT auth context");
        return null;
      }

      const googleAccessToken = (user as any).googleAccessToken;

      if (googleAccessToken && googleAccessToken !== "null") {
        console.log(
          "Google access token retrieved from auth context:",
          googleAccessToken.substring(0, 20) + "..."
        );
        return googleAccessToken;
      } else {
        console.error("Google access token not found in user context");
        return null;
      }
    } catch (error) {
      console.error(
        "Error getting Google access token from auth context:",
        error
      );
      return null;
    }
  }, [user]);

  // Make HTTP request to API endpoint (similar to Android makeHttpRequest)
  const makeHttpRequest = useCallback(
    async (
      endpoint: string,
      requestBody: any,
      toolCallId: string,
      functionName: string
    ) => {
      try {
        const baseUrl = "https://email-agent-backend-staging.onrender.com";
        const fullUrl = baseUrl + endpoint;

        console.log("🚀 ===== HTTP REQUEST DETAILS =====");
        console.log("🚀 Function:", functionName);
        console.log("🚀 Method: POST");
        console.log("🚀 URL:", fullUrl);
        console.log("🚀 Request Body:", requestBody);
        console.log("🚀 ===================================");

        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "CostarWebApp/1.0",
          },
          body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();

        console.log("📥 ===== HTTP RESPONSE DETAILS =====");
        console.log("📥 Function:", functionName);
        console.log("📥 Status Code:", response.status);
        console.log("📥 Status Message:", response.statusText);
        console.log("📥 Response Body:", responseText);
        console.log("📥 Success:", response.ok);
        console.log("📥 ==================================");

        if (!response.ok) {
          const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          const finalError = responseText
            ? `${errorMessage} - ${responseText}`
            : errorMessage;
          return { success: false, error: finalError };
        } else {
          return { success: true, data: responseText };
        }
      } catch (error) {
        console.error("❌ Error making HTTP request:", error);
        return {
          success: false,
          error: `Network request failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
    []
  );

  // Handle email-related tool calls with real API integration
  const handleEmailTool = useCallback(
    async (toolName: string, args: any, toolCallId: string) => {
      try {
        console.log(`Processing email tool: ${toolName}`, args);

        // Get access token
        const accessToken = getAccessToken();
        if (!accessToken) {
          return {
            error:
              "Authentication required. Please sign in with Google to use email features.",
          };
        }

        // Create request body with operation and args
        const requestBody = {
          operation: toolName,
          accessToken: accessToken,
          ...args, // Spread all arguments
        };

        // Make HTTP request to email API
        const result = await makeHttpRequest(
          "/emails/manage",
          requestBody,
          toolCallId,
          toolName
        );

        if (result.success) {
          // Parse the response data to filter out raw_emails field (only for list_emails)
          let responseData = result.data;
          if (typeof responseData === "string") {
            try {
              responseData = JSON.parse(responseData);
            } catch (e) {
              // If parsing fails, keep as string
            }
          }

          // Filter out raw_emails field only for list_emails operation
          if (
            toolName === "list_emails" &&
            responseData &&
            typeof responseData === "object" &&
            responseData !== null
          ) {
            const filteredData: any = JSON.parse(JSON.stringify(responseData)); // Deep clone to avoid mutation

            // Remove raw_emails field at the top level
            if ("raw_emails" in filteredData) {
              delete filteredData.raw_emails;
              console.log(
                "🧹 Filtered out raw_emails field from list_emails API response"
              );
            }

            // If there's an emails array, filter raw_emails from each email object
            if (filteredData.emails && Array.isArray(filteredData.emails)) {
              filteredData.emails = filteredData.emails.map((email: any) => {
                if (email && typeof email === "object" && email !== null) {
                  const filteredEmail: any = { ...email };
                  if ("raw_emails" in filteredEmail) {
                    delete filteredEmail.raw_emails;
                  }
                  return filteredEmail;
                }
                return email;
              });
            }

            return { success: true, data: filteredData };
          }

          return { success: true, data: result.data };
        } else {
          return { error: result.error };
        }
      } catch (error) {
        console.error("Error processing email tool:", error);
        return {
          error: `Email tool error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
    [getAccessToken, makeHttpRequest]
  );

  // Handle calendar-related tool calls with real API integration
  const handleCalendarTool = useCallback(
    async (toolName: string, args: any, toolCallId: string) => {
      try {
        console.log(`Processing calendar tool: ${toolName}`, args);

        // Get access token
        const accessToken = getAccessToken();
        if (!accessToken) {
          return {
            error:
              "Authentication required. Please sign in with Google to use calendar features.",
          };
        }

        // Create request body with operation and args
        const requestBody = {
          operation: toolName,
          accessToken: accessToken,
          ...args, // Spread all arguments
        };

        // Make HTTP request to calendar API
        const result = await makeHttpRequest(
          "/calendar/manage",
          requestBody,
          toolCallId,
          toolName
        );

        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { error: result.error };
        }
      } catch (error) {
        console.error("Error processing calendar tool:", error);
        return {
          error: `Calendar tool error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
    [getAccessToken, makeHttpRequest]
  );

  // Handle contact-related tool calls with real API integration
  const handleContactTool = useCallback(
    async (toolName: string, args: any, toolCallId: string) => {
      try {
        console.log(`Processing contact tool: ${toolName}`, args);

        // Get access token
        const accessToken = getAccessToken();
        if (!accessToken) {
          return {
            error:
              "Authentication required. Please sign in with Google to use contact features.",
          };
        }

        // Create request body with operation and args
        const requestBody = {
          operation: toolName,
          accessToken: accessToken,
          ...args, // Spread all arguments
        };

        // Make HTTP request to contacts API
        const result = await makeHttpRequest(
          "/contacts/manage",
          requestBody,
          toolCallId,
          toolName
        );

        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { error: result.error };
        }
      } catch (error) {
        console.error("Error processing contact tool:", error);
        return {
          error: `Contact tool error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
    [getAccessToken, makeHttpRequest]
  );

  // Example handler for super_agent function
  const handleSuperAgent = useCallback(
    async (args: any) => {
      // Args is already an object, no need to parse
      const { action, prompt } = args;
      console.log("Action:", action);
      switch (action) {
        case "start":
          console.log("Triggering message flow for super_agent start action");
          console.log("Session ID:", sessionId);
          console.log("Conversation ID:", conversationId);
          if (sessionId && conversationId) {
            const response = await sendMessage({
              message: prompt,
              messageType: "regular",
              sessionId: sessionId,
              conversationId: conversationId,
            });
            console.log("Response:", response);
            return response;
          } else {
            return "Can't start task facing some technical issues. Please try again later.";
          }

        case "intervention":
          console.log("Triggering intervention for super_agent");
          console.log("Session ID:", sessionId);
          console.log("Conversation ID:", conversationId);
          console.log("Task UUID:", taskUuid);
          if (sessionId && conversationId) {
            if (!taskUuid) {
              return "There is no task running. Please start a task first.";
            }
            const response = await sendMessage({
              message: prompt,
              messageType: "intervention",
              sessionId: sessionId,
              conversationId: conversationId,
            });
            console.log("Intervention response:", response);
            return response;
          } else {
            return "Can't send intervention facing some technical issues. Please try again later.";
          }

        case "status":
          try {
            console.log("Fetching task status");
            console.log("Task UUID:", taskUuid);
            if (!taskUuid) {
              return "There is no task running. Please start a task first.";
            }
            // Fetch task status from API using taskUuid if available
            console.log(`Fetching status for task: ${taskUuid}`);
            const response = await fetch(
              `${API_URL}/api/task/status/${taskUuid}`
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.detail || "Failed to fetch task status"
              );
            }

            const statusData = await response.json();
            return statusData?.summary || "No summary available";
          } catch (error) {
            console.error("Error fetching task status:", error);
            return "Can't fetch task status facing some technical issues. Please try again later.";
          }

        case "stop":
          try {
            console.log("Stopping super_agent task");
            console.log("Task UUID:", taskUuid);
            if (!taskUuid) {
              return "There is no task running. Please start a task first.";
            }
            const response = await fetch(
              `${API_URL}/api/task/stop/${taskUuid}`,
              {
                method: "POST",
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || "Failed to stop task");
            }

            const stopData = await response.json();
            console.log("Stop response:", stopData);
            return stopData?.message || "Task stopped successfully";
          } catch (error) {
            console.error("Error stopping task:", error);
            return "Can't stop task facing some technical issues. Please try again later.";
          }

        case "send_user_answer":
          console.log("Sending user answer to super_agent");
          console.log("Session ID:", sessionId);
          console.log("Conversation ID:", conversationId);
          console.log("Task UUID:", taskUuid);
          console.log("User answer:", args.answer);

          if (sessionId && conversationId) {
            if (!taskUuid) {
              return "There is no task running. Please start a task first.";
            }
            const response = await sendMessage({
              message: args.answer,
              messageType: "regular",
              sessionId: sessionId,
              conversationId: conversationId,
              taskUuid: taskUuid,
            });
            console.log("User answer response:", response);

            // Fire event to reset waiting state in unified agent
            window.dispatchEvent(new CustomEvent("user-answer-sent"));

            return response;
          } else {
            return "Can't send user answer facing some technical issues. Please try again later.";
          }

        default:
          return "Unknown action";
      }
    },
    [taskUuid, sessionId, conversationId, sendMessage]
  );

  // Process function calls received from the tool call
  const processFunctionCalls = useCallback(
    (toolCall: LiveServerToolCall) => {
      if (!client) return;

      // Handle the case where functionCalls might be undefined
      if (!toolCall.functionCalls) {
        console.log("No function calls in tool call");
        return;
      }

      toolCall.functionCalls.forEach(async (functionCall) => {
        const { name, args, id } = functionCall;

        try {
          let result;

          // Handle different function calls based on their name
          switch (name) {
            case "super_agent":
              // Example handling for super_agent
              result = await handleSuperAgent(args);
              break;

            // Email tools
            case "list_emails":
            case "summarize_emails":
            case "write_draft_for_new_email":
            case "write_draft_for_reply":
            case "send_email":
            case "coordinate_meeting":
              result = await handleEmailTool(name, args, id || "unknown");
              break;

            // Calendar tools
            case "list_events":
            case "check_availability":
            case "create_event":
            case "update_event":
            case "delete_event":
              result = await handleCalendarTool(name, args, id || "unknown");
              break;

            // Contact tools
            case "find_contact":
              result = await handleContactTool(name, args, id || "unknown");
              break;

            // Add more cases for other function types as needed
            default:
              result = { error: `Function ${name} not implemented` };
          }

          // Send the response back to the client
          client.sendToolResponse({
            functionResponses: [
              {
                response: {
                  output: JSON.stringify(result),
                },
                id: id || "unknown",
                name: name,
              },
            ],
          });

          // Trigger UI generation for supported tools (similar to Android parallel UI generation)
          if (result.success && name && shouldGenerateUI(name)) {
            console.log("🎨 Triggering UI generation for function:", name);
            try {
              // Parse the API response data for UI generation
              const apiResponseData =
                typeof result.data === "string"
                  ? JSON.parse(result.data)
                  : result.data;

              // Emit custom event for UI Overlay to handle
              const uiDataEvent = new CustomEvent("tool-response-ui-data", {
                detail: {
                  toolName: name,
                  args: args,
                  id: id || "unknown",
                  apiData: apiResponseData,
                },
              });
              window.dispatchEvent(uiDataEvent);

              console.log("🎨 UI data event dispatched for:", name);
            } catch (error) {
              console.error(
                "❌ Error preparing API response for UI generation - UI generation skipped",
                error
              );
            }
          }
        } catch (error) {
          console.error(`Error processing function call ${name}:`, error);

          // Send error response
          client.sendToolResponse({
            functionResponses: [
              {
                response: { error: `Error processing ${name}: ${error}` },
                id: functionCall.id,
              },
            ],
          });
        }
      });
    },
    [
      client,
      handleSuperAgent,
      handleEmailTool,
      handleCalendarTool,
      handleContactTool,
      shouldGenerateUI,
    ]
  );

  useEffect(() => {
    if (!client) {
      console.log(
        "UnifiedToolHandler: Client is null, cannot register event listeners"
      );
      return;
    }

    console.log(
      "UnifiedToolHandler: Client is available, registering event listeners"
    );

    // Function to handle incoming tool calls
    const handleToolCall = (toolCall: LiveServerToolCall) => {
      console.log(
        "UnifiedToolHandler: Tool call received in handleToolCall:",
        toolCall
      );
      console.log("UnifiedToolHandler: Current taskUuid in handler:", taskUuid);
      // Process the tool call
      processFunctionCalls(toolCall);
    };

    // Function to handle tool call cancellations
    const handleToolCallCancellation = (
      cancellation: LiveServerToolCallCancellation
    ) => {
      console.log("UnifiedToolHandler: Tool call cancelled:", cancellation);
      // Handle the case where ids might be undefined
      if (cancellation.ids) {
        console.log("UnifiedToolHandler: Cancelled IDs:", cancellation.ids);
      }
    };

    // Register listeners
    console.log("UnifiedToolHandler: Registering toolcall event listener");
    client.on("toolcall", handleToolCall);
    client.on("toolcallcancellation", handleToolCallCancellation);

    console.log("UnifiedToolHandler: Tool handler mounted with:", {
      taskUuid,
      sessionId,
      conversationId,
    });

    // Clean up listeners on unmount
    return () => {
      console.log("UnifiedToolHandler: Cleaning up event listeners");
      client.off("toolcall", handleToolCall);
      client.off("toolcallcancellation", handleToolCallCancellation);
    };
  }, [client, taskUuid, processFunctionCalls]);

  // Track component lifecycle
  useEffect(() => {
    console.log("ToolHandlerComponent: Component mounted");
    return () => {
      console.log("ToolHandlerComponent: Component unmounting");
    };
  }, []);

  return null;
};

// Use React.memo with custom comparison to see what's changing
UnifiedToolHandler.displayName = "UnifiedToolHandler";

export default memo(UnifiedToolHandler, (prevProps, nextProps) => {
  const taskUuidSame = prevProps.taskUuid === nextProps.taskUuid;
  const sessionIdSame = prevProps.sessionId === nextProps.sessionId;

  const areEqual = taskUuidSame && sessionIdSame;

  if (!areEqual) {
    console.log(
      "[UNIFIED TOOL HANDLER] MEMO: Props changed, allowing re-render",
      {
        taskUuidSame,
        sessionIdSame,
      }
    );
  } else {
    console.log("[UNIFIED TOOL HANDLER] MEMO: Props same, SKIPPING re-render");
  }

  // Return true if props are equal (skip render)
  // Return false if props are different (allow render)
  return areEqual;
});
