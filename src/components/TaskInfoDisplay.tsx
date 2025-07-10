import React from 'react';

interface TaskInfoDisplayProps {
  taskTitle: string;
  taskDescription: string;
}

const TaskInfoDisplay: React.FC<TaskInfoDisplayProps> = ({
  taskTitle,
  taskDescription
}) => {
  if (!taskTitle) return null;

  return (
    <div className="text-center mb-6 px-4 mt-4">
      {taskTitle && <h1 className="text-xl text-foreground font-medium">{taskTitle}</h1>}
      {taskDescription && (
        <p className="text-stone-600 text-sm mt-2 max-w-2xl mx-auto">{taskDescription}</p>
      )}
    </div>
  );
};

export default TaskInfoDisplay; 