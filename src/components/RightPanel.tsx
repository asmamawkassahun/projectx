import React from "react";
import BrowserView from "./BrowserView";
import FileNavigator from "./FileNavigator";
import MarkdownFileView from "./MarkdownFileView";
import ViewSwitcher from "./ViewSwitcher";
import TaskProgress from "./TaskProgress";

type ViewMode = "computer" | "files" | "markdown";

interface Task {
  step: string;
  status: "pending" | "processing" | "completed" | "failed";
}

interface MarkdownFile {
  name: string;
  path: string;
  content: string;
  file_url?: string;
}

interface RightPanelProps {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  browserStreamUrl: string | null;
  userHasControl: boolean;
  onTakeControl: () => void;
  onFinishControl: () => void;
  currentFiles: { name: string; path: string }[];
  currentFileIndex: number;
  onPrevFile: () => void;
  onNextFile: () => void;
  currentMarkdownFile: MarkdownFile | null;
  tasks: Task[];
  currentStep: number;
  isPlanExpanded: boolean;
  toggleExpandPlan: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  viewMode,
  toggleViewMode,
  browserStreamUrl,
  userHasControl,
  onTakeControl,
  onFinishControl,
  currentFiles,
  currentFileIndex,
  onPrevFile,
  onNextFile,
  currentMarkdownFile,
  tasks,
  currentStep,
  isPlanExpanded,
  toggleExpandPlan,
}) => {
  const hasFiles = currentFiles.length > 0;
  const hasBrowser = !!browserStreamUrl;
  const hasMarkdown = !!currentMarkdownFile;

  return (
    <div className="flex-[0.4] flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-green-200">
        <div className="flex items-center gap-3">
          {viewMode === "computer" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span className="text-gray-700 font-montserrat tracking-wide">Costar's Computer</span>
            </>
          ) : viewMode === "files" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span className="text-gray-700 font-montserrat tracking-wide">Files</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span className="text-gray-700 font-montserrat tracking-wide">Markdown</span>
            </>
          )}
        </div>

        {/* View switcher */}
        <ViewSwitcher viewMode={viewMode} onToggle={toggleViewMode} hasFiles={hasFiles} hasBrowser={hasBrowser} hasMarkdown={hasMarkdown} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "computer" ? (
          <BrowserView browserStreamUrl={browserStreamUrl} userHasControl={userHasControl} onTakeControl={onTakeControl} onFinishControl={onFinishControl} />
        ) : viewMode === "files" ? (
          <FileNavigator files={currentFiles} currentIndex={currentFileIndex} onPrevFile={onPrevFile} onNextFile={onNextFile} />
        ) : (
          <MarkdownFileView file={currentMarkdownFile} />
        )}
      </div>

      {/* Task Progress */}
      <TaskProgress tasks={tasks} currentStep={currentStep} isPlanExpanded={isPlanExpanded} toggleExpand={toggleExpandPlan} />

      {/* Control bar when user has browser control */}
      {userHasControl && viewMode === "computer" && (
        <div className="flex-shrink-0 bg-white text-gray-700 p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium">You have control</span>
          </div>
          <button
            onClick={onFinishControl}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg 
                     transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
