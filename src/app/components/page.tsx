import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import IngredientsCard from "@/components/ui_components/loading/IngridentLoading";
import LinksListWithLoading from "@/components/ui_components/loading/ItemListWithLoading";
import VideoCard from "@/components/ui_components/loading/VideoCardLoading";
import ArchivingTaskFilesComponent from "@/components/uiComponents/ArchivingTaskFilesComponent";
import ArchivingTaskFilesSkeleton from "@/components/uiComponents/ArchivingTaskFilesSkeleton";
import GeneratedAudioComponent from "@/components/uiComponents/GeneratedAudioComponent";
import GeneratedAudioSkeleton from "@/components/uiComponents/GeneratedAudioSkeleton";
import GeneratedClipsComponent from "@/components/uiComponents/GeneratedClipsComponent";
import GeneratedClipsSkeletonComponent from "@/components/uiComponents/GeneratedClipsSkeletonComponent";
import SingleCombinedVideoComponent from "@/components/uiComponents/SingleCombinedVideoCompnent";
import SingleCombineVideoSkeleton from "@/components/uiComponents/SingleCombineVideoSkeleton";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center bg-background text-foreground justify-center min-h-screen  p-4">
      <div className="flex w-full justify-end items-center mx-auto">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center w-full ">
        <LinksListWithLoading />
        <IngredientsCard />
        <VideoCard />
        <GeneratedClipsComponent />
        <GeneratedClipsSkeletonComponent />
        <GeneratedAudioComponent />
        <GeneratedAudioSkeleton />
        <SingleCombinedVideoComponent />
        <SingleCombineVideoSkeleton />
        <ArchivingTaskFilesComponent />
        <ArchivingTaskFilesSkeleton />
      </div>
    </div>
  );
};

export default page;
