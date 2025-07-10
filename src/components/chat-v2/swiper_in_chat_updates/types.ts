export interface InChatUpdate {
  id: string;
  tool: string;
  event_type: string;
  data: any;
  timestamp: Date;
}

export interface SwiperItem {
  id: string;
  tool: string;
  updates: InChatUpdate[];
  timestamp: Date;
}

export interface BaseSwiperItemProps {
  updates: InChatUpdate[];
  isActive: boolean;
  isDragging: boolean;
} 