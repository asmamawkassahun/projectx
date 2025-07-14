"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import { dummyGeneratedClips } from "@/lib/data/dummyGeneratedClips"
import type { GeneratedClip } from "@/lib/data/dummyGeneratedClips"

const ClipBox = ({ imageSrc, step, duration, resolution }: GeneratedClip) => (
  <div className="w-[217px] h-[303px] flex flex-col items-center sm:w-[217px] sm:h-[303px] mb-2 sm:mb-0">
    <div className="w-[217px] h-[260px] rounded-[24px] bg-gray-200 opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative sm:w-[217px] sm:h-[260px]">
      <Image src={imageSrc} alt={step} width={217} height={260} className="object-cover w-full h-full" />
      <div
        className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] pt-[10px] pr-[12px] pb-[10px] pl-[10px] opacity-100 absolute backdrop-blur-md bg-black/40 dark:bg-black/40"
        style={{
          top: "216px",
          left: "12px",
          ...(typeof window !== 'undefined' && window.innerWidth < 640 ? { top: '140px' } : {})
        }}
      >
        <div className="w-4 h-4 flex items-center justify-center" style={{ position: "relative" }}>
          <Play className="text-foreground fill-black dark:fill-white" />
        </div>
        {/* <div
          className="w-[27px] h-[10px] flex items-center justify-center"
          style={{
            borderRadius: "8px",
            padding: 0,
          }}
        > */}
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
        {/* </div> */}
      </div>
    </div>
    <div className="w-[217px] h-[27px] mt-4 flex flex-col opacity-100 rotate-0 space-y-2.5 items-start justify-center px-2 py-1 sm:w-[217px] sm:h-[27px]">
      <div
        className="w-[217px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground sm:w-[217px] sm:h-[10px]"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
      >
        {step}
      </div>
      <div
        className="w-[217px] h-[7px] font-sans font-medium text-[10px] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-white/40 sm:w-[217px] sm:h-[7px]"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
      >
        {duration} • {resolution}
      </div>
    </div>
  </div>
);

const GeneratedClipsComponent = () => {
  return (
    <div className="w-[691px] h-[404px] flex flex-col gap-6 rotate-0 opacity-100 sm:w-[691px] sm:h-[404px] p-2">
      <div className="w-[691px] h-[351px] flex flex-col gap-5 rotate-0 opacity-100 max-w-full sm:w-[691px] sm:h-[351px]">
        <div className="flex items-center justify-start gap-[10px] rotate-0 opacity-100 sm:h-[32px]">
          <span
            className="h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground"
            // style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
          >
            Generated clips
          </span>
          <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] rounded-full opacity-100 bg-gray-100 dark:bg-white/5 sm:w-[32px] sm:h-[32px] p-2">
            <span
              className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-foreground  opacity-100"
              // style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
            >
              7
            </span>
          </div>
        </div>

        <div className="w-[691px] h-[303px] flex gap-4 rotate-0 opacity-100 sm:flex-row flex-col sm:w-[691px] sm:h-[303px]">
        {dummyGeneratedClips.map((clip, idx) => (
            <ClipBox
              key={clip.step + idx}
              {...clip}
            />
          ))}
        </div>
      </div>

      <div className="w-[85px] h-[29px] flex items-center justify-center gap-[10px] rotate-0 opacity-100 rounded-full pt-[10px] pr-[12px] pb-[10px] pl-[12px] bg-gray-100 dark:bg-white/5 sm:w-[85px] sm:h-[29px] mt-2">
        <span
          className="w-[61px] h-[9px] font-sans font-semibold text-[12px] leading-[1] tracking-normal align-bottom text-foreground opacity-100 sm:w-[61px] sm:h-[9px]"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          See more
        </span>
      </div>
    </div>
  )
}

export default GeneratedClipsComponent
