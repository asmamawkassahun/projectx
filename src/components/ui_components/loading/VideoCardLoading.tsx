"use client";

import { dummyVideos, Video } from "@/lib/data/dummyVideos";
import { useState, useEffect } from "react";
import VideoSkeleton from "../video_component/VideoSkeleton";
import { VideoCardContent } from "../video_component/VideoContent";
import { ShadCnButton } from "@/components/ui/shadcnButton";

export default function VideoCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Video[]>([]);
  const totalVideos = 9; // As per the image

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyVideos);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

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
      {isLoading ? (
        <VideoSkeleton />
      ) : (
        <VideoCardContent videos={data} totalVideos={totalVideos} />
      )}
      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
