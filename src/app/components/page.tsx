import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import LinksListWithLoading from "@/components/ui_components/loading/ItemListWithLoading";
import VideoSkeleton from "@/components/ui_components/video_component/VideoSkeleton";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center bg-background text-foreground justify-center min-h-screen  p-4">
      <div className="flex w-full justify-end items-center mx-auto">
        <ThemeToggle />
      </div>
      <LinksListWithLoading />
      <VideoSkeleton />
    </div>
  );
};

export default page;
