"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { dummyGeneratedClips } from "@/lib/data/dummyGeneratedClips";
import type { GeneratedClip } from "@/lib/data/dummyGeneratedClips";

const ClipBox = ({ imageSrc, step, duration, resolution }: GeneratedClip) => (
  <div className="w-full max-w-[217px] h-[303px] flex flex-col items-center mb-4 sm:mb-0">
    <div className="w-full h-[260px] rounded-[24px] bg-gray-200 opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative">
      <Image src={imageSrc} alt={step} width={217} height={260} className="object-cover w-full h-full" />
      <div
        className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] pt-[10px] pr-[12px] pb-[10px] pl-[10px] opacity-100 absolute backdrop-blur-md bg-black/40 dark:bg-black/40"
        style={{
          top: "216px",
          left: "12px",
          ...(typeof window !== "undefined" && window.innerWidth < 640 ? { top: "140px" } : {}),
        }}
      >
        <div className="w-4 h-4 flex items-center justify-center" style={{ position: "relative" }}>
          <Play className="text-foreground fill-black dark:fill-white" />
        </div>
        <span
          className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-center text-foreground"
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
    <div className="w-full max-w-[217px] h-[27px] mt-4 -ml-4 flex flex-col opacity-100 rotate-0 space-y-2.5 items-start justify-center px-2 py-1">
      <div
        className="w-full max-w-[217px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
      >
        {step}
      </div>
      <div
        className="w-full max-w-[217px] h-[7px] font-sans font-medium text-[10px] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-white/40"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
      >
        {duration} • {resolution}
      </div>
    </div>
  </div>
);

const GeneratedClipsComponent = () => {
  return (
    <div className="w-full max-w-[691px] h-[404px] flex flex-col gap-6 opacity-100 p-2">
      <div className="w-full h-[351px] flex flex-col gap-5 opacity-100 max-w-full">
        <div className="flex items-center justify-start gap-[10px] opacity-100 h-[32px]">
          <span
            className="h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground"
          >
            Generated clips
          </span>
          <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] rounded-full opacity-100 bg-gray-100 dark:bg-white/5 p-2">
            <span
              className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground opacity-100"
            >
              7
            </span>
          </div>
        </div>

        <div className="w-full h-[303px] flex flex-col sm:flex-row gap-4 opacity-100">
          {dummyGeneratedClips.map((clip, idx) => (
            <div key={clip.step + idx} className="flex-1 min-w-0">
              <ClipBox {...clip} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-[85px] h-[29px] flex items-center justify-center gap-[10px] opacity-100 rounded-full pt-[10px] pr-[12px] pb-[10px] pl-[12px] bg-gray-100 dark:bg-white/5 mt-2">
        <span
          className="w-[61px] h-[9px] font-sans font-semibold text-[12px] leading-[1] tracking-normal align-bottom text-foreground opacity-100"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          See more
        </span>
      </div>
    </div>
  );
};

export default GeneratedClipsComponent;