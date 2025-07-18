import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plane, AlertCircle, Eye } from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import { FlightSearchDetailedViewer } from "./index";
import { FlightCardContent } from "@/components/ui/flight_card_components/FlightCardContent";
import { Flight } from "@/types/flight";
import { FlightCardSkeleton } from "@/components/ui/flight_card_components/FlightCardSkeleton";

const FlightSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({
  updates,
  isActive,
  isDragging,
}) => {
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);

  console.log(updates);

  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(
    (update) => update.event_type === "flight_search_completed"
  );

  console.log(
    "search complate Update:",
    JSON.stringify(searchCompleteUpdate, null, 2)
  );
  const errorUpdate = updates.find(
    (update) => update.event_type === "search_error"
  );
  const bestFlightsUpdate = updates.find(
    (update) => update.event_type === "best_flights"
  );

  // Extract flight data
  const flightData: Flight[] =
    searchCompleteUpdate?.data.flights ||
    bestFlightsUpdate?.data ||
    latestUpdate?.data ||
    {};
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "Price unavailable";
    return `$${price.toLocaleString()}`;
  };

  // Format duration
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return timeString;
    }
  };

  const getTitle = () => {
    if (searchCompleteUpdate || bestFlightsUpdate)
      return "Flight Search Results";
    if (errorUpdate) return "Flight Search Failed";
    return "Searching Flights";
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
          {searchCompleteUpdate && flightData.length > 0 ? (
            <FlightCardContent flights={flightData} />
          ) : errorUpdate ? (
            <></>
          ) : (
            // Show error state
            // <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
            //   <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            //     <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            //     <h3 className="text-base font-medium text-red-900 mb-2">
            //       Search Failed
            //     </h3>
            //     <p className="text-sm text-red-600 mb-4">
            //       {errorUpdate.data.error ||
            //         "An error occurred while searching for flights"}
            //     </p>
            //     {search_info && (
            //       <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
            //         <div className="text-xs font-medium text-red-700 mb-1">
            //           Search Route:
            //         </div>
            //         <p className="text-sm text-red-600">
            //           {search_info.origin} → {search_info.destination}
            //         </p>
            //         {search_info.departure_date && (
            //           <div className="text-xs text-red-500 mt-1">
            //             {search_info.departure_date}
            //           </div>
            //         )}
            //       </div>
            //     )}
            //     <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
            //       Try Again
            //     </button>
            //   </div>
            // </motion.div>
            // Show progress state
            <FlightCardSkeleton />
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <FlightSearchDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default FlightSearchSwiperItem;
