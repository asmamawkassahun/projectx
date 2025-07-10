import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Place {
  position: number;
  title: string;
  label?: string;
  address?: string;
  phone?: string;
  hours?: string;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
  links?: {
    website?: string;
    directions?: string;
    delivery?: string;
  };
}

interface LocalMapViewProps {
  data: {
    map?: {
      link: string;
      image: string;
    };
    more_locations_link?: string;
    places: Place[];
  };
}

const LocalMapView: React.FC<LocalMapViewProps> = ({ data }) => {
  const [selectedPlace, setSelectedPlace] = useState<number | null>(
    data.places.length > 0 ? 0 : null
  );
  
  if (!data.places || data.places.length === 0) {
    return null;
  }

  // Create star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Render stars with smaller size
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    
    if (halfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="half-star-gradient">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-star-gradient)"></polygon>
        </svg>
      );
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="transparent" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    
    return stars;
  };

  const currentPlace = selectedPlace !== null ? data.places[selectedPlace] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <h3 className="text-gray-800 text-sm font-medium mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Local Results <span className="text-xs text-gray-500">({data.places.length})</span>
        </div>
        {data.more_locations_link && (
          <a
            href={data.more_locations_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
          >
            <span>More</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        )}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left side: Map view */}
        {data.map && (
          <div className="lg:col-span-1 h-full">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col shadow-sm">
              <a 
                href={data.map.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative group flex-grow"
              >
                <img 
                  src={data.map.image} 
                  alt="Map view"
                  className="w-full h-full min-h-[180px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML += `
                      <div class="h-full min-h-[180px] flex items-center justify-center bg-gray-100 text-gray-500">
                        <div class="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-1">
                            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                            <line x1="9" y1="3" x2="9" y2="18"></line>
                            <line x1="15" y1="6" x2="15" y2="21"></line>
                          </svg>
                          <p class="text-xs">Map unavailable</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                
                {currentPlace?.gps_coordinates && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
                    <motion.div
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.3,
                        y: { 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          duration: 1
                        }
                      }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </motion.div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                  <div className="text-white text-xs font-medium">
                    Open in Google Maps
                  </div>
                </div>
              </a>
              
              {currentPlace?.gps_coordinates && (
                <div className="p-2 text-xs text-gray-600 flex items-center gap-1 bg-gray-50 border-t border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="truncate">
                    {currentPlace.gps_coordinates.latitude.toFixed(5)}, {currentPlace.gps_coordinates.longitude.toFixed(5)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Right side: Places list */}
        <div className={`${data.map ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-auto max-h-[300px] bg-white border border-gray-200 rounded-lg h-full shadow-sm">
            {data.places.map((place, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`border-b border-gray-200 last:border-b-0 ${selectedPlace === index ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer transition-colors`}
                onClick={() => setSelectedPlace(index)}
              >
                <div className="flex p-2.5">
                  {place.thumbnail && (
                    <div className="w-14 h-14 flex-shrink-0 mr-2.5 rounded overflow-hidden border border-gray-200">
                      <img
                        src={place.thumbnail}
                        alt={place.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="mr-2 min-w-0">
                        <h4 className="text-gray-900 font-medium text-xs truncate">{place.title}</h4>
                        
                        {place.label && (
                          <div className="text-gray-600 text-xs truncate">
                            {place.label}
                          </div>
                        )}
                      </div>
                      
                      {place.position !== undefined && (
                        <div className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                          {String.fromCharCode(65 + place.position)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                      {place.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex">{renderStars(place.rating)}</div>
                          <span className="text-[10px] text-gray-600">
                            {place.rating.toFixed(1)}
                            {place.reviews && ` (${place.reviews})`}
                          </span>
                        </div>
                      )}
                      
                      {place.address && (
                        <div className="text-[10px] text-gray-600 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}
                      
                      {place.hours && (
                        <div className="text-[10px] text-gray-600 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="truncate">{place.hours}</span>
                        </div>
                      )}
                      
                      {place.phone && (
                        <div className="text-[10px] text-gray-600 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span className="truncate">{place.phone}</span>
                        </div>
                      )}
                    </div>
                      
                    {place.links && Object.keys(place.links).length > 0 && (
                      <div className="flex gap-1.5 mt-1.5">
                        {place.links.website && (
                          <a 
                            href={place.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] rounded px-1.5 py-0.5 flex items-center gap-0.5 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            Website
                          </a>
                        )}
                        
                        {place.links.directions && (
                          <a 
                            href={place.links.directions}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] rounded px-1.5 py-0.5 flex items-center gap-0.5 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                            Directions
                          </a>
                        )}
                        
                        {place.links.delivery && (
                          <a 
                            href={place.links.delivery}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] rounded px-1.5 py-0.5 flex items-center gap-0.5 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="3" width="15" height="13"></rect>
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                              <circle cx="5.5" cy="18.5" r="2.5"></circle>
                              <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Order
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocalMapView; 