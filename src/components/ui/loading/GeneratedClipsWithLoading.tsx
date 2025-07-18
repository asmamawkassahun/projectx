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
    <div className="py-2.5 bg-background text-foreground flex flex-col justify-center sm:flex-row  space-y-10 space-x-10">
      <div className="w-full max-w-[691px] flex flex-col space-y-4">
        {isLoading ? (
          <GeneratedClipsSkeletonComponent />
        ) : (
          <GeneratedClipsComponent />
        )}
      </div>
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>
    </div>
  );
}
