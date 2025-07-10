import Pusher from 'pusher-js';
import type { Channel } from 'pusher-js';
import { API_URL } from '@/config/api';
// Define event types
export enum PusherEventType {
  StatusUpdate = 'status_update',
  Complete = 'complete',
  Error = 'error',
  CuaClarification= 'cua_clarification',
  AgentStopped = 'agent_stopped',
  InChatUpdates = 'in_chat_updates',
  TaskCreated = 'task_created',
  ChatMessage = 'chat_message',
  ChatComplete = 'chat_complete',
  VoiceSearchEvent = 'voice_search_event',
  SessionStatus = 'session_status'
}

// Define the PusherManager class
class PusherManager {
  private _pusher: Pusher;
  private channels: Record<string, Channel> = {};
  private eventListeners: Record<string, Array<(data: any) => void>> = {};
  private sessionId: string | null = null;

  constructor() {
    // Initialize Pusher
    this._pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
      authEndpoint: `${API_URL}/api/pusher/auth`,
    });
    
    // Initialize event listeners
    Object.values(PusherEventType).forEach(eventType => {
      this.eventListeners[eventType] = [];
    });
  }

  // Connect to a session
  public async connect(existingSessionId?: string): Promise<string> {
    try {
      // Create or use an existing session
      if (existingSessionId && existingSessionId !== 'new') {
        this.sessionId = existingSessionId;
      } else {
        const response = await this.createSession();
        this.sessionId = response.session_id;
      }
      
      // Subscribe to the session channel
      this.subscribeToChannel(this.sessionId);
      
      return this.sessionId;
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  // Create a new session
  private async createSession(): Promise<{ session_id: string }> {
    const sessionId = `session_${Date.now()}`;
    
    const response = await fetch(`${API_URL}/api/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return await response.json();
  }

  // Subscribe to a channel
  private subscribeToChannel(sessionId: string): void {
    const channelName = `private-session-${sessionId}`;
    
    if (this.channels[channelName]) {
      return;
    }
    
    const channel = this._pusher.subscribe(channelName);
    this.channels[channelName] = channel;
    
    // Bind all event types to this channel
    Object.values(PusherEventType).forEach(eventType => {
      channel.bind(eventType, (data: any) => {
        this.eventListeners[eventType].forEach(listener => {
          listener(data);
        });
      });
    });
  }

  // Send a message
  public async sendMessage(message: string, messageType: string = 'regular', conversationId?: string | null, taskUuid?: string | null): Promise<any> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }
    
    const requestBody: any = {
      session_id: this.sessionId,
      message,
      message_type: messageType,
      task_uuid: taskUuid
    };

    // Include conversationId in the request if provided
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }
    
    const response = await fetch(`${API_URL}/api/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  }

  // Add event listener
  public addEventListener(eventType: PusherEventType, callback: (data: any) => void): void {
    this.eventListeners[eventType].push(callback);
  }

  // Remove event listener
  public removeEventListener(eventType: PusherEventType, callback: (data: any) => void): void {
    this.eventListeners[eventType] = this.eventListeners[eventType].filter(
      listener => listener !== callback
    );
  }

  // Disconnect
  public disconnect(): void {
    if (this.sessionId) {
      const channelName = `private-session-${this.sessionId}`;
      if (this.channels[channelName]) {
        this._pusher.unsubscribe(channelName);
        delete this.channels[channelName];
      }
    }
    
    // Clear all event listeners
    Object.values(PusherEventType).forEach(eventType => {
      this.eventListeners[eventType] = [];
    });
    
    this.sessionId = null;
  }

  // Fix the getter to return the renamed property
  public get pusher(): Pusher {
    return this._pusher;
  }
}

// Export a singleton instance
export const pusherManager = new PusherManager();