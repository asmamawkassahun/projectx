import React from "react";
import { motion } from "framer-motion";
import { Modal, Button } from "@/components/ui";

interface ControlSummaryModalProps {
  isOpen: boolean;
  controlSummary: string;
  setControlSummary: (summary: string) => void;
  onSubmit: () => void;
}

const ControlSummaryModal: React.FC<ControlSummaryModalProps> = ({ isOpen, controlSummary, setControlSummary, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      title="What did you do in the browser?"
      description="Share a summary to help the AI continue where you left off."
      footer={
        <Button onClick={onSubmit} variant="primary">
          Resume AI Assistant
        </Button>
      }
    >
      <textarea
        className="w-full bg-gray-50 text-gray-700 border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Describe what you did while you had control... (Optional)"
        value={controlSummary}
        onChange={(e) => setControlSummary(e.target.value)}
      />
    </Modal>
  );
};

export default ControlSummaryModal;
