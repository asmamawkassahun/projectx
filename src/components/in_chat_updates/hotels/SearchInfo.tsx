import React from 'react';
import { motion } from 'framer-motion';

interface SearchInfoProps {
  searchInfo: any;
  searchParams: any;
}

const SearchInfo: React.FC<SearchInfoProps> = ({ searchInfo, searchParams }) => {
  // Extract search parameters
  const { 
    q, 
    check_in_date, 
    check_out_date, 
    adults, 
    children, 
    currency,
    eco_certified
  } = searchParams;
  
  // Get search information
  const { total_results } = searchInfo || {}; 

  // Get total properties count from the event data if available
  const totalCount = searchInfo?.total_properties_count || total_results || 0;
  const limitedCount = searchInfo?.limited_properties_count || totalCount;
  const isLimited = limitedCount < totalCount;
  
  // Calculate stay duration
  const calculateNights = () => {
    try {
      const startDate = new Date(check_in_date);
      const endDate = new Date(check_out_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 1; // Default to 1 night if dates can't be parsed
    }
  };
  
  const stayDuration = calculateNights();

  return (
    <div className="bg-white p-5 border-b border-gray-100">
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">
          Hotels in {q}
        </h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="inline-flex items-center text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {check_in_date} to {check_out_date}
        </div>
        
        <div className="inline-flex items-center text-gray-700 text-sm bg-gray-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {adults} {parseInt(adults) === 1 ? 'adult' : 'adults'}
          {children && parseInt(children) > 0 && (
            <>, {children} {parseInt(children) === 1 ? 'child' : 'children'}</>
          )}
        </div>
        
        <div className="inline-flex items-center text-gray-700 text-sm bg-gray-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {currency}
        </div>
      </div>
      
      <div className="text-sm font-medium">
        {totalCount > 0 ? (
          <div className="text-blue-600 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Found {totalCount} {parseInt(totalCount.toString()) === 1 ? 'property' : 'properties'}
          </div>
        ) : (
          <div className="flex items-center text-blue-600">
            <svg className="w-4 h-4 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching for properties...
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInfo; 