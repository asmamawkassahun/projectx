"use client";

import { useState, useEffect } from "react";
import ListItemSkeleton from "../link_list_item_component/ListItemSkeleton";
import ListItemComponent from "../link_list_item_component/ListItemComponent";
import { ShadCnButton } from "../../ui/shadcnButton";
import { LinkItem } from "@/types/linkItems";
import { BrowserCardSkeleton } from "../link_list_item_component/BrowserCardSkeleton";
import { BrowserCardContent } from "../link_list_item_component/BrowserCardContent";
import { dummyRecipes, Recipe } from "@/lib/data";
import { RefreshCcw } from "lucide-react";
import { linkItems } from "@/lib/data/dummyLinkItems";

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


  return (
    <div className="p-8 bg-background text-foreground flex flex-col sm:flex-row  space-y-10 space-x-10">
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

      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>
    </div>
  );
}
