import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for the Map Card
function MapSkeleton() {
  return (
    <Skeleton className="relative w-full h-[12rem] rounded-3xl dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
  );
}

// Skeleton for a single School Card
function SchoolCardSkeleton() {
  return (
    <div className="flex items-start space-x-4 py-4 px-[1.125rem] rounded-xl dark:bg-[#1a1a1a] bg-black/10">
      <Skeleton className="w-[8.75rem] h-[6.125rem] flex-shrink-0 rounded-2xl dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-[0.6875rem] w-2/3 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-[0.6875rem] w-1/2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-[0.6875rem] w-16 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf] " />
        </div>

        <div className="flex space-x-2">
          <Skeleton className="h-[1.625rem] w-24 rounded-full  dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-[1.625rem] w-24 rounded-full  dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-[1.625rem] w-24 rounded-fullhidden sm:flex   dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
      </div>
      <Skeleton className="h-[1.6875rem] w-[1.6875rem] rounded-full  dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf] " />
    </div>
  );
}

export default function MapCardSkeleton() {
  return (
    <div className="w-full max-w-[43.0625rem] space-y-4">
      <div className="flex items-center space-x-4  dark:text-white text-black text-sm font-semibold">
        <span>Local results</span>
        <span className="w-8 h-8 rounded-full flex justify-center items-center bg-black/10 dark:bg-white/5">
          6
        </span>
      </div>
      <MapSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <SchoolCardSkeleton key={index} />
        ))}
      </div>
      {/* <div className="text-xs w-fit font-semibold text-foreground rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10">
        See more
      </div> */}
    </div>
  );
}
