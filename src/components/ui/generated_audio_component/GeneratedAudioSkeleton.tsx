import {
  ArrowDown,
  AudioLines,
  BarChartIcon as ChartNoAxesColumn,
  Play,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const GeneratedAudioSkeleton = () => {
  return (
    <div className="w-full max-w-[24.3125rem] flex flex-col space-y-4 opacity-100">
      {/* Leave the header as it is, do not skeletonize */}
      <div className="w-[11.375rem] space-x-4 flex items-center justify-between opacity-100">
        <span
          className="font-sans font-semibold text-sm leading-[1] tracking-normal text-foreground"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          Generated audio
        </span>
        <div className="w-8 h-8 flex items-center justify-center  rounded-full opacity-100 bg-gray-100 dark:bg-white/10">
          <span
            className="font-sans font-semibold text-sm leading-[1] p-3 tracking-normal text-foreground opacity-100"
            style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
          >
            2
          </span>
        </div>
      </div>

      <div className="w-full max-w-[24.3125rem] flex flex-col space-y-2.5  opacity-100">
        {[0, 1].map((_, idx) => (
          <div
            key={idx}
            className="w-full flex justify-between items-center rounded-full p-4 opacity-100 bg-gray-100 dark:bg-white/10"
          >
            <div className="flex space-x-2.5 items-center opacity-100">
              <div className="p-3">
                <AudioLines className="text-foreground/40 w-6 h-6 " />
              </div>
              <div className="space-y-2 flex flex-col justify-between opacity-100">
                <Skeleton className="w-[12.0625rem] h-2.5 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
                <Skeleton className="w-[2.4375rem] h-2.5 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
              </div>
            </div>
            <div className="flex items-center space-x-2.5 opacity-100">
              <div className="w-8 h-8 flex items-center justify-center rounded-full p-2.5 opacity-100 bg-gray-200 dark:bg-white/10">
                <div className="w-4 h-4 flex items-center justify-center opacity-100">
                  <ArrowDown className="text-foreground/40" />
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full p-2.5 opacity-100 bg-gray-200 dark:bg-white/10">
                <div className="w-4 h-4 flex items-center justify-center opacity-100">
                  <Play className="text-foreground/40 fill-gray-400 dark:fill-gray-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedAudioSkeleton;
