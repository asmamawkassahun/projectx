"use client"

import Image from "next/image"

interface ImageItem {
  src: string
  alt: string
  width: number
  height: number
}

interface ImageGridProps {
  images: ImageItem[]
  onImageClick: (index: number) => void // New prop to handle image clicks
}

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" style={{ width: "691px", height: "442px" }}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative w-[202px] h-[134px] overflow-hidden rounded-3xl cursor-pointer" // Added cursor-pointer for visual feedback
          onClick={() => onImageClick(index)} // Call the handler on click
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="object-cover w-full h-full"
            priority={index < 3} // Prioritize loading for the first few images
          />
        </div>
      ))}
    </div>
  )
}
