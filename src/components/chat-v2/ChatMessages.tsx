import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInputValueContext } from "@/contexts/InputValueContext";

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
  const { inputValue } = useInputValueContext();

  if (inputValue.length > 0 || messages.length === 0) return null;

  return (
    <div
      className={`fixed inset-0  flex flex-col justify-center sm:justify-end px-4 sm:px-0 pb-0 sm:pb-[164px]  pointer-events-none sm:max-w-2xl sm:mx-auto`}
    >
      <div className="relative">
        <div className="absolute inset-0 scale-125 backdrop-blur-[40px] blur-[50px] bg-[#D9D9D903]" />
        <motion.p
          key={`message-${messages.length}`}
          className="relative font-semibold text-[24px] leading-[100%]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {messages[messages.length - 1]?.content}
        </motion.p>
      </div>
    </div>
  );
};

export default ChatMessages;
