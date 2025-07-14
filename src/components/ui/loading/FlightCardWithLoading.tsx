"use client";

import { useState, useEffect } from "react";
import GeneratedClipsSkeletonComponent from "../generated_clip_component/GeneratedClipsSkeletonComponent";
import GeneratedClipsComponent from "../generated_clip_component/GeneratedClipsComponent";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";
import { FlightCardSkeleton } from "../flight_card_components/FlightCardSkeleton";
import { FlightCardContent } from "../flight_card_components/FlightCardContent";

export default function FlightCardWithLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    <div className="w-full p-8 bg-background flex justify-center">
      {isLoading ? (
        <FlightCardSkeleton />
      ) : (
        <FlightCardContent departureTime="3:20 pm"
        arrivalTime="5:50 pm"
        departureCity="DXB"
        arrivalCity="BKK"
        departureDate="Mon, Aug 11"
        arrivalDate="Mon, Aug 11"
        duration="6h 45m"
        price="$1920.00"
        airlineLogo="/emirates-logo.png" // update with your logo path
        airlineName="Emirates"
        bookingUrl="https://emirates.com" />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>{" "}
    </div>
  );
}
