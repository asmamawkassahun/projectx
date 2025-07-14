"use client";

import { useState, useEffect } from "react";
import SingleCombineVideoSkeleton from "../single_combined_video_component/SingleCombineVideoSkeleton";
import SingleCombinedVideoComponent from "../single_combined_video_component/SingleCombinedVideoCompnent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";

export default function SingleCombinedVideoWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full flex justify-center bg-background p-4">
      {isLoading ? (
        <SingleCombineVideoSkeleton />
      ) : (
        <SingleCombinedVideoComponent />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
}
