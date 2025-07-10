import React from 'react';
import { motion } from 'framer-motion';
import { formatDuration, formatPrice } from './utils';

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
  price: number;
  type: string;
  departure_token: string;
}

interface OtherFlightsProps {
  other_flights: Flight[];
  search_parameters: {
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date?: string;
    currency: string;
    adults: number;
  };
}

const OtherFlights: React.FC<OtherFlightsProps> = ({ other_flights, search_parameters }) => {
  if (!other_flights || other_flights.length === 0) {
    return null;
  }

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

  // Create a simplified card for grid layout
  const renderFlightCard = (flight: Flight, index: number) => {
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
    const departureDate = formatDateDisplay(flight.flights[0].departure_airport.time || search_parameters.outbound_date);
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
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
              {formatPrice(flight.price, search_parameters.currency)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="my-4">
      <h3 className="text-gray-800 text-sm font-medium mb-4 flex items-center gap-2 px-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <path d="M22 2L11 13"></path>
          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
        <span>Other Flight Options</span> 
        <span className="text-xs py-0.5 px-2 bg-indigo-100 text-indigo-800 rounded-full ml-1">{other_flights.length}</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {other_flights.map((flight, index) => renderFlightCard(flight, index))}
      </div>
    </div>
  );
};

export default OtherFlights; 