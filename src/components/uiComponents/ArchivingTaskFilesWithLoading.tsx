"use client";

import { useState, useEffect } from "react";
import ArchivingTaskFilesSkeleton from "./ArchivingTaskFilesSkeleton";
import ArchivingTaskFilesComponent from "./ArchivingTaskFilesComponent";
import { ShadCnButton } from "../ui/shadcnButton";
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
    <div className="w-full flex min-h-screen justify-center bg-background p-4">
      {isLoading ? <ArchivingTaskFilesSkeleton /> : <ArchivingTaskFilesComponent />}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
}
