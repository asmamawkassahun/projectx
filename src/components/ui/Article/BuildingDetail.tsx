"use client"
import React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building } from "lucide-react"

interface BuildingStats {
  height?: string
  floors?: string
  elevators?: string
}

interface BuildingDetailProps {
  buildingName?: string
  location?: string
  description?: string
  height?: string
  floors?: string
  elevators?: string
  imageUrl?: string
  avatarIconUrl?: string
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "minimal-cta" | "image" | "image-info" | "image-info-2" | "rich"
}

export default function BuildingDetail({
  buildingName = "The Burj Khalifa",
  location = "Dubai, United Arab Emirates",
  description = "is a megatall skyscraper located in",
  height = "829.8 m",
  floors = "154",
  elevators = "57",
  imageUrl,
  avatarIconUrl,
  callToAction,
  variant = "component-details"
}: BuildingDetailProps) {
  
  const handleCallToAction = () => {
    if (callToAction?.link) {
      window.open(callToAction.link, "_blank")
    }
  }

  const fullDescription = `${buildingName} ${description} ${location}`

  const renderComponentDetails = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarIconUrl} alt="Building icon" />
          <AvatarFallback className="bg-blue-600 text-white">
            <Building className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{fullDescription}</p>
        </div>
      </div>

      {/* Building Image */}
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={buildingName} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Key Statistics (Prominent) */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Floor</p>
          <p className="text-white text-2xl font-bold">{floors}</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Height</p>
          <p className="text-white text-2xl font-bold">{height}</p>
        </div>
      </div>

      {/* Additional Statistics (Smaller) */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Height</span>
          <span className="text-white text-sm">{height}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Floors</span>
          <span className="text-white text-sm">{floors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Elevators</span>
          <span className="text-white text-sm">{elevators}</span>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderMinimal = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header with Avatar */}
      <div className="flex items-start gap-4">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarIconUrl} alt="Building icon" />
          <AvatarFallback className="bg-blue-600 text-white">
            <Building className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">
            {fullDescription}. With a total height of {height}.
          </p>
        </div>
      </div>
    </div>
  )

  const renderMinimalCTA = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarIconUrl} alt="Building icon" />
          <AvatarFallback className="bg-blue-600 text-white">
            <Building className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{fullDescription}</p>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderImage = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header Text */}
      <p className="text-white text-lg font-bold leading-tight mb-6">{fullDescription}</p>

      {/* Building Image */}
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={buildingName} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderImageInfo = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header Text */}
      <p className="text-white text-lg font-bold leading-tight mb-6">{fullDescription}</p>

      {/* Building Image */}
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={buildingName} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Key Statistics (Prominent) */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Floor</p>
          <p className="text-white text-2xl font-bold">{floors}</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Height</p>
          <p className="text-white text-2xl font-bold">{height}</p>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderImageInfo2 = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Image + Info 2</span>
        </div>
      </div>

      {/* Header Text */}
      <p className="text-white text-lg font-bold leading-tight mb-6">{fullDescription}</p>

      {/* Building Image */}
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={buildingName} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Additional Statistics (Smaller) */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Height</span>
          <span className="text-white text-sm">{height}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Floors</span>
          <span className="text-white text-sm">{floors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Elevators</span>
          <span className="text-white text-sm">{elevators}</span>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderRich = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Building Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Header Text */}
      <p className="text-white text-lg font-bold leading-tight mb-6">
        {fullDescription}. With a total height of {height}.
      </p>

      {/* Large Building Image with Statistics Overlay */}
      {imageUrl && (
        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={buildingName} 
            className="w-full h-full object-cover"
          />
          
          {/* Statistics Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
            <div className="text-center">
              <p className="text-white text-4xl font-bold mb-2">{height}</p>
              <div className="flex justify-center gap-6">
                <div>
                  <p className="text-gray-300 text-xs">Floor</p>
                  <p className="text-white text-sm font-semibold">{floors}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-xs">Elevators</p>
                  <p className="text-white text-sm font-semibold">{elevators}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  // Render based on variant
  switch (variant) {
    case "minimal":
      return renderMinimal()
    case "minimal-cta":
      return renderMinimalCTA()
    case "image":
      return renderImage()
    case "image-info":
      return renderImageInfo()
    case "image-info-2":
      return renderImageInfo2()
    case "rich":
      return renderRich()
    case "component-details":
    default:
      return renderComponentDetails()
  }
}
