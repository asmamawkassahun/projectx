"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"


import { ImageItem } from "@/types/imageGrid"

interface ImageCarouselModalProps {
  images: ImageItem[]
  initialIndex: number | null
  isOpen: boolean
  onClose: () => void
}

export default function ImageCarouselModal({ images, initialIndex, isOpen, onClose }: ImageCarouselModalProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    // Set the initial slide when the dialog opens or initialIndex changes
    // Only scroll if the initialIndex is valid and different from the current slide
    if (isOpen && initialIndex !== null && api.selectedScrollSnap() !== initialIndex) {
      api.scrollTo(initialIndex, true) // true for smooth scroll
      setCurrent(initialIndex)
    }

    // Update current slide on carousel change
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api, initialIndex, isOpen]) // Removed 'current' from dependencies to prevent infinite loop

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={image.width * 3} // Scale up for carousel view
                    height={image.height * 3} // Scale up for carousel view
                    className="object-contain max-h-[80vh] w-auto" // Ensure image fits within viewport
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
