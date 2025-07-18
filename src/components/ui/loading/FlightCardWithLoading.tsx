"use client";

import { useState, useEffect } from "react";
import { ShadCnButton } from "../shadcnButton";
import { RefreshCcw } from "lucide-react";
import { FlightCardSkeleton } from "../flight_card_components/FlightCardSkeleton";
import { FlightCardContent } from "../flight_card_components/FlightCardContent";
import { flights } from "@/lib/data/dummyFlightData";

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
        <FlightCardContent flights={flights} />
      )}
      <ShadCnButton onClick={resetLoading} className="w-8  h-8 rounded-full">
        <RefreshCcw className="w-6 h-6" />
      </ShadCnButton>
    </div>
  );
}
