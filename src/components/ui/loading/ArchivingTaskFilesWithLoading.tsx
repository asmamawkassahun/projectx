"use client";

import { useState, useEffect } from "react";
import ArchivingTaskFilesSkeleton from "../archive_task_components/ArchivingTaskFilesSkeleton";
import ArchivingTaskFilesComponent from "../archive_task_components/ArchivingTaskFilesComponent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";

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
    <div className="w-full flex justify-center bg-background p-4">
      {isLoading ? (
        <ArchivingTaskFilesSkeleton />
      ) : (
        <ArchivingTaskFilesComponent />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
}
