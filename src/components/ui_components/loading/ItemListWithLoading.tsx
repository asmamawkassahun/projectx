"use client";

import { useState, useEffect } from "react";
import ListItemSkeleton from "../link_list_item_component/ListItemSkeleton";
import ListItemComponent from "../link_list_item_component/ListItemComponent";
import { ShadCnButton } from "../../ui/shadcnButton";
import { LinkItem } from "@/types/linkItems";
import { BrowserCardSkeleton } from "../link_list_item_component/BrowserCardSkeleton";
import { BrowserCardContent } from "../link_list_item_component/BrowserCardContent";
import { dummyRecipes, Recipe } from "@/lib/data";

export default function LinksListWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<Recipe[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dummyRecipes);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

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

  return (
    <div className="min-h-screen p-8 bg-background text-foreground flex flex-col sm:flex-row  space-y-10 space-x-10">
      <div className="flex flex-col space-y-4">
        {isLoading ? (
          <ListItemSkeleton />
        ) : (
          <ListItemComponent linkItems={linkItems} />
        )}
        {isLoading ? (
          <BrowserCardSkeleton />
        ) : (
          <BrowserCardContent recipes={data} />
        )}
      </div>

      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
