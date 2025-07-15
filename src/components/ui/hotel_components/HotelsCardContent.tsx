import { ShadCnButton } from "../shadcnButton";
import HotelCard from "./HotelCard";

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

interface HotelsCardContentProps {
  hotels: HotelData[];
  totalResults: number;
}

const HotelsCardContent = ({
  hotels,
  totalResults,
}: HotelsCardContentProps) => {
  return (
    <div className="w-full max-w-[43.0625rem] space-y-4">
      <div className="flex items-center space-x-4  dark:text-white text-black text-sm font-semibold">
        <span>Hotels</span>
        <span className="w-8 h-8 rounded-full flex justify-center items-center bg-black/10 dark:white/10">
          {totalResults}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} {...hotel} />
        ))}
      </div>
      <ShadCnButton className="text-xs font-semibold text-foreground hover:bg-transparent rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10">
        See more
      </ShadCnButton>
    </div>
  );
};

export default HotelsCardContent;
