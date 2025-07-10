export type ViewMode = 'computer' | 'files' | 'markdown';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  requiresResponse?: boolean;
  clarificationId?: string;
  isClarification?: boolean;
  files?: { name: string; path: string; }[];
  markdownFiles?: { name: string; path: string; content: string; file_url?: string; }[];
  type?: string;
  toolName?: string;
  markdownData?: { 
    filename: string; 
    path: string; 
    file_url?: string; 
    content?: string; 
  };
  inChatUpdates?: any[];
}

export interface StatusUpdate {
  id: string;
  message: string;
  timestamp: Date;
  type?: string;
  toolName?: string;
}

export interface Task {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uuid?: string;
  query?: string;
  created_at?: string;
}

export interface MarkdownFile {
  name: string;
  path: string;
  content: string;
  file_url?: string;
}

export interface File {
  name: string;
  path: string;
}

// Audio message interface for replay functionality
export interface AudioMessage {
  role: string;
  audio_base64: string;
  created_at: string;
  content?: string;
}

export interface FeatureTab {
  id: string;
  label: string;
  icon: string;
}

export * from './voice-agent'; 