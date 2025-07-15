"use client"

import { useState, useEffect } from "react"
import { RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ShadCnButton } from "../shadcnButton"
import ImageGridSkeleton from "../image_grid_components/ImageGridSkeleton"
import ImageGrid from "../image_grid_components/ImageGridComponents"
import ImageCarouselModal from "../image_grid_components/ImageGridCarouselModalProps"
import { ImageItem } from "@/types/imageGrid"
import { images } from "@/lib/data/dummyImages"

export default function ImageGridWithLoading() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Simulate a 2-second loading time
    return () => clearTimeout(timer)
  }, [])

  const resetLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsCarouselOpen(true)
  }

  const handleCloseCarousel = () => {
    setIsCarouselOpen(false)
    setSelectedImageIndex(null)
  }

  return (
    // Added items-center and min-h-screen to center the card vertically on the screen.
    <div className="w-full p-8 bg-background flex justify-center items-center min-h-screen">
      <Card
        // Removed fixed width/height. Added w-full max-w-screen-lg for responsiveness.
        className="border-none shadow-none bg-transparent flex flex-col gap-4 p-0 w-full max-w-screen-lg"
      >
        <CardContent className="p-0 flex flex-col gap-4">
          <h2 className="text-lg font-medium text-foreground">Images {images.length}</h2>
          {isLoading ? <ImageGridSkeleton /> : <ImageGrid images={images} onImageClick={handleImageClick} />}
        </CardContent>
        <ShadCnButton onClick={resetLoading} className="w-8 h-8 rounded-full self-center">
          <RefreshCcw className="w-6 h-6" />
        </ShadCnButton>
      </Card>

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={isCarouselOpen}
        onClose={handleCloseCarousel}
      />
    </div>
  )
}
