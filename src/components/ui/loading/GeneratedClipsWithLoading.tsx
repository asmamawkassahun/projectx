"use client";

import { useState, useEffect } from "react";
import GeneratedClipsSkeletonComponent from "../generated_clip_component/GeneratedClipsSkeletonComponent";
import GeneratedClipsComponent from "../generated_clip_component/GeneratedClipsComponent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";

export default function GeneratedClipsWithLoading() {
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
    <div className="w-full min-h-screen p-8 bg-background flex justify-center">
      {isLoading ? (
        <GeneratedClipsSkeletonComponent />
      ) : (
        <GeneratedClipsComponent />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
}
