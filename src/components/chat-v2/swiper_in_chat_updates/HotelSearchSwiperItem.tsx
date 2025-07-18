import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  AlertCircle,
  Eye,
} from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import { HotelSearchDetailedViewer } from "./index";
import HotelsCardContent from "@/components/ui/hotel_components/HotelsCardContent";
import HotelsCardSkeleton from "@/components/ui/hotel_components/HotelsCardSkeleton";

const HotelSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({
  updates,
  isActive,
  isDragging,
}) => {
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);

  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(
    (update) => update.event_type === "hotel_search_completed"
  );
  const errorUpdate = updates.find(
    (update) => update.event_type === "search_error"
  );
  const propertyBatchUpdate = updates.find(
    (update) => update.event_type === "property_batch"
  );

  // Extract search data
  const searchData = searchCompleteUpdate?.data || latestUpdate?.data || {};
  const { search_info, properties, total_properties_count } = searchData;

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "Price unavailable";
    return `$${price.toLocaleString()}`;
  };

  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi") || amenityLower.includes("internet"))
      return <Wifi className="w-3 h-3" />;
    if (amenityLower.includes("parking") || amenityLower.includes("garage"))
      return <Car className="w-3 h-3" />;
    if (
      amenityLower.includes("breakfast") ||
      amenityLower.includes("restaurant")
    )
      return <Coffee className="w-3 h-3" />;
    if (amenityLower.includes("gym") || amenityLower.includes("fitness"))
      return <Dumbbell className="w-3 h-3" />;
    return null;
  };

  const getTitle = () => {
    if (searchCompleteUpdate) return "Hotel Search Results";
    if (errorUpdate) return "Hotel Search Failed";
    return "Searching Hotels";
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDetailedViewer(true);
    }
  };

  return (
    <>
      <div className="w-full">
        <h2
          className={`text-lg font-semibold mb-4 ${
            isActive ? "text-gray-900" : "text-gray-400"
          } tracking-tight`}
        >
          {getTitle()}
        </h2>

        <div className="relative h-[320px] w-full">
          {searchCompleteUpdate &&
          total_properties_count > 0 &&
          properties.length > 0 ? (
            <HotelsCardContent
              hotels={properties}
              totalResults={total_properties_count}
            />
          ) : errorUpdate ? (
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-base font-medium text-red-900 mb-2">
                  Search Failed
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  {errorUpdate.data.error ||
                    "An error occurred while searching for hotels"}
                </p>
                {search_info?.location && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
                    <div className="text-xs font-medium text-red-700 mb-1">
                      Search Location:
                    </div>
                    <p className="text-sm text-red-600">
                      {search_info.location}
                    </p>
                  </div>
                )}
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            <HotelsCardSkeleton />
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <HotelSearchDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default HotelSearchSwiperItem;
