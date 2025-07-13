"use client";

import { useState, useEffect } from "react";
import ArchivingTaskFilesSkeleton from "./ArchivingTaskFilesSkeleton";
import ArchivingTaskFilesComponent from "./ArchivingTaskFilesComponent";
import { ShadCnButton } from "../ui/shadcnButton";

export default function ArchivingTaskFilesWithLoading() {
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
      {isLoading ? <ArchivingTaskFilesSkeleton /> : <ArchivingTaskFilesComponent />}
      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
