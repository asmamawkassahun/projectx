"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

const GeneratedClipsSkeletonComponent = () => {
  return (
    <div className="w-full max-w-[691px] h-[404px] flex flex-col gap-6 opacity-100 p-2">
      <div className="flex items-center justify-start gap-[10px] opacity-100 h-[32px]">
        <span
          className="h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white"
        >
          Generated clips
        </span>
        <span
          className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white opacity-100"
        >
          7
        </span>
      </div>

      <div className="w-full h-[303px] flex flex-col sm:flex-row gap-4 opacity-100">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="flex-1 min-w-0">
            <div className="w-full max-w-[217px] h-[303px] flex flex-col items-center mb-4 sm:mb-0">
              <div
                className="w-full h-[260px] rounded-[24px] opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
                }}
              >
                <Skeleton className="w-full h-full rounded-[24px]" />
                <div
                  className="w-[73px] h-[32px] flex items-center rounded-[1000px] opacity-100 absolute backdrop-blur-md bg-black/40 dark:bg-black/40 left-3 bottom-3 sm:top-[216px] sm:left-[12px] sm:bottom-auto sm:right-auto"
                  style={{
                    paddingTop: 10,
                    paddingRight: 12,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    gap: 8,
                    background: "#FFFFFF1A",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center" style={{ position: "relative" }}>
                    <Play className="text-gray-500 dark:text-gray-400 fill-gray-500 dark:fill-gray-400" />
                  </div>
                  <span
                    className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-center text-foreground opacity-60"
                    style={{
                      fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
                      display: "inline-block",
                      lineHeight: "1",
                      verticalAlign: "center",
                    }}
                  >
                    Play
                  </span>
                </div>
              </div>
              <div className="w-full max-w-[193px] h-[32px] flex flex-col gap-2 mt-4 -ml-4">
                <Skeleton
                  className="w-full max-w-[193px] h-[10px] rounded-[100px] mb-1"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
                  }}
                />
                <Skeleton
                  className="w-[39px] h-[10px] rounded-[100px]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[85px] h-[29px] flex items-center justify-center gap-[10px] opacity-100 rounded-full pt-[10px] pr-[12px] pb-[10px] pl-[12px] bg-gray-100 dark:bg-white/5 mt-2">
        <span
          className="w-[61px] h-[9px] font-sans font-semibold text-[12px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white opacity-60"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          See more
        </span>
      </div>
    </div>
  );
};

export default GeneratedClipsSkeletonComponent;