"use client";
import React, { useEffect, useState } from "react";
import MapCardSkeleton from "../map_card_components/MapCardSkeleton";
import MapCardContent from "../map_card_components/MapCardContent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";
import { LocalResultType } from "@/types/localResult";
import { localMapData } from "@/lib/data/dummyLocalMapData";

const MapCardLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full flex  justify-center bg-background p-4">
      {isLoading ? (
        <MapCardSkeleton />
      ) : (
        <MapCardContent
          localPlaces={localMapData.local_results.places}
          mapData={localMapData.local_map}
        />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>
    </div>
  );
};

export default MapCardLoading;
