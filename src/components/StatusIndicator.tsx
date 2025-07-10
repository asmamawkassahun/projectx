import React, { useState } from 'react';
import { CollapsiblePanel, StatusDot, Icon, Progress } from '@/components/ui';

interface StatusUpdate {
  id: string;
  type: 'thinking' | 'web_search' | 'computer_use' | 'cua_event' | 'cua_reasoning' | 'step' | 'plan';
  message: string;
  details?: any;
  timestamp: Date;
}

interface StatusIndicatorProps {
  updates: StatusUpdate[];
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ updates }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter updates but keep CUA events and reasoning
  const filteredUpdates = updates.filter((update, index, array) => {
    // Keep all step updates
    if (update.type === 'step') return true;
    
    // For thinking updates, only keep the most recent one
    if (update.type === 'thinking') {
      const lastThinkingIndex = array
        .map((u, i) => u.type === 'thinking' ? i : -1)
        .filter(i => i !== -1)
        .pop();
      return index === lastThinkingIndex;
    }
    
    // Keep all browser-related events
    if (update.type === 'computer_use' || 
        update.type === 'web_search' || 
        update.type === 'cua_event' || 
        update.type === 'cua_reasoning') {
      return true;
    }
    
    // Filter out plan and other updates
    return false;
  });

  // Group updates by step number if available
  const stepUpdates = filteredUpdates.filter(update => 
    update.type === 'step' && update.details && update.details.current
  );
  
  // Get the current step number
  const currentStepNumber = stepUpdates.length > 0 
    ? Math.max(...stepUpdates.map(update => update.details.current))
    : 0;
  
  // Get the total number of steps
  const totalSteps = stepUpdates.length > 0 
    ? stepUpdates[0].details.total 
    : 0;

  // Map update type to StatusDot status
  const getStatusType = (update: StatusUpdate, isCurrentStep: boolean, isCompleted: boolean) => {
    if (update.type === 'step') {
      if (isCurrentStep) return 'warning';
      if (isCompleted) return 'success';
      return 'default';
    } else if (update.type === 'web_search' || update.type === 'computer_use' || 
               update.type === 'cua_event' || update.type === 'cua_reasoning') {
      return 'info';
    }
    return 'default';
  };

  // Get icon name based on update type
  const getIconName = (update: StatusUpdate, isCompleted: boolean) => {
    if (update.type === 'step' && isCompleted) {
      return 'check';
    } else if (update.type === 'cua_event') {
      return 'user';
    } else if (update.type === 'cua_reasoning') {
      return 'info';
    } else if (update.type === 'web_search') {
      return 'search';
    }
    return undefined;
  };

  // Create panel title with status dot
  const renderTitle = () => (
    <div className="flex items-center">
      <StatusDot status="warning" className="mr-2" />
      <h3 className="text-sm font-medium text-gray-700">Processing your request</h3>
    </div>
  );

  return (
    <CollapsiblePanel 
      title={renderTitle()}
      className="max-w-2xl bg-gray-50"
      defaultCollapsed={isCollapsed}
    >
      {totalSteps > 0 && (
        <div className="mb-4">
          <Progress 
            value={currentStepNumber} 
            max={totalSteps} 
            showLabels 
            labelSuffix="steps" 
            variant="default"
          />
        </div>
      )}
      
      <div className="space-y-0 mt-4">
        {/* Timeline of steps */}
        <div className="relative">
          {filteredUpdates.map((update, index) => {
            // Determine if this step is the current one being processed
            const isCurrentStep = update.type === 'step' && 
              update.details?.current === currentStepNumber && 
              update.details?.current !== update.details?.total;
            
            // Determine if this step is completed
            const isCompleted = update.type === 'step' && 
              update.details?.current < currentStepNumber;
            
            // Determine status type and icon
            const statusType = getStatusType(update, isCurrentStep, isCompleted);
            const iconName = getIconName(update, isCompleted);
            
            // Determine text class based on status
            const textClass = isCurrentStep ? "text-gray-800 font-medium" : "text-gray-700";
            
            return (
              <div key={update.id} className="flex items-start py-2 relative">
                {/* Timeline connector line */}
                {index < filteredUpdates.length - 1 && (
                  <div className="absolute left-[9px] top-[18px] w-[2px] bg-gray-300 h-[calc(100%)]"></div>
                )}
                
                {/* Status icon */}
                <div className="relative z-10 mt-1 mr-3 h-[18px] w-[18px] rounded-full flex items-center justify-center">
                  <StatusDot 
                    status={statusType} 
                    size="md" 
                    pulsing={isCurrentStep} 
                  />
                  {iconName && (
                    <Icon name={iconName} className="h-3 w-3 text-white absolute" />
                  )}
                </div>
                
                {/* Status content */}
                <div className="flex-1">
                  <div className={`text-sm ${textClass}`}>
                    {update.message}
                  </div>
                  
                  {/* Show details for different update types */}
                  {update.details && (
                    <div className="mt-0.5 text-xs text-gray-500">
                      {update.type === 'web_search' && update.details.query && (
                        <span>Query: "{update.details.query}"</span>
                      )}
                      {update.type === 'computer_use' && update.details.action && (
                        <span>{update.details.action}</span>
                      )}
                      {update.type === 'cua_event' && update.details.action && (
                        <span>{update.details.element || update.details.description || update.details.action}</span>
                      )}
                      {update.type === 'cua_reasoning' && update.details.text && (
                        <span className="italic">{update.details.text.length > 100 ? update.details.text.substring(0, 100) + '...' : update.details.text}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Show loading animation for current step */}
                  {isCurrentStep && (
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <div className="flex space-x-1 mr-2">
                        <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>In progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CollapsiblePanel>
  );
};

export default StatusIndicator; 