"use client"
import React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X } from "lucide-react"

interface WorkExperience {
  title: string
  company: string
  duration: string
  logoUrl?: string
  logoType?: "plus" | "x" | "pwc" | "custom"
}

interface PersonalDetailProps {
  name?: string
  description?: string
  avatarUrl?: string
  experiences?: WorkExperience[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "work-history" | "logos-cta" | "rich"
  largeImageUrl?: string
}

export default function PersonalDetail({
  name = "Gustavo Paris",
  description = "A Brazilian design leader focused on building teams and creating captivating experiences for innovative brands.",
  avatarUrl,
  experiences = [],
  callToAction,
  variant = "component-details",
  largeImageUrl
}: PersonalDetailProps) {
  
  const handleCallToAction = () => {
    if (callToAction?.link) {
      window.open(callToAction.link, "_blank")
    }
  }

  const renderLogo = (experience: WorkExperience) => {
    const { logoType, logoUrl } = experience
    
    if (logoUrl) {
      return <img src={logoUrl} alt={`${experience.company} logo`} className="w-full h-full object-cover rounded-full" />
    }
    
    switch (logoType) {
      case "plus":
        return (
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-black" />
          </div>
        )
      case "x":
        return (
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-red-500" />
          </div>
        )
      case "pwc":
        return (
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">PwC</span>
          </div>
        )
      default:
        return null
    }
  }

  const renderComponentDetails = () => (
    <div className="dark:bg-[#1a1a1a] bg-black/10 dark:text-white text-black min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Person Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-gray-600 text-white text-sm">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{description}</p>
        </div>
      </div>

      {/* Work History */}
      {experiences.length > 0 && (
        <div className="space-y-3 mb-6">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
                {renderLogo(experience)}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-white">{experience.title}</p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-sm text-white/60">{experience.company}</p>
                  <p className="text-xs text-white/60">{experience.duration}</p>
                </div>
              </div>
            </div>
          ))}
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

  const renderMinimal = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Person Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Minimal</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-start gap-4">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-gray-600 text-white text-sm">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{description}</p>
        </div>
      </div>
    </div>
  )

  const renderWorkHistory = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Person Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Work History</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-gray-600 text-white text-sm">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{description}</p>
        </div>
      </div>

      {/* Work History */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
              <div className="flex-grow">
                <p className="font-semibold text-white">{experience.title}</p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-sm text-white/60">{experience.company}</p>
                  <p className="text-xs text-white/60">{experience.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderLogosCTA = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Person Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Logos + CTA</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-gray-600 text-white text-sm">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center py-2">
          <p className="text-white text-lg font-bold leading-tight">{description}</p>
        </div>
      </div>

      {/* Work History */}
      {experiences.length > 0 && (
        <div className="space-y-3 mb-6">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
                {renderLogo(experience)}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-white">{experience.title}</p>
                <div className="flex justify-between items-center w-full">
                  <p className="text-sm text-white/60">{experience.company}</p>
                  <p className="text-xs text-white/60">{experience.duration}</p>
                </div>
              </div>
            </div>
          ))}
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

  const renderRich = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Person Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Rich</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-white text-lg font-bold leading-tight mb-6">{description}</p>

      {/* Large Image */}
      {largeImageUrl && (
        <div className="w-full h-64 mb-6 rounded-lg overflow-hidden">
          <img 
            src={largeImageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Work History (only first experience) */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <div className="bg-white/10 rounded-[16px] p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              {renderLogo(experiences[0])}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-white">{experiences[0].title}</p>
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-white/60">{experiences[0].company}</p>
                <p className="text-xs text-white/60">{experiences[0].duration}</p>
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
    case "work-history":
      return renderWorkHistory()
    case "logos-cta":
      return renderLogosCTA()
    case "rich":
      return renderRich()
    case "component-details":
    default:
      return renderComponentDetails()
  }
}