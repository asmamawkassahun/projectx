import { File, ArrowDown, Folder } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FolderIcon from "@/components/common_components/svg_icons/FolderIcons";
import ArrowDownIcon from "@/components/common_components/svg_icons/ArrowDownIcon";
import { useTheme } from "next-themes";

const ArchivingTaskFilesSkeleton = () => {
  const { resolvedTheme } = useTheme();
  const iconColor = resolvedTheme === "dark" ? "#00000040" : "#ffffff40";
  return (
    <div className="w-full max-w-[20.938rem] flex flex-col space-y-[2rem] ">
      <h2 className="font-bold text-[2rem] leading-[1.1] text-foreground">
        Archiving task files
      </h2>
      <div className="w-full rounded-full flex justify-between items-center p-4 dark:bg-gray-100 bg-black">
        <div className="flex items-center space-x-2.5">
          <div className="p-2">
            <FolderIcon color={iconColor} />
          </div>
          <div className="w-[5.375rem] h-[2rem] flex flex-col justify-between opacity-100 space-y-3">
            <Skeleton className="w-[5.375rem] h-2.5 rounded-full bg-gradient-to-r from-[#313131] to-[#202020]  dark:bg-gradient-to-r  dark:from-[#c9c9c9]  dark:to-[#dfdfdf]" />
            <Skeleton className="w-[2.438rem] h-2.5 rounded-full bg-gradient-to-r from-[#313131] to-[#202020]  dark:bg-gradient-to-r  dark:from-[#c9c9c9]  dark:to-[#dfdfdf]" />
          </div>
        </div>
        <div className="flex items-center justify-center rounded-full gap-[0.625rem] opacity-100  bg-white/10 dark:bg-gray-200 sm:w-[2rem] sm:h-[2rem] w-2rem h-2rem p-[0.625rem]">
          <ArrowDownIcon className="w-[0.875rem] h-[2rem]" color={iconColor} />
        </div>
      </div>
    </div>
  );
};

export default ArchivingTaskFilesSkeleton;
