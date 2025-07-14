import { File, ArrowDown, Folder } from "lucide-react";

const ArchivingTaskFilesComponent = () => {
  return (
    <div className="w-[335px] h-[119px] flex flex-col gap-[32px] opacity-100 max-w-full sm:w-[335px] sm:h-[119px] p-2">
      <div className="font-sans font-bold text-[32px] leading-[1.1] tracking-normal text-gray-900 dark:text-white">
        Archiving task files
      </div>
      <div
        className="w-[335px] h-[64px] flex items-center justify-between rounded-[100px] opacity-100 px-4 bg-black dark:bg-white sm:w-[335px] sm:h-[64px] "
        style={{ paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="w-[128px] h-[32px] flex items-center gap-[10px] opacity-100 sm:w-[128px] sm:h-[32px] ">
          {/* File icon box */}
          <div className="flex items-center justify-center gap-[10px] opacity-100 w-8 h-8">
            <div className=" flex items-center justify-center opacity-100 relative ">
              <Folder className="w-6 h-6 text-white dark:text-black" />
            </div>
          </div>
          {/* File info box */}
          <div className="w-[86px] h-[32px] flex flex-col justify-between opacity-100 sm:w-[86px] sm:h-[32px]">
            <div
              className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white dark:text-black sm:w-[86px] sm:h-[16px] w-full h-auto"
              style={{
                fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
                fontWeight: 600,
              }}
            >
              Calamansi.zip
            </div>
            <div
              className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-middle text-white dark:text-black sm:w-[86px] sm:h-[16px] w-full h-auto"
              style={{
                fontFamily: "Neue Haas Grotesk Display Pro, sans-serif",
                fontWeight: 600,
              }}
            >
              2.4 GB
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-full gap-[10px] opacity-100  bg-gray-200 dark:bg-gray-200 sm:w-[32px] sm:h-[32px] w-8 h-8 p-2.5">
          <ArrowDown className="w-[14px] h-[16px] text-black dark:text-black" />
        </div>
      </div>
    </div>
  );
};

export default ArchivingTaskFilesComponent;
