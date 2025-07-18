"use client";
import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import HotelsCardSkeleton from "../hotel_components/HotelsCardSkeleton";
import HotelsCardContent from "../hotel_components/HotelsCardContent";
import { ShadCnButton } from "../shadcnButton";
import { sampleHotels } from "@/lib/data/dummyHotelDate";

const HotelsCardLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds initially
    return () => clearTimeout(timer);
  }, []);

  const resetLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show skeleton for 2 seconds on refresh
  };

  return (
    <div className="w-full py-8 bg-background flex justify-center">
      {isLoading ? (
        <HotelsCardSkeleton />
      ) : (
        <HotelsCardContent hotels={sampleHotels} totalResults={2} />
      )}
      <ShadCnButton
        onClick={resetLoading}
        className="w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700"
      >
        <RefreshCcw className="w-4 h-4" />
      </ShadCnButton>
    </div>
  );
};

export default HotelsCardLoading;
