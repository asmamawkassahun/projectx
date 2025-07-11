import { useCallback, useEffect, useRef, useState } from "react";
import { useAddTranscriptMinimal } from "@/hooks/use-gemini-api";
import { useVideoManager } from "@/hooks/use-video-manager";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useAudioManager } from "@/hooks/use-audio-manager";
import { useConversationLLMHistory } from "@/hooks/use-gemini-api";
import { toast } from "react-hot-toast";

export function useVoiceModeManager({
  conversationId,
  onTranscriptReceived,
  onVoiceModeChange,
  autoStart,
}: {
  conversationId?: string;
  onTranscriptReceived: (role: "user" | "model", text: string, timestamp: Date) => void;
  onVoiceModeChange?: (isActive: boolean) => void;
  autoStart?: boolean;
}) {
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoStartRef = useRef(autoStart);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobileCheck);
    }
  }, []);

  const { addTranscript } = useAddTranscriptMinimal();

  // Transcript handler
  const handleAudioData = useCallback(
    async (data: any) => {
      if (data.transcript && data.transcript.trim() && conversationId) {
        const cleanedTranscript = data.transcript
          .trim()
          .replace(/<noise>.*?(<\/noise>|$)/g, "")
          .trim();
        if (cleanedTranscript) {
          addTranscript({
            conversation_uuid: conversationId,
            role: data.role,
            transcript: cleanedTranscript,
            audio_data: data.audio_data,
            timestamp: data.timestamp,
          });
          onTranscriptReceived(
            data.role,
            cleanedTranscript,
            new Date(data.timestamp || new Date())
          );
        }
      }
    },
    [conversationId, onTranscriptReceived, addTranscript]
  );

  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const clientRef = useRef(client);
  const { fetchHistory } = useConversationLLMHistory();
  const { inVolume, audioRecorder } = useAudioManager({
    muted,
    conversationId,
    onAudioData: handleAudioData,
  });
  const { videoStreams, activeVideoStream, changeStreams, setupVideoFrameCapture } =
    useVideoManager();
  const [webcam, screenCapture] = videoStreams;

  // Start streaming
  const startStreaming = useCallback(async () => {
    setIsConnecting(true);
    setIsVoiceModeActive(true);
    if (onVoiceModeChange) onVoiceModeChange(true);
    try {
      // iOS Safari fix
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const testContext = new AudioContextClass();
        if (testContext.state === "suspended") await testContext.resume();
        testContext.close();
      }
      let history = null;
      if (conversationId) {
        const historyData = await fetchHistory(conversationId);
        if (historyData) history = historyData?.history;
      }
      await connect();
      if (history && history.length > 0) {
        setTimeout(() => {
          history.forEach((turn: any) => clientRef.current.send(turn.parts, false));
          clientRef.current.send([{ text: "Hello" }], true);
        }, 300);
      }
      setIsStreaming(true);
      setIsConnecting(false);
    } catch (error: any) {
      setIsConnecting(false);
      setIsVoiceModeActive(false);
      if (onVoiceModeChange) onVoiceModeChange(false);
      toast.error(error?.message || "Failed to start voice mode.", {
        duration: 8000,
        position: "top-center",
      });
    }
  }, [connect, onVoiceModeChange, conversationId, fetchHistory]);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (webcam.isStreaming) changeStreams()();
    if (screenCapture.isStreaming) changeStreams()();
    audioRecorder.stop();
    setMuted(true);
    disconnect();
    setIsStreaming(false);
    setIsVoiceModeActive(false);
    if (onVoiceModeChange) onVoiceModeChange(false);
  }, [
    audioRecorder,
    changeStreams,
    disconnect,
    onVoiceModeChange,
    screenCapture.isStreaming,
    webcam.isStreaming,
  ]);

  useEffect(() => {
    if (autoStartRef.current) startStreaming();
  }, [startStreaming]);

  return {
    isVoiceModeActive,
    isStreaming,
    isConnecting,
    startStreaming,
    stopStreaming,
    handleAudioData,
    muted,
    setMuted,
    isMobile,
    videoStreams,
    activeVideoStream,
    changeStreams,
    setupVideoFrameCapture,
    inVolume,
  };
}
