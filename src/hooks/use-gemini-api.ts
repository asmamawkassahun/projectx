import { useState, useEffect, useCallback, useRef } from 'react'
import { useJWTAuthContext } from '../config/Auth'

// API endpoint for sending messages
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Types
type SendMessageParams = {
  message: string
  conversation_uuid: string  // Now required
  task_uuid?: string | null
  session_id?: string | null
  is_clarification?: boolean | null
}

type ConversationResponse = {
  events: Array<{
    role: 'user' | 'model'
    content: string
    timestamp?: string
  }>
}

type SendMessageResponse = {
  conversation_uuid: string
  message_id: string
}

type CreateConversationParams = {
  title: string
}

type ConversationData = {
  uuid: string
  title: string
  status: string
  created_at: string
  updated_at: string
}

// Types for add_transcript endpoint
type AddTranscriptParams = {
  conversation_uuid: string
  role: 'user' | 'model'
  transcript: string
  audio_data?: string
  timestamp?: string
}

type AddTranscriptResponse = {
  status: string
  conversation_uuid: string
  message: string
}

/**
 * Hook to create a new conversation
 */
export const useCreateConversation = () => {
  const { apiClient } = useJWTAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createConversation = useCallback(async (title: string): Promise<ConversationData | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient().post<ConversationData>(
        '/api/chat/conversations',
        { title }
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create conversation'))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiClient])

  return {
    createConversation,
    isLoading,
    error
  }
}

/**
 * Hook to fetch a conversation history by ID
 */
export const useConversationHistory = () => {
  const { apiClient } = useJWTAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<ConversationResponse | null>(null)

  const fetchConversation = useCallback(async (conversationId: string) => {
    if (!conversationId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient().get<ConversationResponse>(
        `/api/chat/conversations/${conversationId}`
      )
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversation'))
    } finally {
      setIsLoading(false)
    }
  }, [apiClient])

  return {
    data,
    isLoading,
    error,
    fetchConversation
  }
}

/**
 * Hook to send a message to Gemini
 */
export const useSendMessage = () => {
  const { apiClient } = useJWTAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(async (params: SendMessageParams): Promise<SendMessageResponse | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient().post<SendMessageResponse>(
        '/api/chat/send_message',
        params
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiClient])

  return {
    sendMessage,
    isLoading,
    error
  }
}

/**
 * Minimal hook to add audio transcript - no loading/error states to prevent re-renders
 */
export const useAddTranscriptMinimal = () => {
  const { apiClient } = useJWTAuthContext()

  // Use ref to store the latest apiClient function to avoid dependency issues
  const apiClientRef = useRef(apiClient)
  useEffect(() => {
    apiClientRef.current = apiClient
  }, [apiClient])

  const addTranscript = useCallback(async (params: AddTranscriptParams): Promise<AddTranscriptResponse | null> => {
    try {
      const response = await apiClientRef.current().post<AddTranscriptResponse>(
        '/api/chat/add_transcript',
        params
      )
      return response.data
    } catch (err) {
      console.error('Failed to add transcript:', err)
      return null
    }
  }, []) // Empty dependency array - stable function reference

  return { addTranscript }
}

/**
 * Hook to fetch conversation history in a format ready for the LLM
 */
export const useConversationLLMHistory = () => {
  const { apiClient } = useJWTAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchHistory = useCallback(async (conversationId: string): Promise<any | null> => {
    if (!conversationId) return null
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient().get<any>(
        `/api/chat/conversations/${conversationId}/history`
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversation history'))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [apiClient])

  return {
    fetchHistory,
    isLoading,
    error
  }
}

/**
 * Minimal hook to send a message via API directly - no loading/error states to prevent re-renders
 */
export const useSendMessageCostarMinimal = () => {
  const { apiClient } = useJWTAuthContext()

  // Use ref to store the latest apiClient function to avoid dependency issues
  const apiClientRef = useRef(apiClient)
  useEffect(() => {
    apiClientRef.current = apiClient
  }, [apiClient])

  const sendMessage = useCallback(async (params: {
    message: string,
    messageType?: 'regular' | 'intervention',
    sessionId: string,
    conversationId?: string | null,
    taskUuid?: string | null,
  }): Promise<any> => {
    try {
      const requestBody: any = {
        session_id: params.sessionId,
        message: params.message,
        message_type: params.messageType || 'regular'
      };

      // Include conversationId in the request if provided
      if (params.conversationId) {
        requestBody.conversation_id = params.conversationId;
      }

      // Include taskUuid in the request if provided
      if (params.taskUuid) {
        requestBody.task_uuid = params.taskUuid;
      }
      
      const response = await apiClientRef.current().post('/api/message/send', requestBody);
      return response.data;
    } catch (err) {
      console.error('Failed to send streaming message:', err);
      return null;
    }
  }, []);

  return { sendMessage }
}

/**
 * Minimal hook to send voice search data - no loading/error states to prevent re-renders
 */
export const useVoiceSearchEnhancerMinimal = () => {
  const { apiClient } = useJWTAuthContext()

  // Use ref to store the latest apiClient function to avoid dependency issues
  const apiClientRef = useRef(apiClient)
  useEffect(() => {
    apiClientRef.current = apiClient
  }, [apiClient])

  const sendSearchData = useCallback(async (params: {
    conversation_id: string,
    recent_conversation: string,
    search_data: string,
    session_id?: string,
    location?: {
      latitude: number,
      longitude: number,
      accuracy?: number,
      timestamp?: number
    } | null
  }): Promise<any> => {
    try {
      const response = await apiClientRef.current().post('/api/chat/voice_search_enhancer', params);
      return response.data;
    } catch (err) {
      console.error('Failed to send voice search data:', err);
      return null;
    }
  }, []);

  return { sendSearchData }
}