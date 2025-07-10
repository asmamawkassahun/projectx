// Types
interface InChatUpdate {
  id: string;
  tool: string;
  event_type: string;
  data: any;
  timestamp: Date;
}

interface CardDeck {
  title: string;
  description: string;
  cards: Card[];
}

interface Card {
  id: number | string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  rating?: number;
  tags: string[];
}

// Transform image generation updates to card deck format
export const transformImageGenerationUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const imageUpdates = updates.filter(
    update => update.event_type === 'image_generated' && update.data.image_url
  );

  if (imageUpdates.length === 0) return null;

  const cards: Card[] = imageUpdates.map((update, index) => ({
    id: update.id,
    title: `Generated Image ${index + 1}`,
    description: `AI-generated image (${update.data.width || 512}×${update.data.height || 512})`,
    longDescription: `This image was generated using AI technology. Dimensions: ${update.data.width || 512}×${update.data.height || 512} pixels. Created on ${new Date(update.timestamp).toLocaleDateString()}.`,
    image: update.data.image_url,
    tags: [
      'AI Generated',
      `${update.data.width || 512}×${update.data.height || 512}`,
      new Date(update.timestamp).toLocaleDateString()
    ].filter(Boolean)
  }));

  return {
    title: 'Generated Images',
    description: `${cards.length} AI-generated image${cards.length > 1 ? 's' : ''} created for your request.`,
    cards
  };
};

// Transform web search updates to card deck format
export const transformWebSearchUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  // Look for organic results batch events that contain actual search results
  const organicResultsUpdates = updates.filter(
    update => update.event_type === 'organic_results_batch' && 
               update.data.organic_results && 
               Array.isArray(update.data.organic_results)
  );

  if (organicResultsUpdates.length === 0) return null;

  // Extract all organic results from all batches
  const allResults = organicResultsUpdates.flatMap(update => 
    update.data.organic_results || []
  ).filter(result => result && result.title);
  
  if (allResults.length === 0) return null;

  // Get query from search_started event if available
  const searchStartedEvent = updates.find(update => update.event_type === 'search_started');
  const query = searchStartedEvent?.data?.query || 'Search Results';

  const cards: Card[] = allResults.slice(0, 10).map((result, index) => ({
    id: `search-${index}`,
    title: result.title,
    description: result.snippet || 'Web search result',
    longDescription: result.snippet || 'No additional content available.',
    image: result.thumbnail || result.favicon || '/globe.svg',
    tags: [
      'Web Search',
      result.displayed_link || new URL(result.link).hostname,
      `Position ${result.position || index + 1}`
    ].filter(Boolean)
  }));

  return {
    title: 'Web Search Results',
    description: `Found ${cards.length} result${cards.length > 1 ? 's' : ''} for "${query}"`,
    cards
  };
};

// Transform video generation updates to card deck format
export const transformVideoGenerationUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const videoUpdates = updates.filter(
    update => update.event_type === 'video_generated' && update.data.video_url
  );

  if (videoUpdates.length === 0) return null;

  const cards: Card[] = videoUpdates.map((update, index) => ({
    id: update.id,
    title: `Generated Video ${index + 1}`,
    description: update.data.prompt || 'AI-generated video',
    longDescription: update.data.prompt ? 
      `This video was generated using AI with the prompt: "${update.data.prompt}". Duration: ${update.data.duration || 'Unknown'} seconds.` :
      'This video was generated using AI technology.',
    image: update.data.thumbnail_url || '/file.svg',
    tags: [
      'AI Generated',
      'Video',
      update.data.duration ? `${update.data.duration}s` : 'Unknown Duration',
      new Date(update.timestamp).toLocaleDateString()
    ].filter(Boolean)
  }));

  return {
    title: 'Generated Videos',
    description: `${cards.length} AI-generated video${cards.length > 1 ? 's' : ''} created for your request.`,
    cards
  };
};

// Transform audio generation updates to card deck format
export const transformAudioGenerationUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const audioUpdates = updates.filter(
    update => update.event_type === 'audio_generated' && update.data.audio_url
  );

  if (audioUpdates.length === 0) return null;

  const cards: Card[] = audioUpdates.map((update, index) => ({
    id: update.id,
    title: `Generated Audio ${index + 1}`,
    description: update.data.prompt || update.data.text || 'AI-generated audio',
    longDescription: update.data.prompt || update.data.text ? 
      `This audio was generated using AI with the text: "${update.data.prompt || update.data.text}". Duration: ${update.data.duration || 'Unknown'} seconds.` :
      'This audio was generated using AI technology.',
    image: '/file.svg',
    tags: [
      'AI Generated',
      'Audio',
      update.data.voice || 'Default Voice',
      update.data.duration ? `${update.data.duration}s` : 'Unknown Duration'
    ].filter(Boolean)
  }));

  return {
    title: 'Generated Audio',
    description: `${cards.length} AI-generated audio clip${cards.length > 1 ? 's' : ''} created for your request.`,
    cards
  };
};

// Transform hotel search updates to card deck format
export const transformHotelSearchUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const hotelUpdates = updates.filter(
    update => update.event_type === 'properties_batch' && 
               update.data.properties && 
               Array.isArray(update.data.properties)
  );

  if (hotelUpdates.length === 0) return null;

  const allHotels = hotelUpdates.flatMap(update => update.data.properties || []);
  
  const cards: Card[] = allHotels.slice(0, 10).map((hotel, index) => ({
    id: `hotel-${index}`,
    title: hotel.name || `Hotel ${index + 1}`,
    description: `${hotel.location || 'Unknown location'} • ${hotel.rate_per_night?.lowest || 'Price on request'}`,
    longDescription: hotel.description || `Located in ${hotel.location || 'an unknown location'}, this hotel offers various amenities.`,
    image: hotel.images?.[0] || '/travel-image.png',
    rating: hotel.overall_rating,
    tags: [
      'Hotel',
      hotel.location || 'Unknown Location',
      hotel.rate_per_night?.lowest || 'Price Available',
      hotel.class ? `${hotel.class} Star` : 'Unrated'
    ].filter(Boolean)
  }));

  return {
    title: 'Hotel Search Results',
    description: `Found ${cards.length} hotel${cards.length > 1 ? 's' : ''} matching your search criteria.`,
    cards
  };
};

// Transform flight search updates to card deck format
export const transformFlightSearchUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const flightUpdates = updates.filter(
    update => update.event_type === 'flight_results' && update.data.flights
  );

  if (flightUpdates.length === 0) return null;

  const allFlights = flightUpdates.flatMap(update => update.data.flights || []);
  
  const cards: Card[] = allFlights.slice(0, 10).map((flight, index) => ({
    id: `flight-${index}`,
    title: `${flight.airline || 'Flight'} ${flight.flight_number || index + 1}`,
    description: `${flight.departure_city || 'Unknown'} → ${flight.arrival_city || 'Unknown'} • ${flight.price || 'Price on request'}`,
    longDescription: `Flight from ${flight.departure_city || 'unknown departure'} to ${flight.arrival_city || 'unknown destination'}. Departure: ${flight.departure_time || 'TBD'}, Arrival: ${flight.arrival_time || 'TBD'}. Duration: ${flight.duration || 'Unknown'}.`,
    image: '/travel-image.png',
    tags: [
      'Flight',
      flight.airline || 'Unknown Airline',
      flight.duration || 'Unknown Duration',
      flight.stops === 0 ? 'Direct' : flight.stops ? `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}` : 'Unknown Stops'
    ].filter(Boolean)
  }));

  return {
    title: 'Flight Search Results',
    description: `Found ${cards.length} flight${cards.length > 1 ? 's' : ''} matching your search criteria.`,
    cards
  };
};

// Transform image search updates to card deck format
export const transformImageSearchUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  const imageSearchUpdates = updates.filter(
    update => update.event_type === 'image_results' && update.data.images
  );

  if (imageSearchUpdates.length === 0) return null;

  const allImages = imageSearchUpdates.flatMap(update => update.data.images || []);
  
  const cards: Card[] = allImages.slice(0, 15).map((image, index) => ({
    id: `image-search-${index}`,
    title: image.title || `Image ${index + 1}`,
    description: image.source || 'Search result image',
    longDescription: `Image found from ${image.source || 'web search'}. ${image.width && image.height ? `Dimensions: ${image.width}×${image.height}` : ''}`,
    image: image.original || image.thumbnail || '/file.svg',
    tags: [
      'Image Search',
      image.source || 'Web',
      image.width && image.height ? `${image.width}×${image.height}` : 'Unknown Size'
    ].filter(Boolean)
  }));

  // Get query from the update data
  const query = imageSearchUpdates[0]?.data?.query || 'Image Search';

  return {
    title: 'Image Search Results',
    description: `Found ${cards.length} image${cards.length > 1 ? 's' : ''} for "${query}"`,
    cards
  };
};

// Main transformer function that routes to appropriate transformer
export const transformInChatUpdates = (updates: InChatUpdate[]): CardDeck | null => {
  if (!updates || updates.length === 0) return null;

  const tool = updates[0]?.tool;
  console.log(`Transforming ${updates.length} updates for tool: ${tool}`, updates);

  switch (tool) {
    case 'image_generation':
      return transformImageGenerationUpdates(updates);
    case 'web_search':
      const result = transformWebSearchUpdates(updates);
      console.log('Web search transformation result:', result);
      return result;
    case 'video_generation':
      return transformVideoGenerationUpdates(updates);
    case 'audio_generation':
      return transformAudioGenerationUpdates(updates);
    case 'hotel_search':
      return transformHotelSearchUpdates(updates);
    case 'flight_search':
      return transformFlightSearchUpdates(updates);
    case 'image_search':
      return transformImageSearchUpdates(updates);
    default:
      console.log(`No transformer found for tool: ${tool}`);
      return null;
  }
}; 