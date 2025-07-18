import ArrowDownIcon from "@/components/common_components/svg_icons/ArrowDownIcon";
import FolderIcon from "@/components/common_components/svg_icons/FolderIcons";
import { ArchiveFile } from "@/types/archiveFile";
import { useTheme } from "next-themes";

const dummyFiles: ArchiveFile[] = [
  { name: "Calamansi.zip", size: "2.4 GB" },
  { name: "ProjectDocs.tar.gz jkdnskjndfjgskldfkm", size: "1.8 GB" },
  { name: "ArchiveData.rar", size: "3.2 GB" },
];

interface ArchivingTaskFilesComponentProps {
  file?: ArchiveFile;
}

const ArchivingTaskFilesComponent = ({
  file = dummyFiles[1],
}: ArchivingTaskFilesComponentProps) => {
  const { resolvedTheme } = useTheme();
  const iconColor: string = resolvedTheme === "dark" ? "#000000" : "#ffffff";

  return (
    <div className="w-full max-w-[20.938rem] flex flex-col space-y-[2rem]">
      <h2 className="font-bold text-[2rem] leading-[1.1] text-foreground">
        Archiving task files
      </h2>
      <div className="w-full max-w-[20.938rem] flex items-center justify-between rounded-full p-4 bg-black dark:bg-white">
        <div className="flex items-center space-x-2.5 max-w-[calc(100%-3rem)]">
          {/* File icon box */}
          <div className="p-2 flex-shrink-0">
            <FolderIcon color={iconColor} />
          </div>
          {/* File info box */}
          <div className="flex flex-col justify-between space-y-3 w-full min-w-0">
            <span className="font-sans font-semibold text-sm leading-[1] tracking-normal text-white dark:text-black truncate">
              {file.name}
            </span>
            <span className="font-sans font-semibold text-sm leading-[1] tracking-normal text-white dark:text-black">
              {file.size}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-full bg-white/10 dark:bg-gray-200  w-[2rem] h-[2rem] p-[0.625rem] flex-shrink-0">
          <ArrowDownIcon color={iconColor} />
        </div>
      </div>
    </div>
  );
};

export default ArchivingTaskFilesComponent;
