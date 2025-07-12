import { Skeleton } from "@/components/ui/skeleton";
import ArchivingTaskFilesComponent from "@/components/uiComponents/ArchivingTaskFilesComponent";
import ArchivingTaskFilesSkeleton from "@/components/uiComponents/ArchivingTaskFilesSkeleton";
import GeneratedAudioComponent from "@/components/uiComponents/GeneratedAudioComponent";
import GeneratedAudioSkeleton from "@/components/uiComponents/GeneratedAudioSkeleton";
import GeneratedClipsComponent from "@/components/uiComponents/GeneratedClipsComponent";
import GeneratedClipsSkeletonComponent from "@/components/uiComponents/GeneratedClipsSkeletonComponent";
import { SkeletonDemo } from "@/components/uiComponents/SampleSkeleton";
import SingleCombinedVideoComponent from "@/components/uiComponents/SingleCombinedVideoCompnent";
import SingleCombineVideoSkeleton from "@/components/uiComponents/SingleCombineVideoSkeleton";
import React from "react";

const page = () => {
  return (
    <div>
      <GeneratedClipsComponent />
      <GeneratedClipsSkeletonComponent />
      <GeneratedAudioComponent />
      <GeneratedAudioSkeleton />
      <SingleCombinedVideoComponent />
      <SingleCombineVideoSkeleton />
      <ArchivingTaskFilesComponent />
      <ArchivingTaskFilesSkeleton />
    </div>
  );
};

export default page;
