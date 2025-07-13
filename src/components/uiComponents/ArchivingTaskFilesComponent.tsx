import { File, ArrowDown } from "lucide-react"

const ArchivingTaskFilesComponent = () => {
  return (
    <div className="w-[335px] h-[119px] flex flex-col gap-[32px] opacity-100">
      <div
        className="font-sans font-bold text-[32px] leading-[1.1] tracking-normal text-gray-900 dark:text-white"
        style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 700 }}
      >
        Archiving task files
      </div>
      <div
        className="w-[335px] h-[64px] flex items-center justify-between rounded-[100px] opacity-100 px-4 bg-black dark:bg-white"
        style={{ paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="w-[128px] h-[32px] flex items-center gap-[10px] opacity-100">
          {/* File icon box */}
          <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] opacity-100">
            <div className="w-[16px] h-[16px] flex items-center justify-center opacity-100 relative">
              <File
                className="w-[14px] h-[11px] text-white dark:text-black"
                style={{ position: "absolute", top: "2.3px", left: "0.83px" }}
              />
            </div>
          </div>
          {/* File info box */}
          <div className="w-[86px] h-[32px] flex flex-col justify-between opacity-100">
            <div
              className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white dark:text-black"
              style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 600 }}
            >
              Calamansi.zip
            </div>
            <div
              className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-middle text-white dark:text-black"
              style={{ fontFamily: "Neue Haas Grotesk Display Pro, sans-serif", fontWeight: 600 }}
            >
              2.4 GB
            </div>
          </div>
        </div>
        <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full gap-[10px] opacity-100 p-[10px] bg-gray-200 dark:bg-gray-200">
          <ArrowDown className="w-[14px] h-[16px] text-black dark:text-black" />
        </div>
      </div>
    </div>
  )
}

export default ArchivingTaskFilesComponent
