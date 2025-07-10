import React, { useState, useEffect, useCallback } from 'react';
import { pusherManager, PusherEventType } from '@/lib/pusher';
import PlacesWidget from './PlacesWidget';
import DirectionsWidget from './DirectionsWidget';

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

interface DirectionsData {
  start_location: {
    name: string;
    location: string;
  };
  end_location: {
    name: string;
    location: string;
  };
  places_info: Array<{
    address: string;
    data_id: string;
    gps_coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  directions: Array<{
    travel_mode: string;
    distance: number;
    duration: number;
    formatted_distance: string;
    formatted_duration: string;
  }>;
}

interface VoiceSearchWidgetsProps {
  sessionId?: string;
  isVisible?: boolean;
}

type ActiveWidget = 'places' | 'directions' | null;

const VoiceSearchWidgets: React.FC<VoiceSearchWidgetsProps> = ({
  sessionId,
  isVisible = true
}) => {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);
  const [placesData, setPlacesData] = useState<Place[]>([]);
  const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);

  // Handle voice search widget events from Pusher
  const handleVoiceSearchEvent = useCallback((data: any) => {
    console.log("Voice search widget event received:", data);
    console.log("Event type:", data.type);
    console.log("Event data:", data.data);
    
    // Clear previous widget data and set new active widget
    if (data.type === 'places') {
      console.log("Setting places data:", data.data);
      setDirectionsData(null); // Clear directions
      setPlacesData(data.data || []);
      setActiveWidget('places');
    } else if (data.type === 'directions') {
      console.log("Setting directions data:", data.data);
      console.log("Directions data structure:", JSON.stringify(data.data, null, 2));
      setPlacesData([]); // Clear places
      setDirectionsData(data.data || null);
      setActiveWidget('directions');
      console.log("Active widget set to 'directions'");
    }
  }, []);

  // Setup Pusher event listeners
  useEffect(() => {
    if (sessionId && isVisible) {
      pusherManager.addEventListener(PusherEventType.VoiceSearchEvent, handleVoiceSearchEvent);

      return () => {
        pusherManager.removeEventListener(PusherEventType.VoiceSearchEvent, handleVoiceSearchEvent);
      };
    }
  }, [sessionId, isVisible, handleVoiceSearchEvent]);

  // Clear active widget when parent becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setActiveWidget(null);
      setPlacesData([]);
      setDirectionsData(null);
    }
  }, [isVisible]);

  // Handle individual widget clear actions
  const handleClearWidget = useCallback(() => {
    setActiveWidget(null);
    setPlacesData([]);
    setDirectionsData(null);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="voice-search-widgets">
      <PlacesWidget 
        places={placesData}
        isVisible={activeWidget === 'places'}
        onClose={handleClearWidget}
      />
      <DirectionsWidget 
        directionsData={directionsData}
        isVisible={activeWidget === 'directions'}
        onClose={handleClearWidget}
      />
    </div>
  );
};

export default VoiceSearchWidgets; 