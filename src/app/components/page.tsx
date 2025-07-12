import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import LinksListWithLoading from "@/components/ui_components/loading/ItemListWithLoading";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <ThemeToggle />
      <LinksListWithLoading />
    </div>
  );
};

export default page;
