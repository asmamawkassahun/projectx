import Image from "next/image";
import { Globe, Maximize2 } from "lucide-react";
import { Recipe } from "@/lib/data";

interface BrowserCardContentProps {
  recipes: Recipe[];
}

export function BrowserCardContent({ recipes }: BrowserCardContentProps) {
  return (
    <div className="w-full max-w-[20.9375rem] h-[16.25rem] rounded-[1rem] p-2.5 space-y-2.5 dark:bg-[#1a1a1a] bg-black/10 ">
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-foreground" />
          <span className="text-xs font-semibold text-foreground">
            foodnetwork
          </span>
        </div>
        <Maximize2 className="h-4 w-4 text-foreground" />
      </div>
      <div className="flex-1 rounded-xl w-full bg-background">
        <Image
          src={"/images/browserCardResult.svg"}
          width={315}
          height={202}
          alt="live"
        />
      </div>
    </div>
  );
}
