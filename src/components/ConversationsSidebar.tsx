import React, { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';
import { format } from 'date-fns';

// Define interface for conversation items (both tasks and audio conversations)
interface ConversationItem {
  id: string;
  type: 'task' | 'audio_conversation';
  title: string;
  status: string;
  created_at: string;
  completed_at?: string;
  conversation_id?: string;
  is_voice: boolean;
}

interface ConversationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationsSidebar({ isOpen, onClose }: ConversationsSidebarProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/conversations/recent`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: ConversationItem) => {
    if (item.is_voice) {
      // All voice items (both task-associated and standalone) go to voice-agent
      window.location.href = `/voice-agent?conversationId=${item.conversation_id}&replay=1`;
    } else {
      // Regular task items go to the task URL
      window.location.href = `/?task=${item.id}`;
    }
  };

  // Get status styling based on item status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-100 text-primary-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-secondary-100 text-secondary-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Conversations</h2>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-md text-card-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-primary/70">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-card-foreground/60 text-center py-4">No conversations found</p>
        ) : (
          <ul className="space-y-3">
            {conversations.map((item) => (
              <li 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="p-3 rounded-md hover:bg-primary/5 cursor-pointer transition-colors border border-border"
              >
                <div className="text-sm font-medium text-card-foreground truncate">{item.title || 'Untitled'}</div>
                <div className="flex flex-wrap justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </span>
                    
                    {/* Type indicators */}
                    {item.is_voice && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                        Voice
                      </span>
                    )}
                    
                    {item.type === 'task' && !item.is_voice && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Task
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-card-foreground/60 mt-1">
                    {format(new Date(item.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 