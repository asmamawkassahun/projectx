import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Utensils, Filter, SortAsc, ExternalLink, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { InChatUpdate } from './types';

interface HotelSearchDetailedViewerProps {
  updates: InChatUpdate[];
  isOpen: boolean;
  onClose: () => void;
}

const HotelSearchDetailedViewer: React.FC<HotelSearchDetailedViewerProps> = ({
  updates,
  isOpen,
  onClose
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('price');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  
  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  
  // Extract search data
  const searchData = searchCompleteUpdate?.data || latestUpdate?.data || {};
  const { search_info, properties = [], total_properties } = searchData;
  
  // Filter and sort properties
  const filteredProperties = properties
    .filter((property: any) => {
      if (filterRating > 0 && (!property.rating || property.rating < filterRating)) return false;
      if (property.price && property.price > maxPrice) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });
  
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return 'Price unavailable';
    return `$${price.toLocaleString()}`;
  };
  
  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <Car className="w-4 h-4" />;
    if (amenityLower.includes('breakfast') || amenityLower.includes('restaurant')) return <Coffee className="w-4 h-4" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="w-4 h-4" />;
    if (amenityLower.includes('pool') || amenityLower.includes('spa')) return <Utensils className="w-4 h-4" />;
    return null;
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
            <h2 className="text-xl font-semibold text-gray-900">Hotel Search Results</h2>
            {search_info && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{search_info.location || search_info.destination}</span>
                </div>
                {search_info.check_in && (
                  <span>{search_info.check_in} - {search_info.check_out}</span>
                )}
                {search_info.guests && (
                  <span>{search_info.guests} guests</span>
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

        {searchCompleteUpdate ? (
          <>
            {/* Filters and Sort */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'name')}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="rating">Rating (High to Low)</option>
                      <option value="name">Name (A to Z)</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(Number(e.target.value))}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Max Price:</span>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm font-medium text-gray-900">${maxPrice}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredProperties.length} of {total_properties || properties.length} hotels
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredProperties.length > 0 ? (
                <div className="space-y-6">
                  {filteredProperties.map((property: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {property.name}
                          </h3>
                          
                          {/* Rating and location */}
                          <div className="flex items-center space-x-4 mb-3">
                            {property.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-900">{property.rating}</span>
                                {property.review_count && (
                                  <span className="text-sm text-gray-500">({property.review_count} reviews)</span>
                                )}
                              </div>
                            )}
                            {property.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{property.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {property.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {property.description}
                            </p>
                          )}

                          {/* Amenities */}
                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex items-center space-x-3 mb-3">
                              {property.amenities.slice(0, 6).map((amenity: string, amenityIndex: number) => {
                                const icon = getAmenityIcon(amenity);
                                return icon ? (
                                  <div key={amenityIndex} className="flex items-center space-x-1 text-gray-500" title={amenity}>
                                    {icon}
                                    <span className="text-xs">{amenity.split(' ')[0]}</span>
                                  </div>
                                ) : null;
                              })}
                              {property.amenities.length > 6 && (
                                <span className="text-xs text-gray-500">+{property.amenities.length - 6} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="text-right ml-6">
                          <div className="mb-3">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-sm text-gray-500">per night</div>
                            {property.total_price && (
                              <div className="text-sm text-gray-500">
                                Total: {formatPrice(property.total_price)}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                              View Details
                            </button>
                            {property.booking_url && (
                              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">Book Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(property.cancellation_policy || property.breakfast_included) && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            {property.cancellation_policy && (
                              <span>• {property.cancellation_policy}</span>
                            )}
                            {property.breakfast_included && (
                              <span>• Breakfast included</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels match your filters</h3>
                  <p className="text-gray-600">Try adjusting your price range or rating requirements</p>
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
                {errorUpdate.data.error || 'An error occurred while searching for hotels'}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Hotels</h3>
              <p className="text-gray-600">Finding the best accommodations...</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default HotelSearchDetailedViewer; 