import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CollapsiblePanelProps {
  title: ReactNode;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rightElement?: ReactNode;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  defaultCollapsed = false,
  className,
  headerClassName,
  bodyClassName,
  rightElement
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={cn("rounded-lg border border-gray-200", className)}>
      <div className={cn("flex items-center justify-between p-3", headerClassName)}>
        <div className="flex items-center">
          {title}
        </div>
        <div className="flex items-center">
          {rightElement}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 transition-colors ml-2"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={cn("p-3", bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsiblePanel; 