import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Navigation2, ExternalLink } from 'lucide-react';

interface Direction {
  travel_mode: string;
  distance: number;
  duration: number;
  formatted_distance: string;
  formatted_duration: string;
}

interface PlaceInfo {
  address: string;
  data_id: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface DirectionsData {
  start_location: {
    name: string;
    location: string;
  };
  end_location: {
    name: string;
    location: string;
  };
  places_info: PlaceInfo[];
  directions: Direction[];
}

interface DirectionsWidgetProps {
  directionsData: DirectionsData | null;
  isVisible?: boolean;
  onClose?: () => void;
}

const DirectionsWidget: React.FC<DirectionsWidgetProps> = ({
  directionsData,
  isVisible = true,
  onClose
}) => {
  const [selectedTravelMode, setSelectedTravelMode] = useState(0);

  useEffect(() => {
    if (directionsData) {
      setSelectedTravelMode(0);
    }
  }, [directionsData]);

  const handleOpenInMaps = () => {
    if (directionsData && directionsData.places_info.length >= 2) {
      const startCoords = directionsData.places_info[0].gps_coordinates;
      const endCoords = directionsData.places_info[1].gps_coordinates;
      
      const mapsUrl = `https://www.google.com/maps/dir/${startCoords.latitude},${startCoords.longitude}/${endCoords.latitude},${endCoords.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  if (!isVisible || !directionsData) {
    return null;
  }

  const currentDirection = directionsData.directions[selectedTravelMode] || directionsData.directions[0];

  return (
    <div className="py-2">
      {/* Header with clear button */}
      <div className="flex justify-between items-center mb-2 px-3">
        <div></div>
        <button
          onClick={onClose}
          className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Main directions card */}
      <div className="mx-3">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden">
          {/* Map Preview Section */}
          <div 
            className="relative h-32 bg-gradient-to-br from-blue-100/20 to-blue-200/20 flex items-center justify-center overflow-hidden cursor-pointer hover:from-blue-200/30 hover:to-blue-300/30 transition-all duration-200"
            onClick={handleOpenInMaps}
          >
            {/* Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-white/30"></div>
                ))}
              </div>
            </div>
            
            {/* Route visualization */}
            <div className="relative z-10 flex items-center justify-between w-full px-6">
              {/* Start marker */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                <div className="mt-1 text-xs font-medium text-white/80 text-center max-w-12 truncate">
                  Start
                </div>
              </div>
              
              {/* Route line */}
              <div className="flex-1 mx-3 relative">
                <div className="h-0.5 bg-white/60 relative">
                  <div className="absolute inset-0 bg-white/60 animate-pulse"></div>
                </div>
                {/* Route icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Navigation2 className="w-3 h-3 text-white bg-black/60 rounded-full p-0.5" />
                </div>
              </div>
              
              {/* End marker */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-lg"></div>
                <div className="mt-1 text-xs font-medium text-white/80 text-center max-w-12 truncate">
                  End
                </div>
              </div>
            </div>

            {/* Tap to open overlay */}
            <div className="absolute bottom-2 right-2">
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-white/80" />
                <span className="text-xs text-white/80 font-medium">Maps</span>
              </div>
            </div>
          </div>

          {/* Route information */}
          <div className="p-4">
            {/* Locations */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm font-medium truncate">
                  {directionsData.start_location.name}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white text-sm font-medium truncate">
                  {directionsData.end_location.name}
                </span>
              </div>
            </div>

            {/* Duration & Distance */}
            <div className="flex items-center justify-between p-2 bg-white/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white">
                  {currentDirection.formatted_duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white">
                  {currentDirection.formatted_distance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionsWidget; 