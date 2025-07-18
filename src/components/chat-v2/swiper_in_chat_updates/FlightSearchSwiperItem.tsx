import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plane, AlertCircle, Eye } from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import { FlightSearchDetailedViewer } from "./index";

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
    (update) => update.event_type === "search_complete"
  );
  const errorUpdate = updates.find(
    (update) => update.event_type === "search_error"
  );
  const bestFlightsUpdate = updates.find(
    (update) => update.event_type === "best_flights"
  );

  // Extract flight data
  const flightData =
    searchCompleteUpdate?.data ||
    bestFlightsUpdate?.data ||
    latestUpdate?.data ||
    {};
  const {
    search_info,
    best_flights = [],
    price_insights,
    total_results,
  } = flightData;

  // Get the first few flights to display
  const displayFlights = best_flights.slice(0, 2);

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
          {searchCompleteUpdate ? (
            <motion.div
              className="absolute inset-0 cursor-pointer"
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Background cards for stack effect */}
              <div className="absolute inset-0 transform translate-x-2 translate-y-2 bg-gray-100 rounded-xl shadow-sm"></div>
              <div className="absolute inset-0 transform translate-x-1 translate-y-1 bg-gray-50 rounded-xl shadow-md"></div>

              {/* Main card */}
              <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-full flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plane className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {search_info?.origin || search_info?.departure_id} →{" "}
                          {search_info?.destination || search_info?.arrival_id}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {total_results || best_flights.length} flights found
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">View all</span>
                      </div>
                    </div>
                  </div>

                  {/* Flight details */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-0">
                      {displayFlights.map((flight: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-2">
                                  <div className="text-center">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {formatTime(
                                        flight.departure_time ||
                                          flight.flights?.[0]?.departure_airport
                                            ?.time
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {flight.departure_airport?.id ||
                                        flight.flights?.[0]?.departure_airport
                                          ?.id ||
                                        search_info?.origin}
                                    </div>
                                  </div>
                                  <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                      <div className="h-px bg-gray-300 flex-1"></div>
                                      <Plane className="w-4 h-4 text-blue-500" />
                                      <div className="h-px bg-gray-300 flex-1"></div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {formatDuration(
                                        flight.duration ||
                                          flight.flights?.[0]?.duration
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {formatTime(
                                        flight.arrival_time ||
                                          flight.flights?.[0]?.arrival_airport
                                            ?.time
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {flight.arrival_airport?.id ||
                                        flight.flights?.[0]?.arrival_airport
                                          ?.id ||
                                        search_info?.destination}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                  <span>
                                    {flight.airline ||
                                      flight.flights?.[0]?.airline ||
                                      "Unknown Airline"}
                                  </span>
                                  {(flight.travel_class ||
                                    flight.flights?.[0]?.travel_class) && (
                                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                                      {flight.travel_class ||
                                        flight.flights?.[0]?.travel_class}
                                    </span>
                                  )}
                                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                    {flight.flights && flight.flights.length > 1
                                      ? `${flight.flights.length - 1} stops`
                                      : "Direct"}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {formatPrice(flight.price)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  per person
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price insights */}
                    {price_insights && (
                      <div className="p-4 bg-blue-50 border-b border-gray-50">
                        <h4 className="text-xs font-semibold text-blue-900 mb-2">
                          Price Insights
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {price_insights.trend === "up" ? (
                            <div className="bg-white rounded-lg p-2">
                              <div className="font-medium text-red-700">
                                Prices are rising
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg p-2">
                              <div className="font-medium text-green-700">
                                Prices are falling
                              </div>
                            </div>
                          )}
                          {price_insights.best_time && (
                            <div className="bg-white rounded-lg p-2">
                              <div className="font-medium text-blue-700">
                                Best time: {price_insights.best_time}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {best_flights.length > 2 && (
                      <div className="p-4 text-center bg-gradient-to-t from-gray-50 to-transparent">
                        <div className="inline-flex items-center space-x-2 text-xs text-gray-600 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200">
                          <span>+{best_flights.length - 2} more flights</span>
                          <Eye className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex-shrink-0 p-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        ✓ Search Complete
                      </span>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : errorUpdate ? (
            // Show error state
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-base font-medium text-red-900 mb-2">
                  Search Failed
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  {errorUpdate.data.error ||
                    "An error occurred while searching for flights"}
                </p>
                {search_info && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
                    <div className="text-xs font-medium text-red-700 mb-1">
                      Search Route:
                    </div>
                    <p className="text-sm text-red-600">
                      {search_info.origin} → {search_info.destination}
                    </p>
                    {search_info.departure_date && (
                      <div className="text-xs text-red-500 mt-1">
                        {search_info.departure_date}
                      </div>
                    )}
                  </div>
                )}
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            // Show progress state
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6">
                {/* Animated plane icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Plane className="w-8 h-8 text-gray-400" />
                  </div>
                  {/* Animated flight path */}
                  <div className="absolute inset-0 rounded-lg">
                    <div className="absolute inset-0 rounded-lg border-2 border-gray-300 animate-ping"></div>
                    <div
                      className="absolute inset-2 rounded-lg border-2 border-gray-400 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Searching Flights
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Finding the best flight options...
                </p>

                {search_info && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      Route:
                    </div>
                    <p className="text-sm text-gray-600">
                      {search_info.origin} → {search_info.destination}
                    </p>
                    {search_info.departure_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        {search_info.departure_date}
                        {search_info.return_date &&
                          ` - ${search_info.return_date}`}
                      </div>
                    )}
                  </div>
                )}

                {/* Progress indicator */}
                <div className="w-full max-w-xs">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-400 animate-pulse"
                      style={{ width: "55%" }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      Searching airlines...
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
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
