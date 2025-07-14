import Image from "next/image"

interface ImageItem {
  src: string
  alt: string
  width: number
  height: number
}

interface ImageGridProps {
  images: ImageItem[]
}

export default function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" style={{ width: "691px", height: "442px" }}>
      {images.map((image, index) => (
        <div key={index} className="relative w-[202px] h-[134px] overflow-hidden rounded-3xl">
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
