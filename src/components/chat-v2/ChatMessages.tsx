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
  const { inputValue, setInputValue } = useInputValueContext();

  // TO DO : add a another variant if the input.length > 0 where we don't actually return a p but a form>textarea
  if (inputValue.length > 0) {
    return (
      <div
        className={`min-h-full flex flex-col justify-end w-full px-2 sm:max-w-2xl sm:mx-auto`}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full bg-transparent focus:outline-none font-semibold text-[24px] leading-[100%] mb-28 caret-white`}
          autoFocus
        />
      </div>
    );
  } else if (messages.length > 0) {
    return (
      <div
        className={`min-h-full flex flex-col justify-end w-full px-2 sm:max-w-2xl sm:mx-auto`}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={`message-${messages.length}`}
            className="font-semibold text-[24px] leading-[100%] mb-28"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {messages[messages.length - 1]?.content}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  } else {
    return null;
  }
};

export default ChatMessages;
