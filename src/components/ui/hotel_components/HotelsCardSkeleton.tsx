import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for a single Hotel Card
function HotelItemSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="relative w-full aspect-[300/200] overflow-hidden px-4">
        <Skeleton className="w-full h-full rounded-xl dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      </div>
      <div className="px-4 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/2 rounded-md dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-5 w-1/4 rounded-md dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
        <div className="flex justify-between items-baseline pt-2">
          <Skeleton className="h-5 w-1/4 rounded-md dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="h-4 w-1/6 rounded-md dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
      </div>
    </div>
  );
}

const HotelsCardSkeleton = () => {
  return (
    <div className="w-full max-w-[43.0625rem] space-y-4">
      <div className="flex items-center space-x-4  dark:text-white text-black text-sm font-semibold">
        <span>Hotels</span>
        <span>6</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <HotelItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default HotelsCardSkeleton;
