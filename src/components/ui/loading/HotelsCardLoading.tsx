"use client";
import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import HotelsCardSkeleton from "../hotel_components/HotelsCardSkeleton";
import HotelsCardContent from "../hotel_components/HotelsCardContent";
import { ShadCnButton } from "../shadcnButton";

interface HotelData {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  discount?: number;
  imageUrl: string;
}
const sampleHotels = [
  {
    id: "1",
    name: "Stay Wellbeing & Lifestyle Resort",
    location: "Kata Beach • First Line",
    price: 105,
    rating: 4.8,
    reviews: 120,
    discount: 20,
    imageUrl: "/images/Image1.png",
  },
  {
    id: "2",
    name: "Mandarava Resort and Spa",
    location: "Karon Beach • First Line",
    price: 220,
    rating: 5.0,
    reviews: 85,
    imageUrl: "/images/Image2.png",
  },
];

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
    <div className="w-full p-8 bg-background flex justify-center">
      {isLoading ? (
        <HotelsCardSkeleton />
      ) : (
        <HotelsCardContent hotels={sampleHotels} totalResults={2} />
      )}
      <ShadCnButton
        onClick={resetLoading}
        className="w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700"
      >
        <RefreshCcw className="w-4 h-4" />{" "}
        {/* Adjusted icon size for better fit */}
      </ShadCnButton>
    </div>
  );
};

export default HotelsCardLoading;
