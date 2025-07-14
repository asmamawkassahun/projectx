import { File, ArrowDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const ArchivingTaskFilesSkeleton = () => {
  return (
    <div className="w-[335px] h-[119px] flex flex-col gap-[32px] opacity-100">
      <div
        className="font-sans font-bold text-[32px] leading-[1.1] tracking-normal text-gray-900 dark:text-white"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 700 }}
      >
        Archiving task files
      </div>
      <div
        className="w-[335px] h-[64px] flex items-center justify-between rounded-[100px] opacity-100 px-4 bg-gray-100 dark:bg-white/10"
        style={{ paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="w-[128px] h-[32px] flex items-center gap-[10px] opacity-100">
          {/* File icon box */}
          <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] opacity-100">
            <div className="w-[16px] h-[16px] flex items-center justify-center opacity-100 relative">
              <File
                className="w-[14px] h-[11px] text-gray-400 dark:text-gray-500"
                style={{ position: "absolute", top: "2.3px", left: "0.83px" }}
              />
            </div>
          </div>
          {/* File info box */}
          <div className="w-[86px] h-[32px] flex flex-col justify-between opacity-100 gap-1">
            <Skeleton className="w-[86px] h-[10px] rounded-[100px]" />
            <Skeleton className="w-[39px] h-[10px] rounded-[100px]" />
          </div>
        </div>
        <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full gap-[10px] opacity-100 p-[10px] bg-gray-200 dark:bg-white/20">
          <ArrowDown className="w-[14px] h-[16px] text-gray-400 dark:text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default ArchivingTaskFilesSkeleton
