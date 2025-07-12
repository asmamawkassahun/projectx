"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";
import { ShadCnButton } from "../../ui/shadcnButton";
import Image from "next/image";
interface LinkItem {
  id: string;
  question: string;
  source: string;
  content?: string | { type: "images"; images: { src: string; alt: string }[] };
}

const linkItems: LinkItem[] = [
  {
    id: "1",
    question: "What Is Calamansi?",
    source: "foodnetwork",
    content:
      "Calamansi is a citrus fruit native to the Philippines and other parts of Southeast Asia. It's small, round, and has a thin green or orange skin when ripe.",
  },
  {
    id: "2",
    question: "What Is Calamansi And How Do You Cook With It?",
    source: "rezelkealoha",
    content: {
      type: "images",
      images: [
        {
          src: "/placeholder1.svg?height=120&width=120",
          alt: "Calamansi dish 1",
        },
        {
          src: "/placeholder1.svg?height=120&width=120",
          alt: "Calamansi dish 2",
        },
        {
          src: "/placeholder1.svg?height=120&width=120",
          alt: "Calamansi dish 3",
        },
      ],
    },
  },
  {
    id: "3",
    question: "Harvested a lot of calamansi(Philippine lemon or lime) this ",
    source: "reddit",
    content:
      "Many people harvest calamansi and use them for juice, preserves, or cooking. They can be stored in the refrigerator or processed into juice concentrate.",
  },
];
const ListItemComponent = () => {
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
    <div className="w-full md:w-[43.0625rem] space-y-4 bg-black">
      <div className="flex items-center justify-between w-20 text-white text-sm font-semibold">
        <span>Links</span>
        <span>{linkItems.length}</span>
      </div>

      <div className="w-full space-y-2">
        {linkItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-white/10 dark:bg-black/10 px-[1.125rem] py-2 transition-all duration-200",
              openItems.has(item.id) ? "rounded-3xl" : "rounded-3xl"
            )}>
            <Collapsible
              open={openItems.has(item.id)}
              onOpenChange={() => toggleItem(item.id)}
              className="w-full">
              <CollapsibleTrigger asChild>
                <ShadCnButton
                  variant="ghost"
                  className="w-full text-left hover:bg-transparent p-0 flex items-center justify-between space-x-3">
                  {/* Left side - Icon and Question (with proper truncation) */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-white transition-transform duration-200 flex-shrink-0",
                        openItems.has(item.id) && "rotate-180"
                      )}
                    />
                    <span className="text-white font-semibold text-base flex-1 truncate min-w-0">
                      {item.question}
                    </span>
                  </div>

                  {/* Right side - Source and External Link */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-white whitespace-nowrap">
                      {item.source}
                    </span>
                    <ExternalLink
                      onClick={(e) => e.stopPropagation()}
                      className="h-3.5 w-3.5 text-white"
                    />
                  </div>
                </ShadCnButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="pl-[1.875rem] pr-4 py-4">
                {typeof item.content === "string" ? (
                  <div className="text-white font-medium text-sm leading-relaxed">
                    {item.content}
                  </div>
                ) : (
                  item.content?.type === "images" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                      {item.content.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative rounded-3xl overflow-hidden  aspect-[197.33/160]">
                          <Image
                            src={"/placeholder1.svg"}
                            alt={image.alt}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-3xl"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 rounded-full px-3 py-1 flex items-center gap-1 text-white text-sm">
                            <Play className="h-4 w-4 fill-white" />
                            <span>Play</span>
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
