import { Play } from "lucide-react"
import Image from "next/image"

const SingleCombinedVideoComponent = () => {
  return (
    <div className="w-[453px] h-[337px] flex flex-col gap-[24px] opacity-100 max-w-full sm:w-[453px] sm:h-[337px] p-2">
      <div className="w-[453px] h-[10px] flex items-end sm:w-[453px] sm:h-[10px]">
        <span
          className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white"
          style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 600 }}
        >
          Single combined video
        </span>
      </div>
      <div className="w-[453px] h-[303px] flex flex-col gap-[16px] opacity-100 sm:w-[453px] sm:h-[303px]">
        <div className="w-[453px] h-[260px] rounded-[24px] opacity-100 overflow-hidden flex items-center justify-center relative sm:w-[453px] sm:h-[260px]">
          <Image
            src="/SCImage1.png"
            alt="Combined Video"
            width={453}
            height={260}
            className="object-cover w-full h-full"
          />
          <div
            className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] pt-[10px] pr-[12px] pb-[10px] pl-[10px] opacity-100 absolute backdrop-blur-md bg-black/40 dark:bg-black/40"
            style={{
              top: "208px",
              left: "16px",
              ...(typeof window !== 'undefined' && window.innerWidth < 640 ? { top: '120px' } : {})
            }}
          >
            <div className="w-4 h-4 flex items-center justify-center" style={{ position: "relative" }}>
              <Play className="text-white fill-white" />
            </div>
            {/* <div
              className="w-[27px] h-[10px] flex items-center justify-center ml-1"
              style={{
                borderRadius: "8px",
                padding: 0,
              }}
            > */}
              <span
                className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-center text-white"
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
        <div className="w-[453px] h-[27px] flex flex-col gap-[10px] opacity-100 sm:w-[453px] sm:h-[27px]">
          <div
            className="w-[453px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-900 dark:text-white sm:w-[453px] sm:h-[10px]"
            style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 600 }}
          >
            final_video_with_new_audio.mp4
          </div>
          <div
            className="w-[453px] h-[7px] font-sans font-medium text-[10px] leading-[1] tracking-normal align-bottom text-gray-500 dark:text-white/40 sm:w-[453px] sm:h-[7px]"
            style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 500 }}
          >
            0:26 sec • 720x1280
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCombinedVideoComponent
