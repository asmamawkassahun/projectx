import { Card, CardContent } from "@/components/ui/card";
import { ShadCnButton } from "@/components/ui/shadcnButton";
import { Skeleton } from "@/components/ui/skeleton";

export function IngredientsCardSkeleton() {
  return (
    <div className="w-full max-w-[35.75rem] space-y-6 bg-background">
      <h2 className="text-xl font-semibold leading-[135%] text-foreground">
        Ingredients
      </h2>
      <div className="space-y-4">
        <Card className="dark:bg-[#1a1a1a] bg-black/10 border-none p-3">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-1/2 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-2/3 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          </CardContent>
        </Card>
        <Card className="dark:bg-[#1a1a1a] bg-black/10 border-none p-3">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-full dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-5/6 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-3/4 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-2/3 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-1/2 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-2/5 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-3/5 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
            <Skeleton className="h-4 w-1/3 dark:bg-gradient-to-r dark:from-[#313131] dark:to-[#202020] bg-gradient-to-r from-[#c9c9c9] to-[#dfdfdf]" />
          </CardContent>
        </Card>
      </div>
      <ShadCnButton className="text-xs font-semibold text-foreground rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10">
        See more
      </ShadCnButton>
    </div>
  );
}
