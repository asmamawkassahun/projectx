import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BestFlights from './BestFlights';
import OtherFlights from './OtherFlights';
import PriceInsights from './PriceInsights';
import AirportInfo from './AirportInfo';
import { formatDate, getTravelClassName, formatDuration, formatPrice } from './utils';

interface FlightDetails {
  departure_airport: {
    name?: string;
    code?: string;
    time?: string;
  };
  arrival_airport: {
    name?: string;
    code?: string;
    time?: string;
  };
  duration: number;
  airline: string;
  airline_logo: string;
  flight_number: string;
}

interface Flight {
  flights: FlightDetails[];
  layovers: {
    airport: string;
    duration: number;
  }[];
  total_duration: number;
  carbon_emissions?: {
    value: number;
    unit: string;
    display: string;
  };
  price: number;
  type: string;
  departure_token: string;
  is_best?: boolean; // New property to indicate if this is a "best" flight
}

interface FlightSearchProps {
  event: {
    event_type: string;
    data: any;
  };
}

const FlightSearch: React.FC<FlightSearchProps> = ({ event }) => {
  // Track the loading state of flight search
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasData, setHasData] = useState(false);
  // Track all flights across events for unified display (per component instance)
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  
  // Use effect to update state and collect flights
  useEffect(() => {
    if (event.event_type === 'flight_search_started') {
      // Reset flights when a new search starts
      setAllFlights([]);
      setHasData(false);
      setIsCompleted(false);
    } else if (event.event_type === 'flights_batch') {
      setHasData(true);
      // Add flights to our collection
      if (event.data.flights && Array.isArray(event.data.flights)) {
        setAllFlights(prev => {
          // Create a new array with unique flights based on price and departure details
          const newFlights = [...prev];
          event.data.flights.forEach((flight: Flight) => {
            // Check if this flight is already in our collection
            const exists = newFlights.some(f => 
              f.price === flight.price && 
              f.flights[0].departure_airport.time === flight.flights[0].departure_airport.time &&
              f.flights[0].flight_number === flight.flights[0].flight_number
            );
            
            if (!exists) {
              newFlights.push(flight);
            }
          });
          
          // Return sorted by price
          return newFlights.sort((a, b) => a.price - b.price);
        });
      }
    } else if (event.event_type === 'flight_search_completed') {
      setIsCompleted(true);
    }
  }, [event.event_type, event.data]);

  // Shared animation properties for consistency
  const containerAnimation = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };
  
  // Format time to HH:MM format
  const formatTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "";
    
    // Check if it already has time in it
    if (dateTimeStr.includes(':')) {
      // Extract just the time part (assuming format like "14:30" or "2023-04-29 14:30")
      const timePart = dateTimeStr.split(' ').pop() || dateTimeStr;
      if (timePart.includes(':')) return timePart;
    }
    
    // Try to parse as date and extract time
    try {
      const date = new Date(dateTimeStr);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (e) {
      return dateTimeStr;
    }
  };

  // Format date to YYYY-MM-DD
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    
    // If date is already in YYYY-MM-DD format, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // If date contains time, extract just the date part
    if (dateStr.includes(' ')) {
      const datePart = dateStr.split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
    }
    
    // Otherwise try to format it
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      return dateStr;
    }
  };

  // Render all flights in a unified display
  const renderAllFlights = () => {
    if (!allFlights || allFlights.length === 0) {
      return null;
    }

    return (
      <div className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allFlights.map((flight, index) => renderFlightCard(flight, index, event.data.search_parameters))}
        </div>
      </div>
    );
  };
  
  // Create a simplified card for grid layout
  const renderFlightCard = (flight: Flight, index: number, search_parameters: any) => {
    // Get departure/arrival details
    const departureTime = formatTime(flight.flights[0].departure_airport.time || "");
    const arrivalTime = formatTime(flight.flights[flight.flights.length - 1].arrival_airport.time || "");
    const departureCode = flight.flights[0].departure_airport.code;
    const arrivalCode = flight.flights[flight.flights.length - 1].arrival_airport.code;
    const duration = formatDuration(flight.total_duration);
    
    // Get airline details
    const airline = flight.flights[0].airline;
    const logo = flight.flights[0].airline_logo;
    const flightNumber = flight.flights[0].flight_number;

    // Get date from flight data or search parameters
    const departureDate = formatDateDisplay(flight.flights[0].departure_airport.time || search_parameters?.outbound_date);
    
    return (
      <motion.div
        key={`flight-${index}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`bg-white rounded-lg overflow-hidden border ${flight.is_best ? 'border-indigo-300' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}
      >
        {/* Best flight indicator */}
        {flight.is_best && (
          <div className="bg-indigo-600 text-white py-1 px-3 text-xs font-medium text-center">
            Best Flight
          </div>
        )}
        
        {/* Flight duration header */}
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 mr-2">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
            <span className="text-sm font-medium">{duration}</span>
          </div>
          
          {/* Direct or stops indicator */}
          {flight.flights.length > 1 ? (
            <div className="text-xs text-amber-700 font-medium bg-amber-50 py-1 px-2 rounded-full">
              {flight.flights.length === 2 ? "1 stop" : `${flight.flights.length - 1} stops`}
            </div>
          ) : (
            <div className="text-xs text-emerald-700 font-medium bg-emerald-50 py-1 px-2 rounded-full">
              Direct
            </div>
          )}
        </div>
        
        {/* Flight details */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Departure */}
            <div className="text-left">
              <div className="text-gray-900 text-xl font-bold">{departureTime}</div>
              <div className="text-gray-500 text-sm">{departureCode}</div>
              <div className="text-gray-400 text-xs mt-1">{departureDate}</div>
            </div>
            
            {/* Flight path visualization */}
            <div className="flex-1 mx-2 px-2">
              <div className="relative flex items-center justify-center">
                <div className="h-[1px] bg-gray-300 w-full"></div>
                <div className="absolute w-full flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 bg-white p-1">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Arrival */}
            <div className="text-right">
              <div className="text-gray-900 text-xl font-bold">{arrivalTime}</div>
              <div className="text-gray-500 text-sm">{arrivalCode}</div>
              <div className="text-gray-400 text-xs mt-1">{departureDate}</div>
            </div>
          </div>
          
          {/* Airline and price */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center">
              {logo ? (
                <div className="w-8 h-8 mr-2 flex items-center justify-center">
                  <img 
                    src={logo} 
                    alt={airline} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} 
                  />
                </div>
              ) : (
                <div className="w-8 h-8 mr-2 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-xs font-medium">
                  {airline.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-gray-700 text-sm">
                {airline} <span className="text-gray-500">{flightNumber}</span>
              </div>
            </div>
            <div className="text-indigo-600 font-bold text-lg">
              {formatPrice(flight.price, search_parameters?.currency)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Different components based on the event type
  switch (event.event_type) {
    case 'flight_search_started':
      return (
        <motion.div 
          {...containerAnimation}
          className="my-3 px-4 py-3 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-md shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="text-indigo-800 text-sm font-medium">
              Finding available flights
            </div>
          </div>
        </motion.div>
      );
      
    case 'flight_airports':
      return <AirportInfo airports={event.data.airports} search_parameters={event.data.search_parameters} />;
      
    case 'flights_batch':
      // Only render flights if we actually have some
      return allFlights.length > 0 ? renderAllFlights() : null;
      
    case 'price_insights':
      return (
        <PriceInsights 
          price_insights={event.data.price_insights} 
          currency={event.data.currency} 
          search_parameters={event.data.search_parameters} 
        />
      );
      
    case 'flight_search_completed':
      if (!hasData && !event.data.has_flights) {
        return (
          <motion.div 
            {...containerAnimation}
            className="my-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <div className="text-gray-900 font-medium text-base mb-1">No flights found</div>
                <div className="text-gray-600 text-sm">
                  We couldn't find any flights matching your search criteria. 
                  Try adjusting your dates or airports for better results.
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
      
      // Search summary - only shown when the search is completed and has results
      if (event.data.has_flights) {
        return (
          <motion.div 
            {...containerAnimation}
            className="my-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <div className="text-gray-900 font-medium text-base mb-1">
                  Found {event.data.total_flights_count} flights
                </div>
                <div className="text-gray-600 text-sm">
                  From {event.data.search_parameters.departure_id} to {event.data.search_parameters.arrival_id}
                </div>
              </div>
            </div>
            
            {/* Search parameters summary */}
            <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <div className="text-gray-500 text-xs mb-1">Departure Date</div>
                <div className="text-gray-800 text-sm font-medium">
                  {formatDate(event.data.search_parameters.outbound_date)}
                </div>
              </div>
              
              {event.data.search_parameters.return_date && (
                <div className="flex flex-col">
                  <div className="text-gray-500 text-xs mb-1">Return Date</div>
                  <div className="text-gray-800 text-sm font-medium">
                    {formatDate(event.data.search_parameters.return_date)}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col">
                <div className="text-gray-500 text-xs mb-1">Passengers</div>
                <div className="text-gray-800 text-sm font-medium">
                  {event.data.search_parameters.adults} Adult{event.data.search_parameters.adults !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="text-gray-500 text-xs mb-1">Class</div>
                <div className="text-gray-800 text-sm font-medium">
                  {getTravelClassName(event.data.search_parameters.travel_class)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
      
      // Show all collected flights on completion if we have any
      return allFlights.length > 0 ? renderAllFlights() : null;
      
    default:
      return null;
  }
};

export default FlightSearch; 