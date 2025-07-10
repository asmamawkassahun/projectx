import React, { useState, useRef, useEffect } from 'react';
import { Star, X } from 'lucide-react';

interface Place {
  title: string;
  rating: string;
  reviews: string;
  address: string;
  type: string;
  hours: string;
  phone: string;
  website: string;
  gps_coordinates: {
    latitude?: number;
    longitude?: number;
  };
  thumbnail: string;
  place_id_search: string;
}

interface PlacesWidgetProps {
  places: Place[];
  isVisible?: boolean;
  onClose?: () => void;
}

const PlacesWidget: React.FC<PlacesWidgetProps> = ({ 
  places, 
  isVisible = true, 
  onClose 
}) => {
  const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const totalPlacesRef = useRef<number>(0);

  // Update displayed places when props change
  useEffect(() => {
    if (places.length > 0) {
      // Filter out duplicates based on title and address
      const existingKeys = new Set(
        displayedPlaces.map(place => `${place.title}-${place.address}`)
      );
      
      const newPlaces = places.filter(place => 
        !existingKeys.has(`${place.title}-${place.address}`)
      );

      if (newPlaces.length > 0) {
        setDisplayedPlaces(prev => [...prev, ...newPlaces]);
        totalPlacesRef.current = displayedPlaces.length + newPlaces.length;
        
        // Auto-scroll to show new places after a brief delay
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollTo({
              left: container.scrollWidth,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    } else {
      // Clear places when empty array is passed
      setDisplayedPlaces([]);
      totalPlacesRef.current = 0;
    }
  }, [places, displayedPlaces]);

  const handleClear = () => {
    setDisplayedPlaces([]);
    totalPlacesRef.current = 0;
    onClose?.();
  };

  const handlePlaceClick = (place: Place) => {
    if (place.place_id_search) {
      window.open(place.place_id_search, '_blank');
    } else if (place.gps_coordinates.latitude && place.gps_coordinates.longitude) {
      // Fallback to Google Maps with coordinates
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.gps_coordinates.latitude},${place.gps_coordinates.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  if (!isVisible || displayedPlaces.length === 0) {
    return null;
  }

  return (
    <div className="py-2">
      {/* Header with clear button - outside scroll area */}
      <div className="flex justify-between items-center mb-2">
        <div></div> {/* Empty div for spacing */}
        <button
          onClick={handleClear}
          className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Horizontal scrolling container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-4"
        style={{ 
          marginRight: '-60px', 
          paddingRight: '60px' 
        }}
      >
        {displayedPlaces.map((place, index) => (
          <div
            key={`${place.title}-${place.address}-${index}`} // More stable key
            onClick={() => handlePlaceClick(place)}
            className="bg-black/40 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 cursor-pointer hover:bg-black/50 transition-all duration-300 w-64 flex-shrink-0 overflow-hidden"
            style={{
              animation: `slideIn 0.4s ease-out ${index >= totalPlacesRef.current - displayedPlaces.length + totalPlacesRef.current - displayedPlaces.length ? index * 0.05 : 0}s both`
            }}
          >
            {/* Compact horizontal layout */}
            <div className="flex p-3">
              {/* Content - Left side */}
              <div className="flex-1 pr-3 min-w-0"> {/* Added min-w-0 for proper text truncation */}
                {/* Rating and Type in header */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap"> {/* Added flex-wrap */}
                  {place.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0"> {/* Added flex-shrink-0 */}
                      <span className="text-white font-semibold text-sm">{place.rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                  )}
                  {place.type && (
                    <>
                      <span className="text-white/60 text-xs flex-shrink-0">•</span>
                      <span className="text-white/80 text-xs truncate min-w-0">{place.type}</span> {/* Added truncate and min-w-0 */}
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-white text-sm font-semibold leading-tight mb-2 line-clamp-2 break-words"> {/* Added break-words */}
                  {place.title}
                </h3>

                {/* Hours */}
                {place.hours && (
                  <div className="bg-white/30 backdrop-blur-sm rounded-full px-2 py-0.5 inline-block max-w-full"> {/* Lighter background and max-width */}
                    <span className="text-white text-xs font-medium truncate block">{place.hours}</span> {/* Added truncate and block */}
                  </div>
                )}
              </div>

              {/* Image - Right side */}
              {place.thumbnail && (
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={place.thumbnail}
                    alt={place.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesWidget; 