import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatMessage {
  type: "user" | "model" | "agent";
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isFloating?: boolean;
  chatStarted?: boolean;
  isTyping?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className={`min-h-full flex flex-col justify-end w-full px-2 sm:max-w-2xl sm:mx-auto`}>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={`message-${messages.length}`}
            className="text-white font-semibold text-[24px] leading-[100%] mb-28"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {messages[messages.length - 1].content}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMessages;
