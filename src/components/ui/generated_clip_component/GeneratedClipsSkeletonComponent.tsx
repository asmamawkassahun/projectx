import { Skeleton } from "@/components/ui/skeleton"
import { Play } from "lucide-react"

const GeneratedClipsSkeletonComponent = () => {
  return (
    <div className="w-[691px] h-[404px] flex flex-col gap-6 rotate-0 opacity-100 max-w-full sm:w-[691px] sm:h-[404px] p-2">
      {/* Header section (Generated clips and 7) */}
      <div className="flex items-center justify-start gap-[10px] rotate-0 opacity-100 sm:w-[147px] sm:h-[32px]">
        <span
          className="h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white"
          // style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          Generated clips
        </span>
        {/* <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] rounded-full p-[10px] opacity-100 bg-gray-100 dark:bg-white/5 sm:w-[32px] sm:h-[32px]"> */}
          <span
            className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white opacity-100"
            // style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
          >
            7
          </span>
        {/* </div> */}
      </div>

      {/* Skeleton main content */}
      <div className="w-[691px] h-[303px] flex gap-4 rotate-0 opacity-100 sm:flex-row flex-col sm:w-[691px] sm:h-[303px]">
        {/* Three skeleton boxes */}
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="w-[217px] h-[303px] flex flex-col items-center sm:w-[217px] sm:h-[303px] mb-2 sm:mb-0"
          >
            <div className="w-[217px] h-[260px] rounded-[24px] opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative sm:w-[217px] sm:h-[260px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
            }}
            >
              <Skeleton className="w-full h-full rounded-[24px]" />
              <div
                className="w-[73px] h-[32px] flex items-center rounded-[1000px] opacity-100 absolute backdrop-blur-md bg-black/40 dark:bg-black/40 sm:w-[73px] sm:h-[32px] left-3 bottom-3 sm:top-[216px] sm:left-[12px] sm:bottom-auto sm:right-auto"
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
                {/* <div
                  className="w-[27px] h-[10px] flex items-center justify-center"
                  style={{
                    borderRadius: "8px",
                    padding: 0,
                  }}
                > */}
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
                {/* </div> */}
              </div>
            </div>
            <div className="w-[193px] h-[32px] flex flex-col gap-2 mt-4 sm:w-[193px] sm:h-[32px]"
            >
              <Skeleton className="w-[193px] h-[10px] rounded-[100px] mb-1 sm:w-[193px] sm:h-[10px]" 
              style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
              }}
            />
              <Skeleton className="w-[39px] h-[10px] rounded-[100px] sm:w-[39px] sm:h-[10px]" 
              style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%)",
              }}
            />
            </div>
          </div>
        ))}
      </div>

      {/* See more button skeleton */}
      <div className="w-[85px] h-[29px] flex items-center justify-center gap-[10px] rotate-0 opacity-100 rounded-full pt-[10px] pr-[12px] pb-[10px] pl-[12px] bg-gray-100 dark:bg-white/5 sm:w-[85px] sm:h-[29px] mt-2">
        <span
          className="w-[61px] h-[9px] font-sans font-semibold text-[12px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white opacity-60 sm:w-[61px] sm:h-[9px]"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif" }}
        >
          See more
        </span>
      </div>
    </div>
  )
}

export default GeneratedClipsSkeletonComponent
