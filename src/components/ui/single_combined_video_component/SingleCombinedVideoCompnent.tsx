import { SingleCombinedVideo } from "@/lib/data/dummySingleCombinedVideo";
import { Play } from "lucide-react";
import Image from "next/image";

interface SingleCombinedVideoComponentProps {
  video: SingleCombinedVideo;
}

const SingleCombinedVideoComponent = ({
  video,
}: SingleCombinedVideoComponentProps) => {
  return (
    <div className="w-full h-[21.063rem] flex flex-col space-y-6 sm:w-[28.313rem]">
      <div className=" flex items-end ">
        <span
          className="font-sans font-semibold text-sm leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white"
          style={{
            fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
            fontWeight: 600,
          }}
        >
          Single combined video
        </span>
      </div>
      <div className="w-full h-[18.938rem] flex flex-col space-y-4 opacity-100 sm:w-[28.313rem]">
        <div className="w-full h-[16.25rem] rounded-3xl opacity-100 overflow-hidden flex items-center justify-center relative sm:w-[28.313rem] sm:h-[16.25rem]">
          <Image
            src={video.thumbnail || "/image/placeholder.png"}
            alt={video.fileName}
            width={453}
            height={260}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-[0.5rem] left-[0.5rem] cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-full px-[0.625rem] space-x-3 py-[0.5rem] flex items-center text-sm">
            <Play className="h-4 w-4 fill-foreground" />
            <span className="text-foreground text-sm font-semibold">Play</span>
          </div>
        </div>
        <div className="flex flex-col gap-[0.625rem] opacity-100">
          <div
            className=" font-sans font-semibold text-[0.875rem] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white "
            style={{
              fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
              fontWeight: 600,
            }}
          >
            {video.fileName}
          </div>
          <div
            className="font-sans font-medium text-[0.625rem] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-white/40 "
            style={{
              fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
              fontWeight: 500,
            }}
          >
            {video.duration} • {video.resolution}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCombinedVideoComponent;
