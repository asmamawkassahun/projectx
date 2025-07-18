"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown, ExternalLink, Play } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ShadCnButton } from "../shadcnButton";
import Image from "next/image";
import type { ListItemComponentProps } from "@/types/linkItems";
import Link from "next/link";

const ListItemComponent = ({ linkItems }: ListItemComponentProps) => {
  console.log(linkItems);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="w-full  space-y-4 bg-background text-foreground">
      <div className="flex items-center justify-between w-20 text-sm font-semibold">
        <span>Links</span>
        <span>{linkItems.length}</span>
      </div>

      <div className="w-full space-y-2">
        {linkItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "dark:bg-[#1a1a1a] bg-black/10 px-[1.125rem] py-3 transition-all duration-200 rounded-3xl"
            )}
          >
            <Collapsible
              open={openItems.has(item.id)}
              onOpenChange={() => toggleItem(item.id)}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <ShadCnButton
                  variant="ghost"
                  className="w-full text-left hover:bg-transparent p-0 h-auto min-h-0 flex items-start justify-between gap-3"
                >
                  {/* Left side - Icon and Question */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 flex-shrink-0 mt-0.5",
                        openItems.has(item.id) && "rotate-180"
                      )}
                    />
                    <span className="font-semibold text-base flex-1 break-words whitespace-normal leading-relaxed">
                      {item.question}
                    </span>
                  </div>

                  {/* Right side - Source and External Link */}
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 flex-shrink-0 mt-0.5"
                  >
                    <span className="text-xs font-medium whitespace-nowrap">
                      {item.source}
                    </span>
                    <div
                      aria-label={`Open external link for ${item.question}`}
                      className="flex-shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </ShadCnButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="pl-[1.875rem] pr-4 py-4">
                {typeof item.content === "string" ? (
                  <div className="font-medium text-sm leading-relaxed">
                    {item.content}
                  </div>
                ) : (
                  item.content?.type === "images" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {item.content.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative rounded-3xl overflow-hidden aspect-[197.33/160]"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-3xl"
                          />
                          <div className="absolute bottom-2 left-2 bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-full px-2.5 space-x-3 py-2 flex items-center text-sm">
                            <Play className="h-4 w-4 fill-foreground" />
                            <span className="text-foreground text-sm font-semibold">
                              Play
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListItemComponent;
