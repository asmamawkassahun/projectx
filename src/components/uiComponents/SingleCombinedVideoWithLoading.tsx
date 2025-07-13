"use client";

import { useState, useEffect } from "react";
import SingleCombineVideoSkeleton from "./SingleCombineVideoSkeleton";
import SingleCombinedVideoComponent from "./SingleCombinedVideoCompnent";
import { ShadCnButton } from "../ui/shadcnButton";

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
    <div className="min-h-screen p-8 bg-background text-foreground flex flex-col items-center justify-center space-y-5">
      {isLoading ? <SingleCombineVideoSkeleton /> : <SingleCombinedVideoComponent />}
      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
