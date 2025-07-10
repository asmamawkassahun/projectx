import React, { useState, useEffect, useRef } from 'react';
import PropertyList from './PropertyList';
import PropertyDetails from './PropertyDetails';
import SearchInfo from './SearchInfo';

interface HotelSearchProps {
  event: {
    event_type: string;
    data: any;
  };
  allEvents?: Array<{
    event_type: string;
    data: any;
  }>;
}

const HotelSearch: React.FC<HotelSearchProps> = ({ event, allEvents = [] }) => {
  // Track the loading state of hotel search
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasData, setHasData] = useState(false);
  // Track all properties across events for unified display
  const [allProperties, setAllProperties] = useState<any[]>([]);
  // Track selected property details
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  // Track search information
  const [searchInfo, setSearchInfo] = useState<any>(null);
  // Track total properties count (including ones not displayed)
  const [totalPropertiesCount, setTotalPropertiesCount] = useState<number | null>(null);
  // Track which property names we've already processed to avoid duplicates
  const processedPropertyNames = useRef<Set<string>>(new Set());
  
  // Process all batch events whenever allEvents changes
  useEffect(() => {
    // Only process if we have allEvents
    if (!allEvents || allEvents.length === 0) return;
    
    // Process all search_information events
    const searchInfoEvent = allEvents.find(e => e.event_type === 'search_information');
    if (searchInfoEvent) {
      setSearchInfo(searchInfoEvent.data.search_information);
      if (searchInfoEvent.data.search_information?.total_results) {
        setTotalPropertiesCount(searchInfoEvent.data.search_information.total_results);
      }
    }
    
    // Process hotel search completion events
    const completionEvent = allEvents.find(e => e.event_type === 'hotel_search_completed');
    if (completionEvent) {
      setIsCompleted(true);
      if (completionEvent.data.total_properties_count) {
        setTotalPropertiesCount(completionEvent.data.total_properties_count);
      }
    }
    
    // Reset processed properties when a new search starts
    const startEvent = allEvents.find(e => e.event_type === 'hotel_search_started');
    if (startEvent) {
      processedPropertyNames.current = new Set();
    }
    
    // Get all property batch events
    const batchEvents = allEvents.filter(e => e.event_type === 'properties_batch');
    
    if (batchEvents.length > 0) {
      setHasData(true);
      
      // Process all new properties from all batches
      const newPropertiesFromAllBatches: any[] = [];
      
      batchEvents.forEach(batchEvent => {
        if (batchEvent.data.properties && Array.isArray(batchEvent.data.properties)) {
          // Find new properties we haven't seen before
          const newProperties = batchEvent.data.properties.filter(
            (property: any) => !processedPropertyNames.current.has(property.name)
          );
          
          // Add to our new properties collection
          if (newProperties.length > 0) {
            newProperties.forEach((property: any) => {
              processedPropertyNames.current.add(property.name);
            });
            
            newPropertiesFromAllBatches.push(...newProperties);
          }
        }
      });
      
      // Update properties if we found new ones
      if (newPropertiesFromAllBatches.length > 0) {
        setAllProperties(prevProperties => {
          const combinedProperties = [...prevProperties, ...newPropertiesFromAllBatches];
          
          // Sort by price
          return combinedProperties.sort((a, b) => {
            const aPrice = a.rate_per_night?.extracted_lowest || Number.MAX_VALUE;
            const bPrice = b.rate_per_night?.extracted_lowest || Number.MAX_VALUE;
            return aPrice - bPrice;
          });
        });
      }
    }
    
    // Process hotel details if any
    const detailsEvent = allEvents.find(e => e.event_type === 'hotel_details');
    if (detailsEvent) {
      setPropertyDetails(detailsEvent.data.property);
      setHasData(true);
    }
  }, [allEvents]);
  
  // Use effect to handle single events (backward compatibility)
  useEffect(() => {
    // If we're using allEvents, skip the single event processing
    if (allEvents && allEvents.length > 0) return;
    
    if (event.event_type === 'hotel_search_started') {
      // Reset properties when a new search starts
      setAllProperties([]);
      setPropertyDetails(null);
      setSearchInfo(null);
      setTotalPropertiesCount(null);
      setHasData(false);
      setIsCompleted(false);
      // Clear processed property tracking
      processedPropertyNames.current = new Set();
    } else if (event.event_type === 'search_information') {
      setSearchInfo(event.data.search_information);
      // If we have a total_results or total_properties_count field, set it
      if (event.data.search_information?.total_results) {
        setTotalPropertiesCount(event.data.search_information.total_results);
      }
    } else if (event.event_type === 'properties_batch') {
      // Mark that we have data
      setHasData(true);
      
      // Process the properties batch
      if (event.data.properties && Array.isArray(event.data.properties)) {
        // Find new properties that we haven't processed yet
        const newProperties = event.data.properties.filter(
          (property: any) => !processedPropertyNames.current.has(property.name)
        );
        
        // If we have new properties, add them to our state
        if (newProperties.length > 0) {
          // Add all new property names to our processed set
          newProperties.forEach((property: any) => {
            processedPropertyNames.current.add(property.name);
          });
          
          // Update the allProperties state with the new properties
          setAllProperties(prevProperties => {
            const combinedProperties = [...prevProperties, ...newProperties];
            
            // Sort by price
            return combinedProperties.sort((a, b) => {
              const aPrice = a.rate_per_night?.extracted_lowest || Number.MAX_VALUE;
              const bPrice = b.rate_per_night?.extracted_lowest || Number.MAX_VALUE;
              return aPrice - bPrice;
            });
          });
        }
      }
    } else if (event.event_type === 'hotel_details') {
      // Set property details
      setPropertyDetails(event.data.property);
      setHasData(true);
    } else if (event.event_type === 'hotel_search_completed') {
      setIsCompleted(true);
      // Store the total properties count from the completion event
      if (event.data.total_properties_count) {
        setTotalPropertiesCount(event.data.total_properties_count);
        // If we have properties count but no properties yet, make sure hasData is true
        if (event.data.total_properties_count > 0) {
          setHasData(true);
        }
      }
    }
  }, [event.event_type, event.data, allEvents]);
  
  // Create enriched search params with metadata
  const getEnrichedSearchParams = () => {
    const params = event.data.search_parameters || {};
    return {
      ...params,
      total_properties_count: totalPropertiesCount
    };
  };
  
  // Render the hotel search results
  const renderContent = () => {
    // Show property details when viewing a single property
    if (propertyDetails) {
      return (
        <div className="overflow-hidden">
          <PropertyDetails 
            property={propertyDetails} 
            searchParams={getEnrichedSearchParams()} 
          />
        </div>
      );
    }
    
    // Show properties list if we have any properties
    if (allProperties.length > 0) {
      return (
        <PropertyList 
          properties={allProperties} 
          searchParams={getEnrichedSearchParams()}
        />
      );
    }
    
    // Show loading state
    if (event.event_type === 'hotel_search_started' || !isCompleted) {
      return (
        <div className="bg-white rounded-xl p-3 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Searching for hotels...</p>
        </div>
      );
    }
    
    // No results found
    return (
      <div className="bg-white rounded-xl p-3">
        <p className="text-sm text-gray-600">No hotels found matching your criteria.</p>
      </div>
    );
  };

  return (
    <div className="w-full mb-3">
      {renderContent()}
    </div>
  );
};

export default HotelSearch; 