import React, { useState } from 'react';

interface PropertyDetailsProps {
  property: any;
  searchParams: any;
}

interface NearbyPlace {
  category?: string;
  name: string;
  thumbnail?: string;
  transportations?: {
    type: string;
    duration: string;
  }[];
}

interface ImageItem {
  thumbnail?: string;
  original_image?: string;
}

interface PriceItem {
  source: string;
  logo?: string;
  official?: boolean;
  rate_per_night?: {
    lowest?: string;
  };
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, searchParams }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Extract property details
  const { 
    name, 
    description, 
    type, 
    address,
    phone,
    phone_link,
    gps_coordinates,
    logo, 
    images = [], 
    overall_rating, 
    reviews, 
    hotel_class, 
    extracted_hotel_class,
    eco_certified,
    location_rating,
    rate_per_night,
    total_rate,
    nearby_places = [],
    amenities = [],
    excluded_amenities = [],
    essential_info = [],
    deal,
    deal_description,
    prices = [],
    featured_prices = [],
    typical_price_range,
  } = property;

  // Format data for display
  const rating = overall_rating ? overall_rating.toFixed(1) : 'N/A';
  const reviewCount = reviews ? reviews.toLocaleString() : '0';
  
  // Get nearby attraction & place categories
  const nearbyAttractions = nearby_places.filter((place: NearbyPlace) => 
    place.category === 'Point of interest' || place.category === 'Attraction'
  ).slice(0, 2);
  
  // Get all images or placeholder
  const allImages = images.length > 0 
    ? images.map((img: ImageItem) => img.thumbnail || img.original_image) 
    : ['https://via.placeholder.com/800x500?text=No+Image'];

  // Get at most 3 best prices
  const bestPrices = prices.slice(0, 3);
  
  // Calculate stay duration
  const calculateNights = () => {
    try {
      const startDate = new Date(searchParams.check_in_date);
      const endDate = new Date(searchParams.check_out_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 1; // Default to 1 night if dates can't be parsed
    }
  };

  // Render star rating based on hotel class
  const renderStars = () => {
    if (!hotel_class && !extracted_hotel_class) return null;
    
    const stars = Math.round(extracted_hotel_class || parseInt(hotel_class?.split('-')[0]) || 0);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-3 h-3 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Header with back button */}
      <div className="px-3 py-2 flex items-center border-b border-gray-100">
        <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Hero image */}
      <div className="h-52 overflow-hidden relative">
        <img 
          src={allImages[activeImageIndex]} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 text-gray-900 text-xs font-medium px-1.5 py-0.5 rounded-md shadow-sm flex items-center">
            <svg className="w-3 h-3 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </div>
        </div>
        
        {/* Eco certification badge */}
        {eco_certified && (
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-md flex items-center shadow-sm">
            <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Eco
          </div>
        )}
      </div>
      
      {/* Image thumbnails */}
      {allImages.length > 1 && (
        <div className="flex p-2 overflow-x-auto gap-2 bg-white border-b border-gray-100 hide-scrollbar">
          {allImages.slice(0, 5).map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`shrink-0 h-12 w-12 rounded-md overflow-hidden border-2 ${
                idx === activeImageIndex 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      
      {/* Content area */}
      <div className="p-3">
        <h1 className="text-base font-semibold text-gray-900">{name}</h1>
        
        <div className="flex items-center text-xs text-gray-600 mt-1 mb-1">
          <span className="capitalize">{type || 'Hotel'}</span>
          
          {renderStars()}
          
          {address && (
            <>
              <span className="mx-1.5">•</span>
              <span className="truncate text-xs">{address}</span>
            </>
          )}
        </div>
        
        {/* Location rating if available */}
        {location_rating && (
          <div className="mt-1 flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-xs">Location rating: {location_rating}/10</span>
          </div>
        )}
        
        {/* Price */}
        {rate_per_night?.lowest && (
          <div className="mt-3 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-end">
              <span className="text-base font-bold text-gray-900">
                {rate_per_night.lowest}
              </span>
              {deal && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                  {deal}
                </span>
              )}
            </div>
            
            {deal_description && (
              <div className="mt-0.5 text-xs text-red-600 font-medium">
                {deal_description}
              </div>
            )}
            
            <div className="text-xs text-gray-600 mt-1">
              {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}, {searchParams.adults} {parseInt(searchParams.adults) === 1 ? 'adult' : 'adults'}
            </div>
            
            {typical_price_range && (
              <div className="text-xs text-gray-500 mt-0.5">
                Typical price range: {typical_price_range}
              </div>
            )}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              {description.length > 120 ? `${description.substring(0, 120)}...` : description}
            </p>
          </div>
        )}
      </div>
      
      {/* Amenities */}
      {amenities.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-1.5">
            {amenities.slice(0, 6).map((amenity: string, index: number) => (
              <div key={index} className="bg-gray-50 px-2 py-1 rounded-md text-xs text-gray-600">
                {amenity}
              </div>
            ))}
          </div>
          {amenities.length > 6 && (
            <button className="mt-2 text-xs text-blue-600 font-medium">
              +{amenities.length - 6} more
            </button>
          )}
        </div>
      )}
      
      {/* Nearby places */}
      {nearbyAttractions.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-2">Nearby attractions</h2>
          {nearbyAttractions.map((place: NearbyPlace, index: number) => (
            <div key={index} className="flex items-start mb-2">
              {place.thumbnail && (
                <img 
                  src={place.thumbnail} 
                  alt={place.name} 
                  className="h-10 w-10 rounded-md object-cover mr-2"
                />
              )}
              <div>
                <div className="font-medium text-xs text-gray-900">{place.name}</div>
                {place.transportations && place.transportations.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {place.transportations[0].duration} ({place.transportations[0].type})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Price comparison */}
      {bestPrices.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-2">Compare prices</h2>
          {bestPrices.map((price: PriceItem, index: number) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                {price.logo && (
                  <img 
                    src={price.logo} 
                    alt={price.source} 
                    className="h-5 w-auto mr-2"
                  />
                )}
                <span className="text-xs text-gray-700">{price.source}</span>
                {price.official && (
                  <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                    Official
                  </span>
                )}
              </div>
              <div className="font-medium text-sm text-gray-900">
                {price.rate_per_night?.lowest || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
      
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

export default PropertyDetails; 