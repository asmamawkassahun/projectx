import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Play} from "lucide-react";

const VideoSkeleton = () => {
  return (
    <div className="w-full max-w-[13.5625rem] md:max-w-[18rem] space-y-4 p-2">
      {/* Top bar and avatar */}
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="h-6 w-6 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        <Skeleton className="h-3 w-1/2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      </div>
      {/* Video area */}
      <div className="relative rounded-2xl overflow-hidden w-full aspect-[217/160] min-h-[8rem] dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf] flex items-end">
        {/* Play button skeleton */}
        <div className="absolute left-4 bottom-4 flex items-center gap-2 bg-black/20 dark:bg-[#1a1a1a]/40 rounded-full px-4 py-2">
          <Play className="h-4 w-4 text-white/60 fill-white/60" />
          <span className="text-sm font-semibold text-white/60">Play</span>
        </div>
      </div>
      {/* Bottom skeleton bars */}
      <div className="space-y-2 mt-2">
        <Skeleton className="h-3 w-full rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        <Skeleton className="h-3 w-1/2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      </div>
    </div>
  );
};

export default VideoSkeleton;
