import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FlightCardContentProps } from "@/types/flight";
import Link from "next/link";

export function FlightCardContent({
  departureTime,
  arrivalTime,
  departureCity,
  arrivalCity,
  departureDate,
  arrivalDate,
  duration,
  price,
  airlineLogo,
  airlineName,
  bookingUrl,
}: FlightCardContentProps) {
  return (
    <div className="w-full max-w-[689px] h-[166px] rounded-2xl dark:bg-[#1a1a1a] bg-black/10 flex flex-col justify-between p-6 shadow-lg mx-auto relative overflow-hidden">
      <div className="flex justify-between items-start w-full">
        {/* Departure */}
        <div className="flex flex-col items-start">
          <span className="text-[12px] leading-[100%] font-normal text-foreground/60 mb-1">
            {departureDate}
          </span>
          <span className="text-[14px] md:text-[16px] lg:text-[20px] leading-[135%] font-medium text-foreground">
            {departureTime}
          </span>
        </div>
        {/* Flight Path with Cities, Dots, Airplane, and Duration */}
        <div className="flex flex-col items-center flex-1 mx-4 relative">
          <div className="relative w-full" style={{ height: 40 }}>
            {/* Left City & Dot */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:mt-[0.6rem]  z-10  "
              style={{ left: "0%", top: "50%", transform: "translateY(-50%)" }}
            >
              <span className="text-[12px] leading-[100%] font-normal text-foreground/80">
                {departureCity}
              </span>
              <span className="w-1 h-1 bg-blue-200 rounded-full block"></span>
            </div>
            {/* Right City & Dot */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 md:mt-2 md:mr-2  z-10"
              style={{ right: "0%", top: "50%", transform: "translateY(-50%)" }}
            >
              <span className="w-1 h-1 bg-blue-200 rounded-full block"></span>
              <span className="text-[12px] leading-[100%] font-normal text-foreground/80">
                {arrivalCity}
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
          <span className="text-[12px] leading-[100%] font-normal text-foreground/60 -mt-4 mb-6">
            {duration} · Direct
          </span>
        </div>
        {/* Arrival */}
        <div className="flex flex-col items-end ">
          <span className="text-[12px] leading-[100%] font-normal text-foreground/60 mb-1">
            {arrivalDate}
          </span>
          <span className="text-[14px] md:text-[16px] lg:text-[20px] leading-[135%] font-medium text-foreground">
            {arrivalTime}
          </span>
        </div>
      </div>
      {/* Bottom Row: Price, Airline, Link */}
      <div className="flex justify-between items-center w-full mt-4">
        <div className="flex flex-col">
          <span className="text-[12px] leading-[100%] font-normal text-foreground/60">
            Price
          </span>
          <span className="text-[20px] leading-[135%] font-medium text-foreground">
            {price}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full  flex items-center justify-center overflow-hidden ml-4">
            <Image
              src={airlineLogo}
              alt={airlineName}
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>
        </div>
        <Link
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] leading-[100%]  font-normal text-foreground hover:underline flex items-center gap-1"
        >
          {bookingUrl.replace(/^https?:\/\//, "")} {/* Show domain only */}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
