import React from 'react';
import FileViewer from './FileViewer';

interface FileNavigatorProps {
  files: { name: string; path: string; }[];
  currentIndex: number;
  onPrevFile: () => void;
  onNextFile: () => void;
}

const FileNavigator: React.FC<FileNavigatorProps> = ({
  files,
  currentIndex,
  onPrevFile,
  onNextFile
}) => {
  const currentFile = files.length > 0 ? files[currentIndex] : null;

  if (!currentFile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No files to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <FileViewer file={currentFile} />
      </div>
      {files.length > 1 && (
        <div className="flex-shrink-0 flex items-center justify-between p-3 bg-white border-t border-gray-200">
          <button
            onClick={onPrevFile}
            disabled={currentIndex === 0}
            className="px-4 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg disabled:opacity-50 
                     hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:hover:bg-white shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Previous
          </button>
          <span className="text-sm text-gray-600 px-4 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
            {currentIndex + 1} of {files.length}
          </span>
          <button
            onClick={onNextFile}
            disabled={currentIndex === files.length - 1}
            className="px-4 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg disabled:opacity-50 
                     hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:hover:bg-white shadow-sm"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileNavigator; 