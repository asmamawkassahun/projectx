"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { useUIAgent } from "@/hooks/use-ui-agent";

// Simple HTML renderer component for displaying generated UI
const HTMLRenderer = ({ htmlContent }: { htmlContent: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("100%");

  useEffect(() => {
    if (containerRef.current) {
      // Calculate available height considering the header and footer
      const headerHeight = 70; // 4.375rem ≈ 70px
      const footerHeight = 96; // 6rem ≈ 96px
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - headerHeight - footerHeight;

      setMaxHeight(`${availableHeight}px`);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full "
      style={{ maxHeight }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

interface UIOverlayProps {
  onClose?: () => void;
  onLoadingStateChange?: (isLoading: boolean, toolName?: string) => void;
  onUIGenerated?: (toolName: string) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  onClose,
  onLoadingStateChange,
  onUIGenerated,
}) => {
  const { client } = useLiveAPIContext();
  const { generateUI, isGenerating } = useUIAgent();

  // Local state management
  const [generatedHTML, setGeneratedHTML] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentToolName, setCurrentToolName] = useState<string | null>(null);
  const [pendingToolData, setPendingToolData] = useState<any>(null);

  // UI-generating tools configuration
  const uiGeneratingTools = [
    "list_emails",
    "summarize_emails",
    "write_draft_for_new_email",
    "write_draft_for_reply",
    "list_events",
    "check_availability",
    "find_contact",
  ];

  // Check if a tool should generate UI
  const shouldGenerateUI = useCallback((toolName: string) => {
    return uiGeneratingTools.includes(toolName);
  }, []);

  // Handle tool calls from Live API
  const handleToolCall = useCallback(
    (toolCall: any) => {
      console.log("🎨 UIOverlay: Tool call received:", toolCall);

      if (toolCall.functionCalls) {
        toolCall.functionCalls.forEach((functionCall: any) => {
          const { name, args, id } = functionCall;

          if (shouldGenerateUI(name)) {
            console.log(`🎨 UIOverlay: UI-generating tool detected: ${name}`);
            setCurrentToolName(name);
            setPendingToolData({ toolName: name, args, id });

            // Notify parent about loading state
            onLoadingStateChange?.(true, name);

            // Don't show overlay until UI is generated - let blue toast handle loading
            // setIsVisible(true);
            setGeneratedHTML(null); // Clear previous UI
          }
        });
      }
    },
    [shouldGenerateUI, onLoadingStateChange]
  );

  // Handle search data from Live API
  const handleSearchData = useCallback(
    async (searchData: any) => {
      console.log("🎨 UIOverlay: Search data received:", searchData);

      // Enhanced logging for search data structure
      console.log("📊 UIOverlay: Search data details:");
      console.log("📊 - Type:", typeof searchData);
      console.log("📊 - Keys:", Object.keys(searchData || {}));
      console.log(
        "📊 - Size:",
        JSON.stringify(searchData).length,
        "characters"
      );

      // Log grounding supports if available
      if (
        searchData?.groundingSupports &&
        Array.isArray(searchData.groundingSupports)
      ) {
        console.log(
          "📊 - Grounding Supports Count:",
          searchData.groundingSupports.length
        );
        console.log(
          "📊 - First few segments:",
          searchData.groundingSupports
            .slice(0, 3)
            .map((support: any) => support.segment?.text)
        );
      }

      // Set tool name for search
      const searchToolName = "web_search";
      setCurrentToolName(searchToolName);

      // Notify parent about loading state
      onLoadingStateChange?.(true, searchToolName);

      // Don't show overlay until UI is generated - let blue toast handle loading
      // setIsVisible(true);
      setGeneratedHTML(null); // Clear previous UI

      try {
        console.log(
          "🎨 UIOverlay: Sending search data to UI agent for processing..."
        );

        // Generate UI directly with search data
        const uiResult = await generateUI(
          searchToolName,
          searchData,
          "search_" + Date.now()
        );

        if (uiResult.success && uiResult.generatedUI) {
          console.log("✅ UIOverlay: Search UI generated successfully");
          setGeneratedHTML(uiResult.generatedUI);
          setIsVisible(true); // Show overlay only when UI is ready
          onLoadingStateChange?.(false);
          onUIGenerated?.(searchToolName);
        } else {
          console.error(
            "❌ UIOverlay: Search UI generation failed:",
            uiResult.error
          );
          onLoadingStateChange?.(false);
          // Close overlay on failure
          setIsVisible(false);
          setGeneratedHTML(null);
          setCurrentToolName(null);
          setPendingToolData(null);
        }
      } catch (error) {
        console.error("🎨 UIOverlay: Search UI generation failed:", error);
        onLoadingStateChange?.(false);
        // Close overlay on error
        setIsVisible(false);
        setGeneratedHTML(null);
        setCurrentToolName(null);
        setPendingToolData(null);
      }
    },
    [generateUI, onLoadingStateChange, onUIGenerated]
  );

  // Handle tool responses with API data
  const handleToolResponse = useCallback(
    async (toolName: string, apiData: any, toolId: string) => {
      if (!shouldGenerateUI(toolName)) return;

      console.log("🎨 UIOverlay: Generating UI for tool response:", toolName);

      try {
        const uiResult = await generateUI(toolName, apiData, toolId);

        if (uiResult.success && uiResult.generatedUI) {
          setGeneratedHTML(uiResult.generatedUI);
          setIsVisible(true); // Show overlay only when UI is ready
          onLoadingStateChange?.(false);
          onUIGenerated?.(toolName);
        }
      } catch (error) {
        console.error("🎨 UIOverlay: UI generation failed:", error);
        onLoadingStateChange?.(false);
        // Close overlay on error
        setIsVisible(false);
        setGeneratedHTML(null);
        setCurrentToolName(null);
        setPendingToolData(null);
      }
    },
    [shouldGenerateUI, generateUI, onLoadingStateChange, onUIGenerated]
  );

  // Listen to Live API events
  useEffect(() => {
    if (!client) return;

    // Listen to tool calls
    client.on("toolcall", handleToolCall);
    client.on("searchData", handleSearchData); // Listen for search data

    return () => {
      client.off("toolcall", handleToolCall);
      client.off("searchData", handleSearchData); // Unlisten for search data
    };
  }, [client, handleToolCall, handleSearchData]);

  // Listen to tool handler UI data updates
  useEffect(() => {
    const handleUIDataUpdate = (event: CustomEvent) => {
      const { toolName, apiData, id } = event.detail;
      console.log("🎨 UIOverlay: Received UI data update:", { toolName, id });

      if (currentToolName === toolName && pendingToolData?.id === id) {
        handleToolResponse(toolName, apiData, id);
      }
    };

    // Listen for custom events from tool handler
    window.addEventListener(
      "tool-response-ui-data",
      handleUIDataUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "tool-response-ui-data",
        handleUIDataUpdate as EventListener
      );
    };
  }, [currentToolName, pendingToolData, handleToolResponse]);

  // Close overlay
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setGeneratedHTML(null);
    setCurrentToolName(null);
    setPendingToolData(null);
    onLoadingStateChange?.(false);
    if (onClose) {
      onClose();
    }
  }, [onClose, onLoadingStateChange]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking on the backdrop itself, not on child elements
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  // Loading state component
  const LoadingState = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <div className="text-center">
          <p className="text-lg font-medium">Generating Interface</p>
          <p className="text-sm text-gray-400 mt-1">
            Creating dynamic UI for {currentToolName?.replace(/_/g, " ")}...
          </p>
        </div>
      </div>
    </div>
  );

  // Show loading state when generating UI or waiting for data
  if (isVisible && (!generatedHTML || isGenerating)) {
    // Don't show loading overlay - let the blue toast handle loading state
    return null;
  }

  // Render the generated HTML if available and visible
  return (
    <AnimatePresence>
      {isVisible && generatedHTML && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-[4.375rem] bottom-[6rem] z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
            aria-label="Close UI"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Generated UI content as the modal itself */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <HTMLRenderer htmlContent={generatedHTML} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UIOverlay;
