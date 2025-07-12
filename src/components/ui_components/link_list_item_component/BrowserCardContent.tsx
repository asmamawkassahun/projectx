import { useState } from "react";
import Image from "next/image";
import { Globe, Maximize2, Minimize2 } from "lucide-react";
import { Recipe } from "@/lib/data";
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
        // Remove fixed height for the container to allow flexibility
        "rounded-[1rem] p-2.5 space-y-2.5 dark:bg-[#1a1a1a] bg-black/10",
        isMaximized ? "w-full" : "w-full max-w-[20.9375rem]"
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
      <div className="flex-1 rounded-xl w-full bg-background">
        <Image
          src="/images/browserCardResult.svg"
          width={isMaximized ? 1200 : 315} // Dynamic width
          height={isMaximized ? 400 : 202} // Dynamic height for maximized state
          alt="live"
          className="w-full h-auto object-cover" // Use h-auto to maintain aspect ratio
        />
      </div>
    </div>
  );
}
