import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Maximize2 } from "lucide-react";

export function BrowserCardSkeleton() {
  return (
    <div className="w-full max-w-[20.9375rem] h-[16.25rem] rounded-[1rem] p-2.5 space-y-2.5 dark:bg-[#1a1a1a] bg-black/10 ">
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center space-x-2">
          <Globe className="dark:text-white/40 text-black/40 w-4 h-4 flex-shrink-0" />
          <Skeleton className="h-2.5 w-[4.375rem] dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
        <Maximize2 className="h-3.5 w-3.5 dark:text-white/40 text-black/40 flex-shrink-0" />
      </div>
      <div className="flex-1 rounded-xl w-full">
        <Skeleton className="h-[12.625rem] dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      </div>
    </div>
  );
}
