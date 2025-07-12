"use client";

import { useState, useEffect } from "react";
import ListItemSkeleton from "../link_list_item_component/ListItemSkeleton";
import ListItemComponent from "../link_list_item_component/ListItemComponent";
import { ShadCnButton } from "../../ui/shadcnButton";

export default function LinksListWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen p-8 bg-background text-foreground flex flex-col items-center justify-center space-y-5">
      {isLoading ? <ListItemSkeleton /> : <ListItemComponent />}

      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
