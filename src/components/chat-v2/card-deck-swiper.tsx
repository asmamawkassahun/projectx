"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
} from "framer-motion";
import { Search } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { PusherEventType, pusherManager } from "@/lib/pusher";

// Import swiper item components
import {
  VideoGenerationSwiperItem,
  WebSearchSwiperItem,
  DefaultSwiperItem,
  AudioGenerationSwiperItem,
  ImageGenerationSwiperItem,
  HotelSearchSwiperItem,
  FlightSearchSwiperItem,
  ImageSearchSwiperItem,
  NewsSearchSwiperItem,
} from "./swiper_in_chat_updates";
import { InChatUpdate, SwiperItem } from "./swiper_in_chat_updates/types";

export default function CardDeckSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null
  );
  const [lastDragX, setLastDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // State for in-chat updates
  const [swiperItems, setSwiperItems] = useState<SwiperItem[]>([]);
  const [inChatUpdatesById, setInChatUpdatesById] = useState<
    Map<string, InChatUpdate[]>
  >(new Map());

  const isMobile = useIsMobile();
  const itemsPerView = isMobile ? 1 : 2;

  const maxIndex = Math.max(0, swiperItems.length - 1);

  // Handle InChatUpdates events - now handles single updates
  const handleInChatUpdates = (data: any) => {
    console.log("InChatUpdates received:", data);

    if (!data || !data.tool || !data.event_type) {
      console.warn("Invalid update data received:", data);
      return;
    }

    const update: InChatUpdate = {
      id: data.id || `${data.tool}-${Date.now()}`,
      tool: data.tool,
      event_type: data.event_type,
      data: data.data || {},
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    };

    console.log("Processing update:", update);

    // For search tools, group by search session (detect new search by search_started event)
    let toolKey = update.tool;
    if (
      update.tool === "web_search" &&
      update.event_type === "search_started"
    ) {
      // Create a new search session key
      toolKey = `${update.tool}-${Date.now()}`;
    } else if (update.tool === "web_search") {
      // Find the most recent search session for this tool
      const existingSessions = Array.from(inChatUpdatesById.keys()).filter(
        (key) => key.startsWith("web_search-")
      );
      if (existingSessions.length > 0) {
        toolKey = existingSessions[existingSessions.length - 1];
      }
    }

    // For video generation, create new session on generation_started
    if (
      update.tool === "video_generation" &&
      update.event_type === "generation_started"
    ) {
      toolKey = `${update.tool}-${Date.now()}`;
    } else if (update.tool === "video_generation") {
      // Find the most recent video generation session
      const existingSessions = Array.from(inChatUpdatesById.keys()).filter(
        (key) => key.startsWith("video_generation-")
      );
      if (existingSessions.length > 0) {
        toolKey = existingSessions[existingSessions.length - 1];
      }
    }

    // Store the update
    const newUpdatesById = new Map(inChatUpdatesById);
    const toolUpdates = newUpdatesById.get(toolKey) || [];
    toolUpdates.push(update);
    newUpdatesById.set(toolKey, toolUpdates);
    setInChatUpdatesById(newUpdatesById);

    // Create or update swiper item
    const swiperItem: SwiperItem = {
      id: toolKey,
      tool: update.tool,
      updates: toolUpdates,
      timestamp: new Date(),
    };

    // Update the swiper items - replace item with same ID or add new one
    setSwiperItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === toolKey
      );

      if (existingItemIndex >= 0) {
        // Replace existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = swiperItem;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, swiperItem];
      }
    });
  };

  // Set up event listener for InChatUpdates
  useEffect(() => {
    pusherManager.addEventListener(
      PusherEventType.InChatUpdates,
      handleInChatUpdates
    );

    // Also listen for replay events via custom events
    const handleReplayInChatUpdates = (event: CustomEvent) => {
      handleInChatUpdates(event.detail);
    };

    window.addEventListener(
      "replay-inchat-updates",
      handleReplayInChatUpdates as EventListener
    );

    return () => {
      pusherManager.removeEventListener(
        PusherEventType.InChatUpdates,
        handleInChatUpdates
      );
      window.removeEventListener(
        "replay-inchat-updates",
        handleReplayInChatUpdates as EventListener
      );
    };
  }, [inChatUpdatesById]);

  // Auto-push to show new items when they are added
  useEffect(() => {
    if (swiperItems.length > 0) {
      // When a new item is added, automatically move to show it
      const targetIndex = isMobile
        ? swiperItems.length - 1
        : swiperItems.length === 1
        ? 0
        : swiperItems.length - 1;

      // Only update if the target index is different from current
      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
      }
    }
  }, [swiperItems.length, isMobile, currentIndex]);

  // Initial positioning logic (separate from auto-push)
  useEffect(() => {
    // Only run this for initial setup, not when items are added
    if (swiperItems.length > 0 && currentIndex === 0) {
      if (!isMobile && swiperItems.length > 1) {
        setCurrentIndex(1);
      }
    }
  }, [isMobile, swiperItems.length]);

  // Update width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Update position when currentIndex changes
  useEffect(() => {
    const slideWidth = width / itemsPerView;

    // Calculate offset based on number of items and current index
    let offset = 0;

    if (swiperItems.length === 1) {
      // Center single item
      offset = 0;
    } else if (isMobile) {
      // Mobile: show current item
      offset = currentIndex;
    } else {
      // Desktop: show preview + active pattern
      offset = Math.max(0, currentIndex - 1);
    }

    const targetX = -offset * slideWidth;

    // Use animation for smooth transitions
    controls
      .start({
        x: targetX,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
      .then(() => {
        // Sync dragX after animation completes
        dragX.set(targetX);
      });
  }, [
    currentIndex,
    controls,
    width,
    itemsPerView,
    isMobile,
    dragX,
    swiperItems.length,
  ]);

  const handleDragStart = () => {
    setIsDragging(true);
    setLastDragX(dragX.get());
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const currentDragX = dragX.get();
    if (currentDragX > lastDragX) {
      setDragDirection("right");
    } else if (currentDragX < lastDragX) {
      setDragDirection("left");
    }
    setLastDragX(currentDragX);
  };

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    setDragDirection(null);
    const slideWidth = width / itemsPerView;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Don't allow dragging if there's only one item
    if (swiperItems.length <= 1) {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
      return;
    }

    // Determine direction based on drag distance or velocity
    if ((offset < -50 || velocity < -500) && currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else if (
      (offset > 50 || velocity > 500) &&
      currentIndex > (isMobile ? 0 : 1)
    ) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Snap back to current index
      const offsetIndex =
        swiperItems.length === 1
          ? 0
          : isMobile
          ? currentIndex
          : Math.max(0, currentIndex - 1);
      controls.start({
        x: -offsetIndex * slideWidth,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  };

  // Function to calculate dynamic styles based on drag -- position useless so far
  const getDynamicStyles = (index: number) => {
    // For single item, always show at full opacity and scale, centered
    if (swiperItems.length === 1) {
      return {
        opacity: 1,
        scale: 1,
      };
    }

    if (isMobile) {
      return {
        opacity: 1,
        scale: 1,
      };
    }

    const isActive = index === currentIndex;
    const isPreview = index === currentIndex - 1;
    const isNext = index === currentIndex + 1;

    // Default styles when not dragging
    if (dragDirection === null) {
      return {
        opacity: isActive ? 1 : isPreview ? 0.6 : isNext ? 0.3 : 0.2,
        scale: isActive ? 1 : isPreview ? 0.85 : isNext ? 0.8 : 0.75,
      };
    }

    // Calculate drag progress (0 to 1)
    const slideWidth = width / itemsPerView;
    const dragProgress = Math.min(
      Math.max(
        Math.abs(dragX.get() - -Math.max(0, currentIndex - 1) * slideWidth) /
          slideWidth,
        0
      ),
      1
    );

    // When swiping left (moving forward)
    if (dragDirection === "left") {
      if (isActive) {
        // Active card fades out as it moves left
        return {
          opacity: Math.max(0.3, 1 - dragProgress * 0.7),
          scale: Math.max(0.85, 1 - dragProgress * 0.15),
        };
      } else if (isPreview) {
        // Preview card fades out
        return {
          opacity: 0.6 - dragProgress * 0.6,
          scale: 0.85 - dragProgress * 0.1,
        };
      } else if (isNext) {
        // Next card becomes active
        return {
          opacity: 0.3 + dragProgress * 0.7,
          scale: 0.8 + dragProgress * 0.2,
        };
      }
    }
    // When swiping right (moving backward)
    else if (dragDirection === "right") {
      if (isActive) {
        // Active card becomes preview
        return {
          opacity: 1 - dragProgress * 0.4,
          scale: 1 - dragProgress * 0.15,
        };
      } else if (isPreview) {
        // Preview card becomes more visible
        return {
          opacity: 0.6 + dragProgress * 0.4,
          scale: 0.85 + dragProgress * 0.15,
        };
      } else if (index === currentIndex - 2) {
        // Card before preview becomes visible
        return {
          opacity: dragProgress * 0.6,
          scale: 0.75 + dragProgress * 0.1,
        };
      }
    }

    // Default fallback
    return {
      opacity: isActive ? 1 : isPreview ? 0.6 : isNext ? 0.3 : 0.2,
      scale: isActive ? 1 : isPreview ? 0.85 : isNext ? 0.8 : 0.75,
    };
  };

  // Render the appropriate swiper component based on tool type
  const renderSwiperItem = (item: SwiperItem, index: number) => {
    const isActive = index === currentIndex;
    const commonProps = {
      updates: item.updates,
      isActive,
      isDragging: isDragging,
    };

    switch (item.tool) {
      case "video_generation":
        return <VideoGenerationSwiperItem {...commonProps} />;
      case "web_search":
        return <WebSearchSwiperItem {...commonProps} />;
      case "audio_generation":
        return <AudioGenerationSwiperItem {...commonProps} />;
      case "image_generation":
        return <ImageGenerationSwiperItem {...commonProps} />;
      case "hotel_search":
        return <HotelSearchSwiperItem {...commonProps} />;
      case "flight_search":
        return <FlightSearchSwiperItem {...commonProps} />;
      case "image_search":
        return <ImageSearchSwiperItem {...commonProps} />;
      case "news_search":
        return <NewsSearchSwiperItem {...commonProps} />;
      default:
        return <DefaultSwiperItem {...commonProps} tool={item.tool} />;
    }
  };

  return (
    <div className="w-full h-full  flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        {/* Main swiper container with overflow hidden to prevent third item from showing */}
        <div
          className="relative overflow-hidden w-full max-w-5xl mx-auto"
          ref={carouselRef}
        >
          {swiperItems.length > 0 ? (
            <motion.div
              className="flex"
              drag={swiperItems.length > 1 ? "x" : false}
              dragConstraints={{
                left:
                  swiperItems.length <= 1
                    ? 0
                    : -width *
                      Math.max(
                        0,
                        (swiperItems.length - itemsPerView) / itemsPerView
                      ),
                right: 0,
              }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{
                touchAction: "pan-y",
                x: dragX,
              }}
            >
              {swiperItems.map((item, index) => {
                const dynamicStyles = getDynamicStyles(index);
                const isActive = index === currentIndex;

                return (
                  <motion.div
                    key={item.id}
                    className={`${
                      swiperItems.length === 1
                        ? "w-full max-w-2xl mx-auto bg-green-400"
                        : isMobile
                        ? "w-full"
                        : "w-1/2"
                    } flex-shrink-0 px-4 md:px-8`}
                    style={{
                      opacity: dynamicStyles.opacity,
                      scale: dynamicStyles.scale,
                      transformOrigin: "center center",
                    }}
                  >
                    {renderSwiperItem(item, index)}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-2" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No content available
                </h3>
                <p className="text-sm text-gray-500">
                  Waiting for in-chat updates to display...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
