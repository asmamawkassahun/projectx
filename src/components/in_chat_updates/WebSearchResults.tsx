import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HorizontalOrganicResults from './search/HorizontalOrganicResults';
import KnowledgeGraph from './search/KnowledgeGraph';
import NewsResults from './search/NewsResults';
import InlineImages from './search/InlineImages';
import InlineVideos from './search/InlineVideos';
import ShortVideos from './search/ShortVideos';
import ImmersiveProducts from './search/Products';
import LocalMapView from './search/LocalMap';

// Types for search data
interface ComponentCount {
  organic_results: number;
  has_local_map: boolean;
  has_local_results: boolean;
  has_immersive_products: boolean;
  has_inline_images: boolean;
  has_inline_videos: boolean;
  has_inline_video_carousels: boolean;
  has_knowledge_graph: boolean;
  has_news_results: boolean;
  has_short_videos: boolean;
}

interface SearchData {
  query: string;
  timestamp: string;
  organic_results: any[];
  local_map: any | null;
  local_results: any | null;
  immersive_products: any[] | null;
  inline_images: any[] | null;
  inline_videos: any[] | null;
  inline_video_carousels: any[] | null;
  knowledge_graph: any | null;
  news_results: any[] | null;
  short_videos: any[] | null;
  component_count: ComponentCount;
}

interface WebSearchResultsProps {
  events: any[];
}

const WebSearchResults: React.FC<WebSearchResultsProps> = ({ events }) => {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Process events to build complete search data
  useEffect(() => {
    if (!events || events.length === 0) return;

    // Extract the query from the first event
    let query = '';
    let timestamp = '';
    let componentCount: ComponentCount | null = null;
    
    // Initialize aggregated data
    const aggregatedData: SearchData = {
      query: '',
      timestamp: '',
      organic_results: [],
      local_map: null,
      local_results: null,
      immersive_products: [],
      inline_images: [],
      inline_videos: [],
      inline_video_carousels: [],
      knowledge_graph: null,
      news_results: [],
      short_videos: [],
      component_count: {
        organic_results: 0,
        has_local_map: false,
        has_local_results: false,
        has_immersive_products: false,
        has_inline_images: false,
        has_inline_videos: false,
        has_inline_video_carousels: false,
        has_knowledge_graph: false,
        has_news_results: false,
        has_short_videos: false
      }
    };

    // Process each event based on its type
    events.forEach(event => {
      const eventType = event.event_type;
      const data = event.data;

      // Handle initial search event
      if (eventType === 'search_started') {
        query = data.query;
        timestamp = data.timestamp;
        aggregatedData.query = query;
        aggregatedData.timestamp = timestamp;
      } 
      // Handle complete event with component count
      else if (eventType === 'search_completed') {
        componentCount = data.component_count;
        if (componentCount) {
          aggregatedData.component_count = componentCount;
        }
      }
      // Handle organic results (which may come in batches)
      else if (eventType === 'organic_results_batch') {
        if (data.organic_results && Array.isArray(data.organic_results)) {
          aggregatedData.organic_results.push(...data.organic_results);
        }
      }
      // Handle knowledge graph
      else if (eventType === 'knowledge_graph') {
        aggregatedData.knowledge_graph = data.knowledge_graph;
      }
      // Handle local map
      else if (eventType === 'local_map') {
        aggregatedData.local_map = data.local_map;
      }
      // Handle local results
      else if (eventType === 'local_results') {
        aggregatedData.local_results = data.local_results;
      }
      // Handle news results (may come in batches)
      else if (eventType === 'news_results' || eventType === 'news_results_batch') {
        if (data.news_results && Array.isArray(data.news_results)) {
          (aggregatedData.news_results as any[]).push(...data.news_results);
        }
      }
      // Handle inline images (may come in batches)
      else if (eventType === 'inline_images' || eventType === 'inline_images_batch') {
        if (data.inline_images && Array.isArray(data.inline_images)) {
          (aggregatedData.inline_images as any[]).push(...data.inline_images);
        }
      }
      // Handle inline videos
      else if (eventType === 'inline_videos') {
        if (data.inline_videos && Array.isArray(data.inline_videos)) {
          aggregatedData.inline_videos = data.inline_videos;
        }
      }
      // Handle inline video carousel
      else if (eventType === 'inline_video_carousel') {
        if (data.inline_video_carousel) {
          if (!aggregatedData.inline_video_carousels) {
            aggregatedData.inline_video_carousels = [];
          }
          aggregatedData.inline_video_carousels.push(data.inline_video_carousel);
        }
      }
      // Handle immersive products (may come in batches)
      else if (eventType === 'immersive_products' || eventType === 'immersive_products_batch') {
        if (data.immersive_products && Array.isArray(data.immersive_products)) {
          (aggregatedData.immersive_products as any[]).push(...data.immersive_products);
        }
      }
      // Handle short videos (may come in batches)
      else if (eventType === 'short_videos' || eventType === 'short_videos_batch') {
        if (data.short_videos && Array.isArray(data.short_videos)) {
          (aggregatedData.short_videos as any[]).push(...data.short_videos);
        }
      }
    });

    // Update the state with aggregated data
    setSearchData(aggregatedData);
    setLoading(false);
  }, [events]);

  // If no search data, show loading
  if (loading || !searchData) {
    return (
      <div className="w-full bg-white border border-indigo-100 rounded-lg p-2 mb-2 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="text-indigo-700 text-xs font-medium">Searching...</span>
        </div>
        <div className="flex items-center">
          <motion.div 
            className="h-1 bg-indigo-50 rounded-full w-full overflow-hidden"
          >
            <motion.div 
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-indigo-100 rounded-lg overflow-hidden mb-2 shadow-sm">
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Ultra-compact header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-indigo-100 bg-indigo-50/50">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="text-indigo-800 text-xs font-medium">{searchData.query}</span>
          </div>
          <div className="text-xs text-indigo-500">
            {new Date(searchData.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {/* Compact content area */}
        <div className="py-2 px-3 space-y-3">
          {/* Horizontal Organic Results - Always at the top */}
          {searchData.organic_results && searchData.organic_results.length > 0 && (
            <HorizontalOrganicResults data={searchData.organic_results} />
          )}
          
          {/* Knowledge Graph */}
          {(searchData.knowledge_graph && searchData.knowledge_graph?.title) && (
            <KnowledgeGraph data={searchData.knowledge_graph} />
          )}

          {/* Local Map and Results - Now combined */}
          {(searchData.local_map || searchData.local_results) && (
            <LocalMapView 
              data={{
                map: searchData.local_map,
                places: searchData.local_results?.places || [],
                more_locations_link: searchData.local_results?.more_locations_link
              }} 
            />
          )}

          {/* Images */}
          {searchData.inline_images && searchData.inline_images.length > 0 && (
            <InlineImages data={searchData.inline_images} />
          )}

          {/* Videos */}
          {searchData.inline_videos && searchData.inline_videos.length > 0 && (
            <InlineVideos data={searchData.inline_videos} />
          )}
          {searchData.short_videos && searchData.short_videos.length > 0 && (
            <ShortVideos data={searchData.short_videos} />
          )}

          {/* News */}
          {searchData.news_results && searchData.news_results.length > 0 && (
            <NewsResults data={searchData.news_results} />
          )}

          {/* Products */}
          {searchData.immersive_products && searchData.immersive_products.length > 0 && (
            <ImmersiveProducts data={searchData.immersive_products} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WebSearchResults; 