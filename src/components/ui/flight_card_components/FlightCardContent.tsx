"use client";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Flight } from "@/types/flight";
import { ShadCnButton } from "../shadcnButton";
import { useState } from "react";

export function FlightCardContent({ flights }: { flights: Flight[] }) {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 2; // Number of flights to show initially
  const shouldShowButton = flights.length > initialDisplayCount;
  const displayedFlights = showAll
    ? flights
    : flights.slice(0, initialDisplayCount);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[43.1875rem] space-y-6">
      <div className="flex items-center space-x-4 dark:text-white text-black text-sm font-semibold">
        <span>Flights</span>
        <span>{flights.length}</span>
      </div>
      {displayedFlights.map((flight) => (
        <div className="w-full h-[10.375rem] rounded-2xl dark:bg-[#1a1a1a] bg-black/10 flex flex-col px-5 py-6 space-y-6 shadow-lg mx-auto relative overflow-hidden">
          <div className="flex justify-between items-start w-full">
            {/* Departure */}
            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs font-normal text-foreground/60 ">
                {flight.departure.date}
              </span>
              <span className="text-xl leading-[135%] font-medium text-foreground">
                {flight.departure.time}
              </span>
            </div>
            {/* Flight Path with Cities, Dots, Airplane, and Duration */}
            <div className="flex flex-col items-center flex-1 mx-4 relative">
              <div className="relative w-full" style={{ height: 60 }}>
                {/* Left City & Dot */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:mt-[0.6rem]  z-10  "
                  style={{
                    left: "0%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span className="text-[12px] leading-[100%] font-normal text-foreground/80">
                    {flight.departure.airport}
                  </span>
                  <span className="w-1 h-1 bg-blue-200 rounded-full block"></span>
                </div>
                {/* Right City & Dot */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:mt-1 md:mr-2  z-10"
                  style={{
                    right: "0%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span className="w-1 h-1 bg-blue-200 rounded-full block"></span>
                  <span className="text-xs leading-[100%] font-normal text-foreground/80">
                    {flight.arrival.airport}
                  </span>
                </div>
                {/* SVG Path */}
                <Image
                  src="/flight-arc.svg"
                  alt="flight arc"
                  width={385}
                  height={28}
                  className="absolute left-0 right-0 mx-auto w-full h-[28px]"
                />
                {/* Airplane Icon Centered at Top of Arc */}
                <div
                  className="absolute z-10"
                  style={{
                    left: "51.4%",
                    top: 0,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Image src="/plane.svg" alt="plane" width={21} height={17} />
                </div>
              </div>
              {/* Duration below SVG */}
              <span className="text-xs leading-[100%] font-normal text-foreground/60 -mt-7">
                {flight.duration} · {flight.flightType}
              </span>
            </div>
            {/* Arrival */}
            <div className="flex flex-col items-end space-y-2">
              <span className="text-xs leading-[100%] font-normal text-foreground/60">
                {flight.arrival.date}
              </span>
              <span className="text-xl leading-[135%] font-medium text-foreground">
                {flight.arrival.time}
              </span>
            </div>
          </div>
          {/* Bottom Row: Price, Airline, Link */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col space-y-2">
              <span className="text-xs leading-[100%] font-normal text-foreground/60">
                Price
              </span>
              <span className="text-xl leading-[135%] font-medium text-foreground">
                ${flight.price.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full  flex items-center justify-center overflow-hidden ml-4">
                <Image
                  src={flight.airline.logo}
                  alt={flight.airline.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
            </div>
            <Link
              href={flight.airline.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] leading-[100%]  font-normal text-foreground hover:underline flex items-center gap-1"
            >
              {flight.airline.website.replace(/^https?:\/\//, "")}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ))}

      {shouldShowButton && (
        <ShadCnButton
          onClick={toggleShowAll}
          className="text-xs font-semibold text-foreground rounded-full hover:bg-transparent px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10"
        >
          {showAll ? "See less" : "See more"}
        </ShadCnButton>
      )}
    </div>
  );
}
