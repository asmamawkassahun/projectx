import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, AlertCircle, Eye } from 'lucide-react';
import { BaseSwiperItemProps } from './types';
import { HotelSearchDetailedViewer } from './index';

const HotelSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({ 
  updates, 
  isActive, 
  isDragging 
}) => {
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);

  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(update => update.event_type === 'search_complete');
  const errorUpdate = updates.find(update => update.event_type === 'search_error');
  const propertyBatchUpdate = updates.find(update => update.event_type === 'property_batch');
  
  // Extract search data
  const searchData = searchCompleteUpdate?.data || latestUpdate?.data || {};
  const { search_info, properties = [], total_properties } = searchData;
  
  // Get the first few properties to display
  const displayProperties = properties.slice(0, 2);
  
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return 'Price unavailable';
    return `$${price.toLocaleString()}`;
  };
  
  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-3 h-3" />;
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <Car className="w-3 h-3" />;
    if (amenityLower.includes('breakfast') || amenityLower.includes('restaurant')) return <Coffee className="w-3 h-3" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="w-3 h-3" />;
    return null;
  };

  const getTitle = () => {
    if (searchCompleteUpdate) return 'Hotel Search Results';
    if (errorUpdate) return 'Hotel Search Failed';
    return 'Searching Hotels';
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDetailedViewer(true);
    }
  };

  return (
    <>
      <div className="w-full">
        <h2 className={`text-lg font-semibold mb-4 ${isActive ? "text-gray-900" : "text-gray-400"} tracking-tight`}>
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
                <div className="h-full flex flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {search_info.location || search_info.destination} Hotels
                        </h3>
                        <p className="text-xs text-gray-600">{total_properties || properties.length} hotels found</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">View all</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hotels preview */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-0">
                      {displayProperties.slice(0, 3).map((hotel: any, index: number) => (
                        <div key={index} className="p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                                  {hotel.name}
                                </h4>
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < Math.floor(hotel.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {hotel.rating?.toFixed(1) || 'N/A'}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-600">
                                    {hotel.reviews_count} reviews
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                                  {hotel.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ml-3 text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {formatPrice(hotel.price)}
                                </div>
                                <div className="text-xs text-gray-500">per night</div>
                              </div>
                            </div>
                            
                            {/* Amenities */}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {hotel.amenities.slice(0, 4).map((amenity: string, amenityIndex: number) => {
                                  const iconElement = getAmenityIcon(amenity);
                                  return iconElement ? (
                                    <div key={amenityIndex} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                                      {iconElement}
                                      <span className="text-xs text-gray-700 capitalize">{amenity}</span>
                                    </div>
                                  ) : (
                                    <div key={amenityIndex} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                                      <span className="text-xs text-gray-700 capitalize">{amenity}</span>
                                    </div>
                                  );
                                })}
                                {hotel.amenities.length > 4 && (
                                  <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                    <span className="text-xs text-gray-600">+{hotel.amenities.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {displayProperties.length > 3 && (
                      <div className="p-4 text-center bg-gradient-to-t from-gray-50 to-transparent">
                        <div className="inline-flex items-center space-x-2 text-xs text-gray-600 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200">
                          <span>+{displayProperties.length - 3} more hotels</span>
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
                      <button className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : errorUpdate ? (
            <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-base font-medium text-red-900 mb-2">Search Failed</h3>
                <p className="text-sm text-red-600 mb-4">
                  {errorUpdate.data.error || 'An error occurred while searching for hotels'}
                </p>
                {search_info?.location && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
                    <div className="text-xs font-medium text-red-700 mb-1">Search Location:</div>
                    <p className="text-sm text-red-600">{search_info.location}</p>
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
                    <div className="absolute inset-2 rounded-lg border-2 border-gray-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
                
                <h3 className="text-base font-medium text-gray-900 mb-2">Searching Hotels</h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Finding the best accommodations...
                </p>
                
                {search_info?.location && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-1">Location:</div>
                    <p className="text-sm text-gray-600">{search_info.location}</p>
                    {search_info.check_in && (
                      <div className="text-xs text-gray-500 mt-1">
                        {search_info.check_in} - {search_info.check_out}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="w-full max-w-xs">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-400 animate-pulse" style={{ width: '70%' }} />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">Searching properties...</span>
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