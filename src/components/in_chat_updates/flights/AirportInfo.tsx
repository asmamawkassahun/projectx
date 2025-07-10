import React from 'react';
import { motion } from 'framer-motion';

interface Airport {
  name: string;
  code: string;
  time_zone?: string;
  city?: string;
  country?: string;
}

interface AirportInfoProps {
  airports: Record<string, Airport>;
  search_parameters: {
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date?: string;
  };
}

const AirportInfo: React.FC<AirportInfoProps> = ({ airports, search_parameters }) => {
  if (!airports || Object.keys(airports).length === 0) {
    return null;
  }

  const departureAirport = airports[search_parameters.departure_id];
  const arrivalAirport = airports[search_parameters.arrival_id];

  if (!departureAirport || !arrivalAirport) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <h3 className="text-gray-800 text-sm font-medium mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
        </svg>
        <span>Flight Route</span>
      </h3>

      <div className="relative flex flex-col sm:flex-row gap-8 sm:gap-4">
        {/* Connection line for visual effect */}
        <div className="hidden sm:block absolute left-[145px] top-1/2 w-[calc(100%-290px)] h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
        
        {/* Departure Airport */}
        <div className="relative z-10 p-4 bg-gray-50 rounded-lg flex-1 border border-gray-100">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-6l-4 4V4l4 4h6"></path>
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Departure</div>
              <div className="text-gray-900 font-semibold">{departureAirport.name}</div>
              <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                {departureAirport.code}
              </div>
            </div>
          </div>
          
          <div className="ml-14 text-sm text-gray-600">
            {(departureAirport.city || departureAirport.country) && (
              <div className="flex items-center gap-1 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{departureAirport.city}{departureAirport.city && departureAirport.country ? ', ' : ''}
                {departureAirport.country}</span>
              </div>
            )}
            
            {departureAirport.time_zone && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{departureAirport.time_zone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Direction arrow (only visible on larger screens) */}
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full w-10 h-10 items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </div>

        {/* Arrival Airport */}
        <div className="relative z-10 p-4 bg-gray-50 rounded-lg flex-1 border border-gray-100">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-6l-4 4V4l4 4h6"></path>
                <path d="M22 18h-6l-4 4V10l4 4h6"></path>
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Arrival</div>
              <div className="text-gray-900 font-semibold">{arrivalAirport.name}</div>
              <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                {arrivalAirport.code}
              </div>
            </div>
          </div>
          
          <div className="ml-14 text-sm text-gray-600">
            {(arrivalAirport.city || arrivalAirport.country) && (
              <div className="flex items-center gap-1 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{arrivalAirport.city}{arrivalAirport.city && arrivalAirport.country ? ', ' : ''}
                {arrivalAirport.country}</span>
              </div>
            )}
            
            {arrivalAirport.time_zone && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{arrivalAirport.time_zone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AirportInfo; 