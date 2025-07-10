import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import WebSearchResults from './WebSearchResults';
import FlightSearch from './flights';
import HotelSearch from './hotels';
import ImageGeneration from './images/ImageGeneration';
import VideoGeneration from './videos/VideoGeneration';
import VideoStatus from './videos/VideoStatus';
import ImageSearchResults from './search/ImageSearchResults';
import AudioGeneration from './audio/AudioGeneration';
import AudioStatus from './audio/AudioStatus';
import AudioSearch from './audio/AudioSearch';

// Types
interface InChatUpdate {
  id: string;
  tool: string;
  event_type: string;
  data: any;
  timestamp: Date;
  // Session ID could be within data.search_parameters
}

interface InChatUpdatesProps {
  updates: InChatUpdate[];
}

const InChatUpdates: React.FC<InChatUpdatesProps> = ({ updates }) => {
  // Early return for empty updates
  if (!updates || updates.length === 0) {
    return null;
  }
  
  // Get the tool type from the first update (assuming all updates in one message are from the same tool)
  const tool = updates[0]?.tool;
  
  // For hotel search, organize updates by session ID
  const hotelSessionGroups = useMemo(() => {
    if (tool !== 'hotel_search') return [];
    
    const groups = new Map();
    
    updates.forEach(update => {
      // Get session ID from search parameters if available
      const sessionId = update.data?.search_parameters?.session_id || 'default';
      
      if (!groups.has(sessionId)) {
        groups.set(sessionId, []);
      }
      
      groups.get(sessionId).push(update);
    });
    
    return Array.from(groups.values());
  }, [tool, updates]);
  
  // Route to appropriate component based on tool
  switch (tool) {
    case 'web_search':
      return <WebSearchResults events={updates} />;
    
    case 'flight_search':
      // For flight search, we pass each update individually to the FlightSearch component
      return (
        <div className="space-y-2">
          {updates.map((update) => (
            <FlightSearch key={update.id} event={update} />
          ))}
        </div>
      );
    
    case 'hotel_search':
      // For hotel search, render a single component for each session and pass all session events
      return (
        <div className="space-y-2">
          {hotelSessionGroups.map((sessionUpdates, index) => {
            // Find the search_information update, if available
            const searchInfo = sessionUpdates.find((update: InChatUpdate) => 
              update.event_type === 'search_information'
            );
            
            // Find all property batch updates
            const propertyBatches = sessionUpdates.filter((update: InChatUpdate) => 
              update.event_type === 'properties_batch'
            );
            
            // Find a completion event if available
            const completionEvent = sessionUpdates.find((update: InChatUpdate) => 
              update.event_type === 'hotel_search_completed'
            );
            
            // Choose the most informative event to display
            // Priority: Property batches > Search info > Completion > Latest event
            const displayEvent = propertyBatches.length > 0 
              ? propertyBatches[propertyBatches.length - 1] // Use latest batch for component key
              : searchInfo || completionEvent || sessionUpdates[sessionUpdates.length - 1];
                
            return (
              <div key={`hotel-session-${index}`}>
                <HotelSearch 
                  key={displayEvent.id} 
                  event={displayEvent}
                  allEvents={sessionUpdates} // Pass all events of this session
                />
              </div>
            );
          })}
        </div>
      );
    
    case 'image_generation':
      // For image generation, find the image_generated event if it exists
      const imageEvent = updates.find(update => update.event_type === 'image_generated');
      if (imageEvent) {
        return <ImageGeneration data={imageEvent.data} />;
      }
      return null;
    
    case 'image_search':
      // For image search, process results
      const imageSearchResults = updates.find(update => update.event_type === 'image_results');
      
      if (imageSearchResults) {
        // Format the data for the component
        const formattedData = {
          results: imageSearchResults.data.images || [],
          query: imageSearchResults.data.query
        };
        
        return <ImageSearchResults data={formattedData} />;
      }
      
      // Show searching state if we have a search_started event but no results yet
      const searchStarted = updates.find(update => update.event_type === 'search_started');
      if (searchStarted) {
        return (
          <div className="w-full bg-white border border-indigo-100 rounded-lg p-3 mb-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span className="text-indigo-700 text-sm font-medium">Searching for images...</span>
              </div>
              <div className="flex items-center">
                <motion.div
                  className="flex space-x-1"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.15
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, index) => (
                <motion.div 
                  key={index}
                  className="aspect-square rounded-md bg-indigo-50 border border-indigo-100"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: index * 0.1,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </div>
        );
      }
      
      // Show error state if we have a search_error event
      const errorEvent = updates.find(update => update.event_type === 'search_error');
      if (errorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Image search failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{errorEvent.data.error || "An error occurred while searching for images"}</div>
          </div>
        );
      }
      
      return null;
    
    case 'video_generation':
      // For video generation, find the video_generated event if it exists
      const videoEvent = updates.find(update => update.event_type === 'video_generated');
      if (videoEvent) {
        return <VideoGeneration data={videoEvent.data} />;
      }
      
      // Handle different status update types with our VideoStatus component
      const statusEvents = ['generation_started', 'status_checking', 'status_update'];
      const statusEvent = updates.find(update => statusEvents.includes(update.event_type));
      
      if (statusEvent) {
        return <VideoStatus eventType={statusEvent.event_type} data={statusEvent.data} />;
      }
      
      // Show error state if we have a generation_error event
      const videoErrorEvent = updates.find(update => update.event_type === 'generation_error');
      if (videoErrorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Video generation failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{videoErrorEvent.data.error || "An error occurred while generating the video"}</div>
          </div>
        );
      }
      
      return null;
    
    case 'audio_generation':
      // For audio generation, process different event types
      const voiceEvent = updates.find(update => update.event_type === 'voice_generated');
      const soundEvent = updates.find(update => update.event_type === 'sound_effect_generated');
      const popularAudioEvent = updates.find(update => update.event_type === 'popular_audio_generated');
      
      if (voiceEvent) {
        return <AudioGeneration {...voiceEvent.data} action="text_to_speech" />;
      }
      
      if (soundEvent) {
        return <AudioGeneration {...soundEvent.data} action="sound_effect" />;
      }
      
      // For backward compatibility - redirect popular audio events to AudioSearch
      if (popularAudioEvent) {
        return <AudioSearch data={popularAudioEvent.data} />;
      }
      
      // Handle different status update types with our AudioStatus component
      const audioStatusEvents = ['generation_started', 'status_checking', 'status_update'];
      const audioStatusEvent = updates.find(update => audioStatusEvents.includes(update.event_type));
      
      if (audioStatusEvent) {
        return <AudioStatus 
          eventType={audioStatusEvent.event_type} 
          data={audioStatusEvent.data} 
        />;
      }
      
      // Show error state if we have a generation_error event
      const audioErrorEvent = updates.find(update => update.event_type === 'generation_error');
      if (audioErrorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Audio generation failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{audioErrorEvent.data.error || "An error occurred while generating audio"}</div>
          </div>
        );
      }
      
      return null;
    
    case 'voice_generation':
      // For backward compatibility - redirect to AudioGeneration with appropriate props
      const legacyVoiceEvent = updates.find(update => update.event_type === 'voice_generated');
      if (legacyVoiceEvent) {
        return <AudioGeneration 
          {...legacyVoiceEvent.data}
          action="text_to_speech" 
        />;
      }
      
      // Handle different status update types with AudioStatus component
      const voiceStatusEvents = ['generation_started', 'status_checking', 'status_update', 'processing_complete'];
      const voiceStatusEvent = updates.find(update => voiceStatusEvents.includes(update.event_type));
      
      if (voiceStatusEvent) {
        return <AudioStatus 
          eventType={voiceStatusEvent.event_type} 
          data={{
            ...voiceStatusEvent.data,
            action: "text_to_speech"
          }} 
        />;
      }
      
      // Show error state if we have a generation_error event
      const voiceErrorEvent = updates.find(update => update.event_type === 'generation_error');
      if (voiceErrorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Voice generation failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{voiceErrorEvent.data.error || "An error occurred while generating the voice"}</div>
          </div>
        );
      }
      
      return null;
      
    case 'sound_effects_generation':
      // For backward compatibility - redirect to AudioGeneration with appropriate props
      const legacySoundEvent = updates.find(update => update.event_type === 'sound_effect_generated');
      if (legacySoundEvent) {
        // Normalize the data structure to match what AudioGeneration component expects
        const normalizedData = {
          ...legacySoundEvent.data,
          action: 'sound_effect',
          // Map duration_seconds to approx_duration
          approx_duration: legacySoundEvent.data.duration_seconds
        };
        
        return <AudioGeneration {...normalizedData} />;
      }
      
      // Handle different status update types with AudioStatus component
      const soundStatusEvents = ['generation_started', 'status_checking', 'status_update', 'processing_complete'];
      const soundStatusEvent = updates.find(update => soundStatusEvents.includes(update.event_type));
      
      if (soundStatusEvent) {
        return <AudioStatus 
          eventType={soundStatusEvent.event_type} 
          data={{
            ...soundStatusEvent.data,
            action: "sound_effect"
          }} 
        />;
      }
      
      // Show error state if we have a generation_error event
      const soundErrorEvent = updates.find(update => update.event_type === 'generation_error');
      if (soundErrorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Sound effect generation failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{soundErrorEvent.data.error || "An error occurred while generating the sound effect"}</div>
          </div>
        );
      }
      
      return null;
    
    case 'audio_search':
      // For audio search, handle audio_found event
      const audioFoundEvent = updates.find(update => update.event_type === 'audio_found');
      if (audioFoundEvent) {
        return <AudioSearch data={audioFoundEvent.data} />;
      }
      
      // Handle different status update types with our AudioStatus component
      const audioSearchStatusEvents = ['search_started', 'status_update'];
      const audioSearchStatusEvent = updates.find(update => audioSearchStatusEvents.includes(update.event_type));
      
      if (audioSearchStatusEvent) {
        return <AudioStatus 
          eventType={audioSearchStatusEvent.event_type} 
          data={audioSearchStatusEvent.data} 
        />;
      }
      
      // Show error state if we have a search_error event
      const audioSearchErrorEvent = updates.find(update => update.event_type === 'search_error');
      if (audioSearchErrorEvent) {
        return (
          <div className="w-full max-w-[500px] overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm p-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-indigo-700">Audio search failed</div>
            </div>
            <div className="mt-2 text-xs text-indigo-500">{audioSearchErrorEvent.data.error || "An error occurred while searching for audio"}</div>
          </div>
        );
      }
      
      return null;
    
    // Add more tool handlers here
    
    default:
      return (
        <div className="w-full bg-indigo-900/10 border border-indigo-700/20 rounded-lg p-2">
          <div className="text-indigo-300 text-xs">
            <div className="font-medium mb-1">Tool: {tool}</div>
            <div className="text-xs text-indigo-400">
              {updates.length} update{updates.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      );
  }
};

export default InChatUpdates; 