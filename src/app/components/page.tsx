import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import IngredientsCard from "@/components/ui_components/loading/IngridentLoading";
import LinksListWithLoading from "@/components/ui_components/loading/ItemListWithLoading";
import VideoCard from "@/components/ui_components/loading/VideoCardLoading";
import ArchivingTaskFilesWithLoading from "@/components/uiComponents/ArchivingTaskFilesWithLoading";
import GeneratedAudioWithLoading from "@/components/uiComponents/GeneratedAudioWithLoading";
import GeneratedClipsWithLoading from "@/components/uiComponents/GeneratedClipsWithLoading";
import SingleCombinedVideoWithLoading from "@/components/uiComponents/SingleCombinedVideoWithLoading";
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
        <GeneratedClipsWithLoading />
        <GeneratedAudioWithLoading />
        <SingleCombinedVideoWithLoading />
        <ArchivingTaskFilesWithLoading /> 
      </div>
    </div>
  );
};

export default page;
