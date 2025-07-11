import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ExternalLink } from "lucide-react";
const ListItemSkeleton = () => {
  return (
    <div className="w-full md:w-[43.0625rem] space-y-4 bg-[#000000] dark:bg-white">
      <div className="flex items-center justify-between w-20 text-white dark:text-black text-sm font-semibold">
        <span>Links</span>
        <span>6</span>
      </div>

      <div className="w-full space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white/10 dark:bg-black/10 rounded-full px-[1.125rem] py-4"
          >
            <div className="flex justify-between items-center space-x-8 md:space-x-0">
              <div className="space-x-3.5 flex items-center flex-1 max-w-[24.8125rem]">
                <ChevronDown className="text-white/40 dark:text-black/40 w-4 h-4 flex-shrink-0" />
                <Skeleton className="h-2.5 flex-1 bg-gradient-to-r from-[#313131] to-[#202020] dark:bg-gradient-to-r dark:from-[#3B3B3B] dark:to-[#2D2D2D40]" />
              </div>

              <div className="flex items-center gap-2 max-w-[5.875rem]">
                <Skeleton className="h-2.5 w-[4.375rem] bg-gradient-to-r from-[#313131] to-[#202020] dark:bg-gradient-to-r dark:from-[#3B3B3B] dark:to-[#2D2D2D40]" />
                <ExternalLink className="h-3.5 w-3.5 text-white/40 dark:text-black/40 flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListItemSkeleton;
