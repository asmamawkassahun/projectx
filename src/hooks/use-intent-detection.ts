import { useState, useEffect, useCallback, useRef } from 'react'
import { useJWTAuthContext } from '../config/Auth'

// Simplified intent interface
export interface Intent {
  type: string
  feedback: string
  icon: string
  confidence: number
}

interface IntentDetectionResponse {
  intent: string
  confidence: number
  feedback: string
  icon: string
}

// Simple greeting patterns to filter out
const GREETING_PATTERNS = [
  /^\s*(hi|hello|hey|yo|hiya|howdy)\s*$/i,
  /^\s*(good\s+(morning|afternoon|evening|night))\s*$/i,
  /^\s*(how\s+are\s+you|how\s+are\s+things|what's\s+up|whats\s+up)\s*[?!]*\s*$/i,
  /^\s*(thanks|thank\s+you|thx|ty)\s*[!]*\s*$/i,
  /^\s*(bye|goodbye|see\s+ya|cya|later)\s*[!]*\s*$/i,
  /^\s*(ok|okay|alright|cool|nice)\s*[!]*\s*$/i
]

// Check if message is just a greeting
const isGreeting = (text: string): boolean => {
  const trimmed = text.trim()
  if (trimmed.length < 2 || trimmed.length > 30) return false
  
  return GREETING_PATTERNS.some(pattern => pattern.test(trimmed))
}

// Helper: Only trigger intent detection on word boundaries
const shouldTriggerIntent = (text: string, prevText: string): boolean => {
  // Only trigger if text changed and ends with space, punctuation, or Enter
  if (text === prevText) return false
  const lastChar = text.slice(-1)
  return /[\s.,!?;:)]/.test(lastChar)
}

export const useIntentDetection = () => {
  const { apiClient } = useJWTAuthContext()
  const [currentIntent, setCurrentIntent] = useState<Intent | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionHistory, setDetectionHistory] = useState<Intent[]>([])
  
  // Refs for debouncing and caching
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastInputRef = useRef<string>('')
  const cacheRef = useRef<Map<string, IntentDetectionResponse>>(new Map())
  
  // Clear detection timeout
  const clearDetectionTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Intent detection API call
  const detectIntentAPI = useCallback(async (text: string): Promise<IntentDetectionResponse> => {
    // Check cache first
    const cached = cacheRef.current.get(text.toLowerCase().trim())
    if (cached) {
      return cached
    }

    try {
      // Call the intent detection API
      const response = await apiClient().post('/api/intent/detect', {
        text: text,
        session_id: undefined
      })
      
      const result = {
        intent: response.data.intent,
        confidence: response.data.confidence,
        feedback: response.data.feedback,
        icon: response.data.icon
      }
      
      // Cache the result
      cacheRef.current.set(text.toLowerCase().trim(), result)
      
      return result
    } catch (error) {
      console.error('Intent detection API failed:', error)
      
      // Simple fallback if API fails
      return {
        intent: 'general',
        confidence: 0.3,
        feedback: "I'm here to help!",
        icon: "💬"
      }
    }
  }, [apiClient])

  // Detect intent with debouncing
  const detectIntent = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setCurrentIntent(null)
      setIsDetecting(false)
      return
    }

    // Skip greetings - no need for API call
    if (isGreeting(text)) {
      setCurrentIntent(null)
      setIsDetecting(false)
      return
    }

    // Only trigger on word boundary
    if (!shouldTriggerIntent(text, lastInputRef.current)) {
      return
    }

    lastInputRef.current = text

    clearDetectionTimeout()

    timeoutRef.current = setTimeout(async () => {
      setIsDetecting(true)
      try {
        const result = await detectIntentAPI(text)
        if (result.confidence > 0.4) {
          const intent: Intent = {
            type: result.intent,
            feedback: result.feedback,
            icon: result.icon,
            confidence: result.confidence
          }
          setCurrentIntent(intent)
          setDetectionHistory(prev => {
            const newHistory = [intent, ...prev.filter(i => i.type !== intent.type)].slice(0, 5)
            return newHistory
          })
        } else {
          setCurrentIntent(null)
        }
      } catch (error) {
        console.error('Intent detection error:', error)
        setCurrentIntent(null)
      } finally {
        setIsDetecting(false)
      }
    }, 700) // Increased debounce to 700ms
  }, [detectIntentAPI, clearDetectionTimeout])

  // Clear intent
  const clearIntent = useCallback(() => {
    setCurrentIntent(null)
    setIsDetecting(false)
    clearDetectionTimeout()
    lastInputRef.current = ''
  }, [clearDetectionTimeout])

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearDetectionTimeout()
    }
  }, [clearDetectionTimeout])

  return {
    currentIntent,
    isDetecting,
    detectionHistory,
    detectIntent,
    clearIntent,
    clearCache
  }
} 