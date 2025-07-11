import React, { useCallback, useEffect, useRef } from "react";
import VoiceModeManager from "./voice-mode-manager";
import { useAddTranscriptMinimal } from "@/hooks/use-gemini-api";

// VoiceModeControl props type definition
interface VoiceModeControlProps {
  conversationId?: string;
  onTranscriptReceived: (role: "user" | "model", text: string, timestamp: Date) => void;
  onVoiceModeChange?: (isActive: boolean) => void;
  autoStart?: boolean;
}

// Create a separate component to prevent re-renders from parent component
const VoiceModeControl = ({
  conversationId,
  onTranscriptReceived,
  onVoiceModeChange,
  autoStart,
}: VoiceModeControlProps) => {
  // console.log("[VOICE MODE CONTROL] RENDERED", {
  //   conversationId,
  //   onTranscriptReceived: onTranscriptReceived.toString().slice(0, 50) + '...',
  //   onVoiceModeChange: onVoiceModeChange?.toString().slice(0, 50) + '...',
  //   autoStart,
  //   onTranscriptReceivedRef: onTranscriptReceived,
  //   onVoiceModeChangeRef: onVoiceModeChange
  // })

  const { addTranscript } = useAddTranscriptMinimal();

  // Create a self-contained audio data handler
  const handleAudioData = useCallback(
    async (data: any) => {
      try {
        // console.log('Voice mode audio data received:', data);

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
  ); // addTranscript is now stable

  return (
    <VoiceModeManager
      conversationId={conversationId}
      onAudioData={handleAudioData}
      onVoiceModeChange={onVoiceModeChange}
      autoStart={autoStart}
    />
  );
};

// Use React.memo with custom comparison to see what's changing
VoiceModeControl.displayName = "VoiceModeControl";

export default React.memo(VoiceModeControl, (prevProps, nextProps) => {
  const conversationIdSame = prevProps.conversationId === nextProps.conversationId;
  const onTranscriptReceivedSame =
    prevProps.onTranscriptReceived === nextProps.onTranscriptReceived;
  const onVoiceModeChangeSame = prevProps.onVoiceModeChange === nextProps.onVoiceModeChange;
  const autoStartSame = prevProps.autoStart === nextProps.autoStart;

  const areEqual =
    conversationIdSame && onTranscriptReceivedSame && onVoiceModeChangeSame && autoStartSame;

  if (!areEqual) {
    console.log("[VOICE MODE CONTROL] MEMO: Props changed, allowing re-render", {
      conversationIdSame,
      onTranscriptReceivedSame,
      onVoiceModeChangeSame,
      autoStartSame,
    });
  } else {
    console.log("[VOICE MODE CONTROL] MEMO: Props same, SKIPPING re-render");
  }

  // Return true if props are equal (skip render)
  // Return false if props are different (allow render)
  return areEqual;
});
