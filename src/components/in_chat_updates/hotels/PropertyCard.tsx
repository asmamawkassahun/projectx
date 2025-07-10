import React from 'react';

interface PropertyCardProps {
  property: any;
  index: number;
  searchParams: any;
}

interface Transportation {
  type: string;
  duration: string;
}

interface NearbyPlace {
  name: string;
  category?: string;
  transportations?: Transportation[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index, searchParams }) => {
  // Extract property details
  const { 
    name, 
    description, 
    type, 
    logo, 
    images, 
    overall_rating, 
    reviews, 
    hotel_class, 
    extracted_hotel_class,
    eco_certified,
    location_rating,
    rate_per_night,
    total_rate,
    deal,
    deal_description,
    amenities = [],
    nearby_places = []
  } = property;

  // Format ratings and prices
  const rating = overall_rating ? overall_rating.toFixed(1) : null;
  const reviewCount = reviews ? reviews.toLocaleString() : '0';
  
  // Get the first image or fallback to a placeholder
  const featuredImage = images && images.length > 0 
    ? (images[0].thumbnail || images[0].original_image) 
    : 'https://via.placeholder.com/300x200?text=No+Image';
  
  // Select top amenities to display (max 2)
  const topAmenities = amenities.slice(0, 2);

  // Calculate star rating
  const renderStars = () => {
    if (!hotel_class && !extracted_hotel_class) return null;
    
    const stars = Math.round(extracted_hotel_class || parseInt(hotel_class?.split('-')[0]) || 0);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-2.5 h-2.5 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get closest attraction if available
  const closestAttraction = nearby_places?.find((place: NearbyPlace) => 
    place.category === 'Point of interest' || 
    place.category === 'Attraction' ||
    place.transportations?.some((t: Transportation) => t.type === 'Walking')
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="relative h-32">
        <img 
          src={featuredImage} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {rating && (
          <div className="absolute top-2 right-2 bg-white/90 shadow-sm text-gray-900 text-xs font-medium rounded-md px-1.5 py-0.5 flex items-center">
            <svg className="w-3 h-3 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{rating}</span>
          </div>
        )}
        
        {eco_certified && (
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-md flex items-center">
            <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Eco
          </div>
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1.5">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{name}</h3>
          
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <span className="capitalize">{type || 'Hotel'}</span>
            {reviews > 0 && (
              <>
                <span className="mx-1">•</span>
                <span>{reviewCount} {parseInt(reviewCount) === 1 ? 'review' : 'reviews'}</span>
              </>
            )}
          </div>
          
          {renderStars()}
        </div>
        
        {/* Location info */}
        {closestAttraction && closestAttraction.transportations && (
          <div className="mt-0.5 text-xs text-gray-600">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="truncate text-xs">Near {closestAttraction.name}</span>
            </div>
            {closestAttraction.transportations[0] && (
              <div className="ml-3.5 text-gray-500 text-xs">
                {closestAttraction.transportations[0].duration} ({closestAttraction.transportations[0].type})
              </div>
            )}
          </div>
        )}
        
        {/* Amenities */}
        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1 my-1.5">
            {topAmenities.map((amenity: string, i: number) => (
              <span 
                key={i} 
                className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        {rate_per_night?.lowest && (
          <div className="mt-auto pt-1.5 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-xs">Per night</div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-sm">
                  {rate_per_night.lowest}
                </div>
                {deal && (
                  <div className="text-xs text-red-600 font-medium">
                    {deal}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard; 