import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Globe } from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import { WebSearchDetailedViewer } from "./index";
import ListItemComponent from "@/components/ui/link_list_item_component/ListItemComponent";
import { formatRelative } from "date-fns";
import ListItemSkeleton from "@/components/ui/link_list_item_component/ListItemSkeleton";

const WebSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({
  updates,
  isActive,
  isDragging,
}) => {
  const [showDetailedViewer, setShowDetailedViewer] = useState(false);

  const searchStarted = updates.find(
    (update) => update.event_type === "search_started"
  );
  const searchComplete = updates.find(
    (update) => update.event_type === "search_complete"
  );
  const organicResults = updates.filter(
    (update) => update.event_type === "organic_results_batch"
  );
  const searchCompleted = updates.find(
    (update) => update.event_type === "search_completed"
  );

  const query =
    searchStarted?.data?.query || searchComplete?.data?.query || "Web Search";
  const allResults =
    searchComplete?.data?.results ||
    organicResults.flatMap((update) => update.data.organic_results || []);
  const isComplete = !!searchCompleted || !!searchComplete;

  console.log(allResults, "All results from search");

  const getTitle = () => {
    if (isComplete) return `Search Results for "${query}"`;
    return `Searching for "${query}"`;
  };

  const handleCardClick = () => {
    if (!isDragging) {
      setShowDetailedViewer(true);
    }
  };

  // Get domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  // I need this format : {id}, question, source, url, content}
  const formatedResults = allResults.map((result: { title: any; link: any; url: any; snippet: any; }, index: any) => ({
    id: `result-${index}`,
    question: result.title || "No title",
    source: getDomain(result.link || result.url),
    url: result.link || result.url,
    content: result.snippet || "No content available",
  }));

  // Get favicon URL - prefer the one from result data, fallback to Google
  const getFavicon = (result: any) => {
    if (result.favicon) {
      return result.favicon;
    }
    try {
      const domain = new URL(result.link || result.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <p className={`font-semibold text-[14px] dark:text-white`}>
            Searching
          </p>
          <div className="flex gap-0.5 items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                key={i}
                className="flex-none w-1 h-1 bg-white rounded-full"
              />
            ))}
          </div>
        </div>
        {/* the little dots if still searching */}
        {/* Animated dots */}

        <div className="relative  w-full">
          {isComplete && allResults.length > 0 ? (
            <ListItemComponent linkItems={formatedResults} />
          ) : (
            <ListItemSkeleton />
          )}
        </div>
      </div>

      {/* Detailed Viewer */}
      <WebSearchDetailedViewer
        updates={updates}
        isOpen={showDetailedViewer}
        onClose={() => setShowDetailedViewer(false)}
      />
    </>
  );
};

export default WebSearchSwiperItem;
