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

  // Get the first few properties to display
  const displayProperties = properties.slice(0, 2);

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
          {searchCompleteUpdate ? (
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
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 rounded-lg">
                    <div className="absolute inset-0 rounded-lg border-2 border-gray-300 animate-ping"></div>
                    <div
                      className="absolute inset-2 rounded-lg border-2 border-gray-400 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Searching Hotels
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Finding the best accommodations...
                </p>

                {search_info?.location && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      Location:
                    </div>
                    <p className="text-sm text-gray-600">
                      {search_info.location}
                    </p>
                    {search_info.check_in && (
                      <div className="text-xs text-gray-500 mt-1">
                        {search_info.check_in} - {search_info.check_out}
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full max-w-xs">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-400 animate-pulse"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      Searching properties...
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
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
