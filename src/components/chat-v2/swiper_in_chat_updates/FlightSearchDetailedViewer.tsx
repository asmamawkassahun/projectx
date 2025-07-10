import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plane, Clock, ArrowRight, Filter, SortAsc, ExternalLink, AlertCircle, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface FlightSearchDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const FlightSearchDetailedViewer: React.FC<FlightSearchDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [maxStops, setMaxStops] = useState<number>(2);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  const bestFlightsUpdate = updates.find(update => update.event_type === 'best_flights');
  
  // Extract flight data
  const flightData = searchCompleteUpdate?.data || bestFlightsUpdate?.data || latestUpdate?.data || {};
  const { search_info, best_flights = [], price_insights, total_results } = flightData;
  
  // Filter and sort flights
  const filteredFlights = best_flights
    .filter((flight: any) => {
      if (flight.stops > maxStops) return false;
      if (flight.price && flight.price > maxPrice) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'duration':
          return (a.duration || 0) - (b.duration || 0);
        case 'departure':
          return new Date(a.departure_time || 0).getTime() - new Date(b.departure_time || 0).getTime();
        default:
          return 0;
      }
    });
  
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return 'Price unavailable';
    return `$${price.toLocaleString()}`;
  };
  
  // Format duration
  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return timeString;
    }
  };

  // Format date
  const formatDate = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Flight Search Results</h2>
            {search_info && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Plane className="w-4 h-4" />
                  <span>{search_info.origin} → {search_info.destination}</span>
                </div>
                {search_info.departure_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{search_info.departure_date}</span>
                    {search_info.return_date && ` - ${search_info.return_date}`}
                  </div>
                )}
                {search_info.passengers && (
                  <span>{search_info.passengers} passengers</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {(searchCompleteUpdate || bestFlightsUpdate) ? (
          <>
            {/* Price Insights */}
            {price_insights && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {price_insights.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-red-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      Prices are {price_insights.trend === 'up' ? 'rising' : 'falling'}
                    </span>
                    {price_insights.percentage && (
                      <span className="text-sm text-gray-600">
                        ({price_insights.percentage}% vs last week)
                      </span>
                    )}
                  </div>
                  {price_insights.best_time && (
                    <span className="text-sm text-gray-600">
                      Best time to book: {price_insights.best_time}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Filters and Sort */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price' | 'duration' | 'departure')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="duration">Duration (Shortest)</option>
                      <option value="departure">Departure Time</option>
                    </select>
                  </div>

                  {/* Stops Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={maxStops}
                      onChange={(e) => setMaxStops(Number(e.target.value))}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value={0}>Direct Only</option>
                      <option value={1}>Up to 1 Stop</option>
                      <option value={2}>Up to 2 Stops</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Max Price:</span>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm font-medium text-gray-900">${maxPrice}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredFlights.length} of {total_results || best_flights.length} flights
                </div>
              </div>
            </div>

            {/* Flights List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredFlights.length > 0 ? (
                <div className="space-y-4">
                  {filteredFlights.map((flight: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Flight Route */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatTime(flight.departure_time)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(flight.departure_time)}
                              </div>
                              <div className="text-sm font-medium text-gray-700">
                                {search_info?.origin}
                              </div>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center">
                              <div className="flex items-center space-x-2">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <div className="text-center">
                                  <Plane className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                  {flight.duration && (
                                    <div className="text-xs text-gray-500">
                                      {formatDuration(flight.duration)}
                                    </div>
                                  )}
                                  {flight.stops !== undefined && (
                                    <div className="text-xs text-gray-500">
                                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                                    </div>
                                  )}
                                </div>
                                <div className="h-px bg-gray-300 flex-1"></div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatTime(flight.arrival_time)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(flight.arrival_time)}
                              </div>
                              <div className="text-sm font-medium text-gray-700">
                                {search_info?.destination}
                              </div>
                            </div>
                          </div>

                          {/* Flight Details */}
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            {flight.airline && (
                              <span className="font-medium">{flight.airline}</span>
                            )}
                            {flight.aircraft && (
                              <span>{flight.aircraft}</span>
                            )}
                            {flight.flight_number && (
                              <span>Flight {flight.flight_number}</span>
                            )}
                            {flight.cabin_class && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {flight.cabin_class}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="text-right ml-6">
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatPrice(flight.price)}
                            </div>
                            {flight.price_type && (
                              <div className="text-sm text-gray-500">{flight.price_type}</div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                              Select Flight
                            </button>
                            {flight.booking_url && (
                              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">Book Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(flight.baggage_info || flight.cancellation_policy) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            {flight.baggage_info && (
                              <span>• {flight.baggage_info}</span>
                            )}
                            {flight.cancellation_policy && (
                              <span>• {flight.cancellation_policy}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flights match your filters</h3>
                  <p className="text-gray-600">Try adjusting your price range or stops requirements</p>
                </div>
              )}
            </div>
          </>
        ) : errorUpdate ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Search Failed</h3>
              <p className="text-red-600 mb-6">
                {errorUpdate.data.error || 'An error occurred while searching for flights'}
              </p>
              <button className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Flights</h3>
              <p className="text-gray-600">Finding the best flight options...</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default FlightSearchDetailedViewer; 