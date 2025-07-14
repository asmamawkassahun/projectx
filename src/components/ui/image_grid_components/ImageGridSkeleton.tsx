import { Skeleton } from "@/components/ui/skeleton"

export default function ImageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" style={{ width: "691px", height: "442px" }}>
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-[202px] h-[134px] rounded-3xl
            bg-[linear-gradient(90deg,rgba(59,59,59,0.1)_0%,rgba(45,45,45,0.025)_100%)]
            dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.025)_100%)]"
        />
      ))}
    </div>
  )
}
