"use client";
import React, { useEffect, useState } from "react";
import MapCardSkeleton from "../map_card_components/MapCardSkeleton";
import MapCardContent from "../map_card_components/MapCardContent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";

const MapCardLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const sampleSchools = [
    {
      id: "1",
      name: "M225 Ella Baker School",
      rating: 4.8,
      reviews: 6,
      address: "317 E 67th St",
      imageUrl: "/images/Image1.png",
      websiteUrl: "#",
      directionsUrl: "#",
      phone: "(212) 717-8809",
      indicator: "B",
    },
    {
      id: "2",
      name: "The Town School",
      rating: 5,
      reviews: 6,
      address: "540 E 76th St",
      hours: "Closed • Opens 7:30 AM",
      imageUrl: "/images/Image2.png",
      websiteUrl: "#",
      directionsUrl: "#",
      phone: "(212) 288-4383",
      indicator: "C",
    },
  ];
  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const mapLocationQuery = "New York, NY"; // Example location query

  return (
    <div className="w-full flex  justify-center bg-background p-4">
      {isLoading ? (
        <MapCardSkeleton />
      ) : (
        <MapCardContent
          schools={sampleSchools}
          mapQuery={mapLocationQuery}
          totalResults={2}
        />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
};

export default MapCardLoading;
