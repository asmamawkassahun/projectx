"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { dummyGeneratedClips } from "@/lib/data/dummyGeneratedClips";
import type { GeneratedClip } from "@/lib/data/dummyGeneratedClips";
import { useState } from "react"; // Import useState
import { ShadCnButton } from "../shadcnButton";

const ClipBox = ({ imageSrc, step, duration, resolution }: GeneratedClip) => (
  <div className="w-full sm:w-[13.563rem] h-[18.938rem] flex flex-col mb-4 sm:mb-0">
    <div className="w-full h-[16.25rem] rounded-[1.5rem] bg-gray-200 opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative">
      <Image
        src={imageSrc || "/images/placeholder.png"}
        alt={step}
        width={217}
        height={260}
        className="object-cover w-full h-full"
      />
      <div className="absolute bottom-2 left-2 cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-full px-2.5 space-x-3 py-2 flex items-center text-sm">
        <Play className="h-4 w-4 fill-foreground" />
        <span className="text-foreground text-sm font-semibold">Play</span>
      </div>
    </div>
    <div className="w-full max-w-[13.563rem] h-[1.688rem] mt-4  flex flex-col opacity-100 rotate-0 space-y-2.5 items-start justify-center py-1">
      <div className="w-full font-sans font-semibold text-sm leading-[1] tracking-normal align-bottom text-foreground">
        {step}
      </div>
      <div className="w-full max-w-[13.563rem] h-[0.438rem] font-sans font-medium text-[0.625rem] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-white/40">
        {duration} • {resolution}
      </div>
    </div>
  </div>
);

const GeneratedClipsComponent = () => {
  const [showAll, setShowAll] = useState(false);

  // Determine how many clips to show initially (e.g., 3 for a typical row)
  const initialClipsToShow = 3;
  const clipsToDisplay = showAll
    ? dummyGeneratedClips
    : dummyGeneratedClips.slice(0, initialClipsToShow);

  // Check if the "See more" button should be displayed
  const shouldShowButton = dummyGeneratedClips.length > initialClipsToShow;

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full max-w-[43.188rem] bg-background space-y-6 ">
      <div className="flex items-center justify-start gap-[0.625rem] opacity-100 h-[2rem]">
        <span className="h-[0.625rem] font-sans font-semibold text-[0.875rem] leading-[1] tracking-normal align-bottom text-foreground">
          Generated clips
        </span>
        <div className="w-[2rem] h-[2rem] flex items-center justify-center gap-[0.625rem] rounded-full opacity-100 bg-gray-100 dark:bg-white/5 p-2">
          <span className="w-[0.5rem] h-[0.625rem] font-sans font-semibold text-[0.875rem] leading-[1] tracking-normal align-bottom text-foreground opacity-100">
            {dummyGeneratedClips.length}
          </span>
        </div>
      </div>
      {/* Changed from flex with sm:flex-row to a responsive grid */}
      <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-100">
        {clipsToDisplay.map((clip, idx) => (
          <div key={clip.step + idx} className="flex-1 min-w-0">
            <ClipBox {...clip} />
          </div>
        ))}
      </div>
      {shouldShowButton && (
        <ShadCnButton
          onClick={toggleShowAll}
          className="text-xs font-semibold text-foreground hover:bg-transparent rounded-full px-3 py-[0.625rem] dark:bg-[#1a1a1a] bg-black/10"
        >
          {showAll ? "See less" : "See more"}
        </ShadCnButton>
      )}
    </div>
  );
};

export default GeneratedClipsComponent;
