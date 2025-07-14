import { AudioItem } from "@/types/generatedAudio";
import {
  ArrowDown,
  AudioLines,
  BarChartIcon as ChartNoAxesColumn,
  Play,
} from "lucide-react";

// Define the props type for the component
interface GeneratedAudioComponentProps {
  audioItems: AudioItem[];
}

const GeneratedAudioComponent = ({
  audioItems,
}: GeneratedAudioComponentProps) => {
  return (
    <div className="w-full max-w-[24.3125rem] flex flex-col space-y-4 opacity-100">
      <div className="w-[11.375rem] space-x-4 flex items-center justify-between opacity-100">
        <span
          className="font-sans font-semibold text-sm leading-[1] tracking-normal text-foreground"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          Generated audio
        </span>
        <div className="w-8 h-8 flex items-center justify-center rounded-full opacity-100 bg-gray-100 dark:bg-white/10">
          <span
            className="font-sans font-semibold text-sm leading-[1] p-3 tracking-normal text-foreground opacity-100"
            style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
          >
            {audioItems.length}
          </span>
        </div>
      </div>

      <div className="w-full max-w-[24.3125rem] flex flex-col space-y-2.5 opacity-100">
        {audioItems.map((item, index) => (
          <div
            key={index}
            className="w-full flex justify-between items-center rounded-full p-4 opacity-100 bg-gray-100 dark:bg-white/10"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-3">
                <AudioLines className="text-foreground w-6 h-6" />
              </div>
              <div className="flex flex-col flex-1 space-y-2.5 justify-between opacity-100">
                <h3 className="font-semibold text-base text-foreground">
                  {item.title}
                </h3>
                <span className="font-semibold text-sm text-foreground">
                  {item.size}
                </span>
              </div>
            </div>
            <div className=" flex items-center gap-[10px] opacity-100">
              <div className="w-8 h-8 flex items-center justify-center rounded-full p-2.5 opacity-100 bg-gray-200 dark:bg-white/10">
                <div className="w-4 h-6 flex items-center justify-center opacity-100">
                  <ArrowDown className="text-foreground" />
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full p-2.5 opacity-100 bg-gray-200 dark:bg-white/10">
                <div className="w-4 h-4 flex items-center justify-center opacity-100">
                  <Play className="text-foreground fill-gray-700 dark:fill-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedAudioComponent;
