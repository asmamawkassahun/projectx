import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="w-full max-w-[689px] h-[166px] rounded-2xl dark:bg-[#1a1a1a] bg-black/10 flex flex-col justify-between p-6 shadow-lg mx-auto relative overflow-hidden">
      <div className="flex justify-between items-start w-full">
      
        <div className="flex flex-col items-start">
          <Skeleton className="w-12 h-3 mb-1 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="w-16 h-5 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
        <div className="flex flex-col items-center flex-1 mx-4 relative">
          <div className="relative w-full" style={{ height: 40 }}>
          
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 mt-2" style={{left: '0%', top: '50%', transform: 'translateY(-50%)'}}>
              <Skeleton className="w-8 h-2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
              <span className="w-2 h-2 bg-blue-200 rounded-full block opacity-40" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 mt-2" style={{right: '0%', top: '50%', transform: 'translateY(-50%)'}}>
              <span className="w-2 h-2 bg-blue-200 rounded-full block opacity-40" />
              <Skeleton className="w-8 h-2 rounded-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            </div>
          
            <img src="/flight-arc.svg" alt="flight arc" className="absolute left-0 right-0 mx-auto w-full h-[28px]" />
        
            <div className="absolute z-10" style={{left: '51.4%', top: 0, transform: 'translate(-50%, -50%)'}}>
              <img src="/plane.svg" alt="plane" width="21" height="17" />
            </div>
          </div>
          <Skeleton className="w-24 h-3 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf] -mt-4 mb-6" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="w-12 h-3 mb-1 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="w-16 h-5 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <div className="flex flex-col">
          <Skeleton className="w-10 h-3 mb-1 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          <Skeleton className="w-16 h-5 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ml-4 bg-black/10 dark:bg-[#232323]" />
        </div>
        <Skeleton className="w-24 h-4 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
      </div>
    </div>
  );
} 