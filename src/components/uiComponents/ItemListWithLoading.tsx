"use client";

import { useState, useEffect } from "react";
import ListItemSkeleton from "./ListItemSkeleton";
import ListItemComponent from "./ListItemComponent";
import { ShadCnButton } from "../ui/shadcnButton";

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
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center space-y-5">
      {isLoading ? <ListItemSkeleton /> : <ListItemComponent />}

      <ShadCnButton onClick={resetLoading}>reset</ShadCnButton>
    </div>
  );
}
