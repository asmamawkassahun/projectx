import React from "react";
import { motion } from "framer-motion";
import TextInput from "./TextInput";
import { useJWTAuthContext } from "@/config/Auth";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { Button } from "./ui";

import { CameraIcon } from "./icons/CameraIcon";

interface InputWrapperProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
  isProcessing: boolean;
  connectionStatus: "connected" | "disconnected" | "connecting";
}

const InputWrapper: React.FC<InputWrapperProps> = ({ onSendMessage, isDisabled, isProcessing, connectionStatus }) => {
  const { user } = useJWTAuthContext();
  const router = useRouter();
  const firstName = user?.firstName || "there";

  // Handle navigating to voice agent page
  const handleVoiceAgentNavigation = () => {
    router.push("/voice-agent");
  };

  return (
    <div className="fixed bottom-0 pb-5 left-0 flex items-end justify-center gap-[14px] w-full">
      {/* camera input button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <Button onClick={() => console.log("video input")} variant="primary" size="md" aria-label="Open text input">
          <CameraIcon />
        </Button>
      </motion.div>

      {/* Simple Voice Mode Button */}
      <motion.button
        onClick={handleVoiceAgentNavigation}
        className="flex flex-0 items-center justify-center text-black w-16 h-16 bg-white rounded-full  transition-all duration-300 hover:bg-white/30 hover:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Mic strokeWidth={1.25} size={28} />
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <TextInput
          onSendMessage={onSendMessage}
          isDisabled={isDisabled}
          isProcessing={isProcessing}
          connectionStatus={connectionStatus}
          placeholder="Ask Costar to do something for you..."
          isWelcomeScreen={true}
        />
      </motion.div>
    </div>
  );
};

export default InputWrapper;
