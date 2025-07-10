import { useCallback, useEffect, useRef, useState } from "react";
import { pusherManager, PusherEventType } from "@/lib/pusher";
import { ConnectionStatus } from "@/types";

interface UsePusherConnectionProps {
  sessionId: string | null;
  onStatusUpdate: (data: any) => void;
  onComplete: (data: any) => void;
  onError: (data: any) => void;
  onInChatUpdates: (data: any) => void;
  onAgentStopped: (data: any) => void;
  onTaskCreated: (data: any) => void;
  onSessionStatus: (data: any) => void;
}

export function usePusherConnection({
  sessionId,
  onStatusUpdate,
  onComplete,
  onError,
  onInChatUpdates,
  onAgentStopped,
  onTaskCreated,
  onSessionStatus,
}: UsePusherConnectionProps) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const connectToPusher = useCallback(
    async (providedSessionId?: string | null) => {
      try {
        setConnectionStatus("connecting");
        pusherManager.disconnect();
        const sessionIdToUse = providedSessionId || sessionId;
        if (sessionIdToUse) {
          await pusherManager.connect(sessionIdToUse);
          setConnectionStatus("connected");
        } else {
          const newSessionId = await pusherManager.connect();
          setConnectionStatus("connected");
        }
      } catch (error) {
        setConnectionStatus("disconnected");
      }
    },
    [sessionId]
  );

  useEffect(() => {
    pusherManager.addEventListener(
      PusherEventType.StatusUpdate,
      onStatusUpdate
    );
    pusherManager.addEventListener(PusherEventType.Complete, onComplete);
    pusherManager.addEventListener(PusherEventType.Error, onError);
    pusherManager.addEventListener(
      PusherEventType.InChatUpdates,
      onInChatUpdates
    );
    pusherManager.addEventListener(
      PusherEventType.AgentStopped,
      onAgentStopped
    );
    pusherManager.addEventListener(PusherEventType.TaskCreated, onTaskCreated);
    pusherManager.addEventListener(
      PusherEventType.SessionStatus,
      onSessionStatus
    );

    pusherManager.pusher?.connection.bind("state_change", (states: any) => {
      if (states.current === "disconnected" || states.current === "failed") {
        setConnectionStatus("disconnected");
      }
    });

    return () => {
      pusherManager.removeEventListener(
        PusherEventType.StatusUpdate,
        onStatusUpdate
      );
      pusherManager.removeEventListener(PusherEventType.Complete, onComplete);
      pusherManager.removeEventListener(PusherEventType.Error, onError);
      pusherManager.removeEventListener(
        PusherEventType.AgentStopped,
        onAgentStopped
      );
      pusherManager.removeEventListener(
        PusherEventType.InChatUpdates,
        onInChatUpdates
      );
      pusherManager.removeEventListener(
        PusherEventType.TaskCreated,
        onTaskCreated
      );
      pusherManager.removeEventListener(
        PusherEventType.SessionStatus,
        onSessionStatus
      );
    };
  }, [
    onStatusUpdate,
    onComplete,
    onError,
    onInChatUpdates,
    onAgentStopped,
    onTaskCreated,
    onSessionStatus,
  ]);

  return {
    connectionStatus,
    connectToPusher,
    setConnectionStatus,
  };
}
