import { Play } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const SingleCombinedVideoSkeleton = () => {
  return (
    <div className="w-[453px] h-[337px] flex flex-col gap-[24px] opacity-100">
      <div className="w-[453px] h-[10px] flex items-end">
        <span
          className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 600 }}
        >
          Single combined video
        </span>
      </div>
      <div className="w-[453px] h-[303px] flex flex-col gap-[16px] opacity-100">
        <div className="w-[453px] h-[260px] rounded-[24px] opacity-100 overflow-hidden flex items-center justify-center relative">
          <Skeleton className="w-full h-full rounded-[24px]" />
          <div
            className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] opacity-100 absolute bg-gray-300 dark:bg-gray-600"
            style={{
              top: "208px",
              left: "16px",
              paddingTop: 10,
              paddingRight: 12,
              paddingBottom: 10,
              paddingLeft: 10,
              gap: 8,
            }}
          >
            <div className="w-4 h-4 flex items-center justify-center" style={{ position: "relative" }}>
              <Play className="text-gray-500 dark:text-gray-400 fill-gray-500 dark:fill-gray-400" />
            </div>
            <div
              className="w-[27px] h-[10px] flex items-center justify-center ml-1"
              style={{
                borderRadius: "8px",
                padding: 0,
              }}
            >
              <span
                className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-gray-400"
                style={{
                  fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
                  width: "27px",
                  height: "10px",
                  display: "inline-block",
                  lineHeight: "1",
                  verticalAlign: "bottom",
                }}
              >
                Play
              </span>
            </div>
          </div>
        </div>
        <div className="w-[453px] h-[27px] flex flex-col gap-[10px] opacity-100">
          <Skeleton className="w-[193px] h-[10px] rounded-[100px]" />
          <Skeleton className="w-[39px] h-[10px] rounded-[100px] mt-1" />
        </div>
      </div>
    </div>
  )
}

export default SingleCombinedVideoSkeleton
