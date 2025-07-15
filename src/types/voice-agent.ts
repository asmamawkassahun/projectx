import { Message } from "@/types";

// Define file types
export interface File {
  name: string;
  path: string;
}

export interface MarkdownFile {
  name: string;
  path: string;
  content: string;
  file_url?: string;
}

// Define the InChatUpdate type
export interface InChatUpdate {
  id: string;
  tool: string;
  event_type: string;
  data: any;
  timestamp: Date;
}

export interface ExtendedMessage extends Message {
  eventType?: string;
  eventData?: any;
  id?: string;
  toolName?: string;
  display?: "conversation" | "costar_event";
  inChatUpdates?: InChatUpdate[];
  files?: File[];
  markdownFiles?: MarkdownFile[];
}

export interface TranscriptType {
  role: "user" | "model";
  content: string;
  timestamp: Date;
  conversationId: string;
  audioData?: string; // Base64 encoded audio data
}

export interface AgentStateProps {
  messages: ExtendedMessage[];
  displayedEvents: ExtendedMessage[];
  isProcessing: boolean;
  isTaskActive: boolean;
  sessionId: string | null;
  isThinking: boolean;
  taskPlan: Task[];
  currentStep: number;
  showPlanInCenter: boolean;
  planVisible: boolean;
  showCenteredPulse: boolean;
  taskUuid: string | null;
  taskTitle: string;
  taskDescription: string;
}

export interface Task {
  step: string;
  status: "pending" | "processing" | "completed" | "failed";
}
