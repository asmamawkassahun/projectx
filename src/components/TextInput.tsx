import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "./ui";
import { KeyboardIcon } from "./icons/KeyboardIcon";

interface TextInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  isProcessing?: boolean;
  connectionStatus?: "connected" | "disconnected" | "connecting";
  isWelcomeScreen?: boolean;
  clarificationMode?: boolean;
  isInputDisabled?: boolean;
  sessionStatus?: "active" | "deactive";
}

const TextInput: React.FC<TextInputProps> = ({
  onSendMessage,
  isDisabled = false,
  placeholder = "How can I help you?",
  isProcessing = false,
  connectionStatus = "connected",
  isWelcomeScreen = false,
  clarificationMode = false,
  isInputDisabled = false,
  sessionStatus = "active",
}) => {
  const [message, setMessage] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // Determine if input should be disabled based on connection status, replay mode, or session status
  const inputDisabled = isDisabled || connectionStatus !== "connected" || isInputDisabled || sessionStatus === "deactive";

  // Get appropriate placeholder text based on connection status and session status
  const getPlaceholder = () => {
    if (sessionStatus === "deactive") {
      return "Session expired (2.5 hours). Please start a new session.";
    } else if (isInputDisabled) {
      return "Input disabled in replay mode";
    } else if (connectionStatus === "disconnected") {
      return "Disconnected. Please reconnect to continue...";
    } else if (connectionStatus === "connecting") {
      return "Connecting to server...";
    }
    return placeholder;
  };

  const handleSendMessage = () => {
    if (message.trim() && !inputDisabled) {
      onSendMessage(message);
      setMessage("");

      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setMessage(""); // Clear the message on Escape
      setShowTextInput(false); // Hide the text input
    }
  };

  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    // Reset height to auto to correctly calculate the new height
    textarea.style.height = "auto";

    // Set new height based on content (with max height limit)
    const newHeight = Math.min(textarea.scrollHeight, 150);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    const handleAnyKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") return;
      textareaRef.current?.focus();
      setShowTextInput(true);
    };
    window.addEventListener("keydown", handleAnyKey);
    return () => {
      window.removeEventListener("keydown", handleAnyKey);
    };
  }, []);

  if (!showTextInput) return <></>;

  return (
    <div className="">
      {clarificationMode && (
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-amber-600 font-medium">Waiting for your response...</span>
          </div>
        </div>
      )}

      {isProcessing && !isWelcomeScreen && !clarificationMode && (
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-150"></div>
            </div>
            <span>Agent is processing. You can add instructions anytime.</span>
          </div>
        </div>
      )}

      {/* Session expired message */}
      {sessionStatus === "deactive" && (
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-red-600 font-medium">Session expired after 2.5 hours. Please start a new session.</span>
          </div>
        </div>
      )}

      {/* Connection status message */}
      {connectionStatus !== "connected" && sessionStatus === "active" && (
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"}`}></div>
            <span className={`${connectionStatus === "connecting" ? "text-amber-600" : "text-red-600"}`}>
              {connectionStatus === "connecting" ? "Connecting to server..." : "Disconnected. Please reconnect to continue."}
            </span>
          </div>
        </div>
      )}

      <form className="flex w-full items-center">
        <textarea
          ref={textareaRef}
          id="prompt-textarea"
          tabIndex={0}
          dir="auto"
          rows={1}
          placeholder={getPlaceholder()}
          className={`flex-1 resize-none border-0 focus:outline-none text-base leading-6 bg-transparent px-0 py-0 text-white font-semibold placeholder:text-gray-400 ${
            connectionStatus !== "connected" ? "text-gray-500" : ""
          }`}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          disabled={inputDisabled}
        />

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded bg-transparent hover:bg-white/10 transition"
          // onClick={...} // Add your handler here
          tabIndex={-1}
        >
          {/* Replace with your image icon */}
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="16" height="16" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default TextInput;
