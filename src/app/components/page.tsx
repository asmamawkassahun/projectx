import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import LinksListWithLoading from "@/components/ui_components/loading/ItemListWithLoading";
import VideoSkeleton from "@/components/ui_components/video_component/VideoSkeleton";
import ArchivingTaskFilesComponent from "@/components/uiComponents/ArchivingTaskFilesComponent";
import ArchivingTaskFilesSkeleton from "@/components/uiComponents/ArchivingTaskFilesSkeleton";
import ArchivingTaskFilesWithLoading from "@/components/uiComponents/ArchivingTaskFilesWithLoading";
import GeneratedAudioComponent from "@/components/uiComponents/GeneratedAudioComponent";
import GeneratedAudioSkeleton from "@/components/uiComponents/GeneratedAudioSkeleton";
import GeneratedAudioWithLoading from "@/components/uiComponents/GeneratedAudioWithLoading";
import GeneratedClipsComponent from "@/components/uiComponents/GeneratedClipsComponent";
import GeneratedClipsSkeletonComponent from "@/components/uiComponents/GeneratedClipsSkeletonComponent";
import GeneratedClipsWithLoading from "@/components/uiComponents/GeneratedClipsWithLoading";
import SingleCombinedVideoComponent from "@/components/uiComponents/SingleCombinedVideoCompnent";
import SingleCombinedVideoWithLoading from "@/components/uiComponents/SingleCombinedVideoWithLoading";
import SingleCombineVideoSkeleton from "@/components/uiComponents/SingleCombineVideoSkeleton";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center bg-background text-foreground justify-center min-h-screen  p-4">
      <div className="flex w-full justify-end items-center mx-auto">
        <ThemeToggle />
      </div>
      <LinksListWithLoading />
      <VideoSkeleton />
      <GeneratedClipsWithLoading />
      <GeneratedAudioWithLoading />
      <SingleCombinedVideoWithLoading />
      <ArchivingTaskFilesWithLoading />
    </div>
  );
};

export default page;
