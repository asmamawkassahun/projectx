import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Image as ImageIcon,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { BaseSwiperItemProps } from "./types";
import ImageGrid from "@/components/ui/image_grid_components/ImageGridComponents";
import ImageGridSkeleton from "@/components/ui/image_grid_components/ImageGridSkeleton";
import ImageCarouselModal from "@/components/ui/image_grid_components/ImageGridCarouselModalProps";

const ImageSearchSwiperItem: React.FC<BaseSwiperItemProps> = ({
  updates,
  isActive,
  isDragging,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Find the latest update to determine current state
  const latestUpdate = updates[updates.length - 1];
  const searchCompleteUpdate = updates.find(
    (update) => update.event_type === "search_complete"
  );
  const errorUpdate = updates.find(
    (update) => update.event_type === "search_error"
  );
  const imageResultsUpdate = updates.find(
    (update) => update.event_type === "image_results"
  );

  // Extract search data
  const searchData =
    searchCompleteUpdate?.data ||
    imageResultsUpdate?.data ||
    latestUpdate?.data ||
    {};
  const { query, images = [], total_results } = searchData;

  // Get the first few images to display
  const displayImages = images.slice(0, 4);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  const handleCloseCarousel = () => {
    setIsCarouselOpen(false);
    setSelectedImageIndex(null);
  };

  const getTitle = () => {
    if (searchCompleteUpdate || imageResultsUpdate)
      return "Image Search Results";
    if (errorUpdate) return "Image Search Failed";
    return "Searching Images";
  };

  return (
    <div className="w-full">
      <h2
        className={`text-lg font-semibold mb-4 ${
          isActive ? "text-gray-900" : "text-gray-400"
        } tracking-tight`}
      >
        {getTitle()}
      </h2>

      <div className="relative h-[320px] w-full">
        {(searchCompleteUpdate || imageResultsUpdate) && images.length > 0 ? (
          // Show search results
          <ImageGrid images={images} onImageClick={handleImageClick} />
        ) : errorUpdate ? (
          // Show error state
          <motion.div className="absolute inset-0 rounded-xl overflow-hidden bg-red-50 border border-red-200 shadow-lg">
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-base font-medium text-red-900 mb-2">
                Search Failed
              </h3>
              <p className="text-sm text-red-600 mb-4">
                {errorUpdate.data.error ||
                  "An error occurred while searching for images"}
              </p>
              {query && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-red-200">
                  <div className="text-xs font-medium text-red-700 mb-1">
                    Search Query:
                  </div>
                  <p className="text-sm text-red-600">"{query}"</p>
                </div>
              )}
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          // Show progress state
          <ImageGridSkeleton />
        )}

        <ImageCarouselModal
          images={images}
          initialIndex={selectedImageIndex}
          isOpen={isCarouselOpen}
          onClose={handleCloseCarousel}
        />
      </div>
    </div>
  );
};

export default ImageSearchSwiperItem;
