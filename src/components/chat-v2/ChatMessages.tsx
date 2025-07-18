import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInputValueContext } from "@/contexts/InputValueContext";
import ReactMarkdown, { Components } from "react-markdown";

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

// Define custom markdown components
const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return (
      <div className="code-block relative my-3 rounded-lg overflow-hidden bg-gray-50 max-w-full border border-gray-200">
        {match && (
          <div className="bg-gray-100 px-4 py-2 text-xs font-mono border-b border-gray-200 flex items-center justify-between">
            <span className="text-gray-600">{match[1]}</span>
            <span className="text-gray-500">code</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <pre className="p-4 text-[13px] leading-relaxed whitespace-pre-wrap">
            <code
              className={`${match ? `language-${match[1]}` : ""}`}
              {...props}
            >
              {children}
            </code>
          </pre>
        </div>
      </div>
    );
  },
  p({ children }) {
    return <p className="mb-3 leading-relaxed font-normal">{children}</p>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  pre({ children }) {
    return <pre>{children}</pre>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 hover:underline"
      >
        {children}
      </a>
    );
  },
  // Add specific styling for HTML preview
  div({ children }) {
    return <div>{children}</div>;
  },
  span({ children }) {
    return <span>{children}</span>;
  },
  h1({ children }) {
    return <h1 className="text-2xl font-semibold mb-4">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-xl font-semibold mb-3">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-lg font-semibold mb-2">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="font-semibold mb-2">{children}</h4>;
  },
  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
};

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
          <ReactMarkdown components={components}>
            {messages[messages.length - 1]?.content}
          </ReactMarkdown>
        </motion.p>
      </div>
    </div>
  );
};

export default ChatMessages;
