import { useCallback } from "react";
import { useAddTranscriptMinimal } from "@/hooks/use-gemini-api";

interface UseVoiceModeControlProps {
  conversationId?: string;
  onTranscriptReceived: (role: "user" | "model", text: string, timestamp: Date) => void;
}

export function useVoiceModeControl({
  conversationId,
  onTranscriptReceived,
}: UseVoiceModeControlProps) {
  const { addTranscript } = useAddTranscriptMinimal();

  // Create a self-contained audio data handler
  const handleAudioData = useCallback(
    async (data: any) => {
      try {
        if (data.transcript && data.transcript.trim() && conversationId) {
          // Clean the transcript by trimming and removing noise tags
          const cleanedTranscript = data.transcript
            .trim()
            .replace(/<noise>.*?(<\/noise>|$)/g, "")
            .trim();

          // Only proceed if we have a meaningful transcript after cleaning
          if (cleanedTranscript) {
            // Call the API to store the transcript and audio
            addTranscript({
              conversation_uuid: conversationId,
              role: data.role,
              transcript: cleanedTranscript,
              audio_data: data.audio_data,
              timestamp: data.timestamp,
            });

            // Call the callback with the processed data for UI updates
            onTranscriptReceived(
              data.role,
              cleanedTranscript,
              new Date(data.timestamp || new Date())
            );
          }
        }
      } catch (error) {
        console.error("Error handling audio data:", error);
      }
    },
    [conversationId, onTranscriptReceived, addTranscript]
  );

  return { handleAudioData };
}
