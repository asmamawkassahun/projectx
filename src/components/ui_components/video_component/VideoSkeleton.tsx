import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { ShadCnButton } from "@/components/ui/shadcnButton";

const count = 3;

const VideoSkeleton = () => {
  return (
    <div className="w-full max-w-[43.1875rem] space-y-6">
      <div className="flex items-center justify-between w-[5.6875rem] dark:text-white text-black text-sm font-semibold">
        <span>Videos</span>
        <span>6</span>
      </div>
      <div className="flex space-x-5 overflow-x-auto pb-4">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-[13.5625rem] h-[15.25rem] flex-shrink-0"
            >
              {/* Top bar and avatar */}
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 w-6 rounded-full bg-black/10 dark:bg-white/10" />
                <Skeleton className="h-3 w-1/2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
              </div>
              {/* Video area */}
              <div className="relative rounded-2xl overflow-hidden w-full aspect-[217/160] min-h-[8rem] dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf] flex items-end">
                {/* Play button skeleton */}
                <div className="absolute bottom-2 left-2 bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-full px-2.5 space-x-3 py-2 flex items-center text-sm">
                  <Play className="h-4 w-4 text-foreground/40 fill-foreground/40" />
                  <span className="text-foreground/40 text-sm font-semibold">
                    Play
                  </span>
                </div>
              </div>
              {/* Bottom skeleton bars */}
              <div className="space-y-2 mt-2">
                <Skeleton className="h-3 w-full rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
                <Skeleton className="h-3 w-1/2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
              </div>
            </div>
          ))}
      </div>
      <ShadCnButton
        variant="link"
        className="text-xs font-semibold text-foreground rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10"
      >
        See more
      </ShadCnButton>
    </div>
  );
};

export default VideoSkeleton;
