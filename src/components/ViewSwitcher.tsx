import React from 'react';

type ViewMode = 'computer' | 'files' | 'markdown';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onToggle: () => void;
  hasFiles: boolean;
  hasBrowser: boolean;
  hasMarkdown: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onToggle,
  hasFiles,
  hasBrowser,
  hasMarkdown
}) => {
  // If we only have one view available, don't render the switcher
  if ((hasFiles ? 1 : 0) + (hasBrowser ? 1 : 0) + (hasMarkdown ? 1 : 0) <= 1) {
    return null;
  }

  return (
    <button 
      onClick={onToggle}
      className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
    >
      {viewMode === 'computer' ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          View Files
        </>
      ) : viewMode === 'files' ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          View Browser
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          View Browser
        </>
      )}
    </button>
  );
};

export default ViewSwitcher; 