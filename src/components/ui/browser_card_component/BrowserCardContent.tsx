"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrowserCardContentProps {
  recipes: Recipe[];
}

export function BrowserCardContent({ recipes }: BrowserCardContentProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-2.5 space-y-2.5 dark:bg-[#1a1a1a] bg-black/10 w-full",
        // Use responsive width constraints instead of fixed width
        isMaximized ? "w-full" : "w-full sm:max-w-[20.9375rem]"
      )}
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-foreground" />
          <span className="text-xs font-semibold text-foreground">
            foodnetwork
          </span>
        </div>
        <button onClick={toggleMaximize} className="focus:outline-none">
          {isMaximized ? (
            <Minimize2 className="h-4 w-4 text-foreground" />
          ) : (
            <Maximize2 className="h-4 w-4 text-foreground" />
          )}
        </button>
      </div>

      <div className="flex-1 rounded-xl w-full bg-background overflow-hidden">
        <div
          className={cn(
            "relative w-full",
            // Maintain aspect ratio using padding-bottom technique
            isMaximized ? "aspect-[3/1]" : "aspect-[315/202]"
          )}
        >
          <Image
            src="/images/browserCardResult.svg"
            alt="live"
            fill
            className="object-cover"
            sizes={
              isMaximized ? "100vw" : "(max-width: 640px) 100vw, 20.9375rem"
            }
          />
        </div>
      </div>
    </div>
  );
}
