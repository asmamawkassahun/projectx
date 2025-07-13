"use client";

import { useState, useEffect } from "react";
import GeneratedAudioSkeleton from "./GeneratedAudioSkeleton";
import GeneratedAudioComponent from "./GeneratedAudioComponent";
import { ShadCnButton } from "../ui/shadcnButton";

export default function GeneratedAudioWithLoading() {
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
      {isLoading ? <GeneratedAudioSkeleton /> : <GeneratedAudioComponent />}
      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
