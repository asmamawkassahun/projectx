import Image from "next/image";
import { Play, CheckCircle, CircleCheck } from "lucide-react";
import { ShadCnButton } from "@/components/ui/shadcnButton";
import { Video } from "@/lib/data/dummyVideos";

interface VideoCardContentProps {
  videos: Video[];
  totalVideos: number;
}

export function VideoCardContent({
  videos,
  totalVideos,
}: VideoCardContentProps) {
  return (
    <div className="w-full max-w-[43.1875rem] space-y-6">
      <div className="flex items-center justify-between w-[5.6875rem] dark:text-white text-black text-sm font-semibold">
        <span>Videos</span>
        <span>{totalVideos}</span>
      </div>
      <div className="flex space-x-5 overflow-x-auto">
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-[13.5625rem] space-y-4 flex-shrink-0"
          >
            {/* Top bar and avatar */}
            <div className="flex items-center space-x-2.5">
              <Image
                // src={video.channelAvatar}
                src={"/placeholder1.svg"}
                alt={video.channelName}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover"
              />
              <div className="space-x-1 flex items-center">
                <p className="text-sm font-semibold text-foreground opacity-50 truncate">
                  {video.channelName}
                </p>
                {video.verified && (
                  <CircleCheck className="bg-foreground text-background opacity-50 rounded-full w-4 h-4" />
                )}
              </div>
            </div>
            {/* Video area */}
            <div className="relative rounded-2xl overflow-hidden w-full aspect-[217/160] min-h-[8rem]">
              <Image
                // src={video.thumbnail}
                src={"/placeholder1.svg"}
                alt={video.title}
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              {/* Play button */}
              <div className="absolute bottom-2 left-2 cursor-pointer bg-white/40  dark:bg-black/40 backdrop-blur-lg rounded-full px-2.5 space-x-3 py-2 flex items-center  text-sm">
                <Play className="h-4 w-4 fill-foreground" />
                <span className="text-foreground text-sm font-semibold">
                  Play
                </span>
              </div>
            </div>
            {/* Bottom details */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {video.duration} • {video.views} • {video.uploadedAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ShadCnButton className="text-xs font-semibold text-foreground rounded-full hover:bg-transparent px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10">
        See more
      </ShadCnButton>
    </div>
  );
}
