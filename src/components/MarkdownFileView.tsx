import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownFile {
  name: string;
  path: string;
  content: string;
  file_url?: string;
}

interface MarkdownFileViewProps {
  file: MarkdownFile | null;
}

const MarkdownFileView: React.FC<MarkdownFileViewProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">No markdown files</p>
          <p className="text-gray-500 text-sm">Content will appear when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        <MarkdownRenderer content={file.content} />
      </div>
      <div className="flex-shrink-0 bg-gray-100/50 py-2 px-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span className="text-sm text-gray-700 font-medium">{file.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownFileView; 