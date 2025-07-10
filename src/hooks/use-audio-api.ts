import { useCallback, useState } from 'react';
import { useJWTAuthContext } from '../config/Auth';

type AudioMessageData = {
  conversation_id: string;
  role: 'user' | 'model';
  audio_data: string;
  timestamp: string;
};

type SaveAudioMessageResponse = {
  success: boolean;
  message_id?: string;
};

export const useAudioMessageAPI = (apiEndpoint?: string) => {
  const { apiClient } = useJWTAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Default endpoint to use if none provided
  const audioEndpoint = apiEndpoint || '/api/audio/message/add';

  /**
   * Save an audio message to the API
   */
  const saveAudioMessage = useCallback(async (
    data: AudioMessageData
  ): Promise<SaveAudioMessageResponse | null> => {
    if (!data.conversation_id) {
      console.error('[useAudioAPI] No conversation ID provided');
      return { success: false };
    }
    
    if (!data.audio_data || data.audio_data.length === 0) {
      console.error('[useAudioAPI] No audio data provided');
      return { success: false };
    }
    
    setIsLoading(true);
    setError(null);
    
    const startTime = Date.now();
    console.log(`[useAudioAPI] Saving ${data.role} audio for conversation: ${data.conversation_id}`);
    
    try {
      const response = await apiClient().post<SaveAudioMessageResponse>(
        audioEndpoint,
        data
      );
      
      console.log(`[useAudioAPI] ✅ Saved ${data.role} audio successfully in ${Date.now() - startTime}ms`);
      return {
        success: true,
        message_id: response.data.message_id
      };
    } catch (err) {
      const errorMessage = `Failed to save ${data.role} audio message`;
      console.error(`[useAudioAPI] ❌ ${errorMessage}:`, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, audioEndpoint]);

  return {
    saveAudioMessage,
    isLoading,
    error
  };
}; 