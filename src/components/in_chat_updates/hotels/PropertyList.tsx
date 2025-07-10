import React from 'react';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: any[];
  searchParams: any;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, searchParams }) => {
  // Calculate properties info
  const displayedCount = properties.length;

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden">
      {/* Compact header with search destination */}
      {searchParams.q && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center">
          <div className="text-sm text-gray-600 flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="font-medium">{searchParams.q}</span>
          </div>
          {/* Dates display */}
          {searchParams.check_in_date && searchParams.check_out_date && (
            <div className="ml-auto text-xs text-gray-500">
              {new Date(searchParams.check_in_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} 
              {' — '} 
              {new Date(searchParams.check_out_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
            </div>
          )}
        </div>
      )}
      
      {/* Properties horizontal scroll container */}
      <div className="pt-3 pb-5 px-4">
        {properties.length > 0 ? (
          <div className="overflow-x-auto -mx-4 pb-3 hide-scrollbar">
            <div className="flex px-4 space-x-3">
              {properties.map((property, index) => (
                <div 
                  key={`${property.name}-${index}`} 
                  className="flex-shrink-0 w-64 transition-all duration-200 hover:-translate-y-1"
                >
                  <PropertyCard 
                    property={property}
                    index={index}
                    searchParams={searchParams}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-xs text-gray-600">Loading properties...</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PropertyList; 