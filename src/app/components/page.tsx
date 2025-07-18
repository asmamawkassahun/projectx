import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import IngredientsCard from "@/components/ui/loading/IngridentLoading";
import LinksListWithLoading from "@/components/ui/loading/ItemListWithLoading";
import VideoCard from "@/components/ui/loading/VideoCardLoading";
import ArchivingTaskFilesWithLoading from "@/components/ui/loading/ArchivingTaskFilesWithLoading";
import GeneratedAudioWithLoading from "@/components/ui/loading/GeneratedAudioWithLoading";
import GeneratedClipsWithLoading from "@/components/ui/loading/GeneratedClipsWithLoading";
import SingleCombinedVideoWithLoading from "@/components/ui/loading/SingleCombinedVideoWithLoading";
import React from "react";
import FlightCardWithLoading from "@/components/ui/loading/FlightCardWithLoading";
import MapCardLoading from "@/components/ui/loading/MapCardLoading";
import ImageGridWithLoading from "@/components/ui/loading/ImageGridWithLoading";
import HotelsCardLoading from "@/components/ui/loading/HotelsCardLoading";

const page = () => {
  return (
    <div className="flex flex-col  bg-background text-foreground justify-center min-h-screen  p-4">
      <div className="flex w-full justify-end items-center mx-auto">
        <ThemeToggle />
      </div>
      <div className="flex flex-col  w-full ">
        <HotelsCardLoading />
        <FlightCardWithLoading />
        <MapCardLoading />
        <LinksListWithLoading />
        <IngredientsCard />
        <VideoCard />
        <GeneratedClipsWithLoading />
        <GeneratedAudioWithLoading />
        <SingleCombinedVideoWithLoading />
        <ArchivingTaskFilesWithLoading />
        <ImageGridWithLoading />
      </div>
    </div>
  );
};

export default page;
