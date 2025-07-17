import React from "react";

type Props = {};

export const TaskLoader = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Creating your task plan...</p>
        <p className=" text-sm mt-2">Waiting for task plan...</p>
      </div>
    </div>
  );
};
