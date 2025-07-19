import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  discount?: number;
  imageUrl: string;
}

export default function HotelCard({
  name,
  location,
  price,
  rating,
  reviews,
  discount,
  imageUrl,
}: HotelCardProps) {
  return (
    <div className="w-full space-y-6 dark:bg-[#1a1a1a] bg-black/10 text-foreground p-4 rounded-3xl">
      <div className="relative w-full aspect-[300/200] overflow-hidden">
        <Image
          src={imageUrl || "/images/placeholder.png"}
          alt={`Image of ${name}`}
          width={300}
          height={200}
          className="rounded-xl object-cover"
        />
        <div className="absolute top-3 left-3 bg-background/40 backdrop-blur-[40px] rounded-full px-2 py-1 flex items-center gap-1 text-xs font-semibold">
          <Star className="h-3 w-3 fill-white text-white" />
          <span>{rating.toFixed(1)}</span>
        </div>
        {discount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#F44F45] to-[#EE9849] rounded-full px-2 py-1 text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-end text-foreground">
          <h3 className="text-xl font-medium break-words w-[13.0625rem]">
            {name}
          </h3>
          <span className="text-xl font-medium  text-right">${price}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <p className="text-sm text-foreground/40 break-words">{location}</p>
          <span className="text-sm text-foreground/40 text-right">
            per night
          </span>
        </div>
      </div>
    </div>
  );
}
