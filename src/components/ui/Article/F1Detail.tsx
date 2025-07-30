"use client"
import React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ScheduleEvent {
  day: string
  events: {
    name: string
    time: string
  }[]
}

interface F1DetailProps {
  raceDate?: string
  raceDay?: string
  location?: string
  circuit?: string
  description?: string
  sponsorLogoUrl?: string
  backgroundImageUrl?: string
  schedule?: ScheduleEvent[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "minimal-hero" | "cta" | "schedule" | "rich"
}

export default function F1Detail({
  raceDate = "27 July",
  raceDay = "Sunday",
  location = "Belgium",
  circuit = "Spa-Francorchamps",
  description = "The next Formula 1 race is on",
  sponsorLogoUrl,
  backgroundImageUrl,
  schedule = [],
  callToAction,
  variant = "component-details"
}: F1DetailProps) {
  
  const handleCallToAction = () => {
    if (callToAction?.link) {
      window.open(callToAction.link, "_blank")
    }
  }

  const fullDescription = `${description} ${raceDay}, ${raceDate} and will be hosted in ${location} at ${circuit}.`

  // TAG HEUER Logo Component using Hero.png
  const TagHeuerLogo = () => (
    <div className="flex justify-center mb-6">
      <div className="relative w-[20.5rem]">
        <img 
          src="/Hero.png" 
          alt="TAG HEUER Logo" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )

  const renderComponentDetails = () => (
    <div className="min-h-screen bg-white/10 backdrop-blur-sm text-white p-6 max-w-md mx-auto rounded-[1.5rem]">
      {/* Top Header with F1 Icon and Description */}
      <div className=" rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 text-xs font-bold">F1</span>
          </div>
          <p className="text-white text-sm leading-tight">{fullDescription}</p>
        </div>
      </div>
      
      {/* TAG HEUER Logo */}
      <TagHeuerLogo />

      {/* Race Schedule */}
      {schedule.length > 0 && (
        <div className="space-y-4">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex}>
              <h3 className="text-white font-bold text-sm mb-3">{day.day}</h3>
              <div className="space-y-2">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-white/60 text-sm">{event.name}</span>
                    <span className="text-white text-sm">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action Button */}
      {callToAction && (
        <div className="mt-8">
          <Button 
            onClick={handleCallToAction}
            className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {callToAction.text}
          </Button>
        </div>
      )}
    </div>
  )

  const renderMinimal = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6 max-w-md mx-auto">
      {/* Top Header with F1 Icon and Description */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 text-xs font-bold">F1</span>
          </div>
          <p className="text-white text-sm leading-tight">{fullDescription}</p>
        </div>
      </div>
      
      {/* TAG HEUER Logo */}
      <TagHeuerLogo />
    </div>
  )

  const renderMinimalHero = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6 max-w-md mx-auto">
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImageUrl} 
            alt="F1 Hero" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Top Header with F1 Icon and Description */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-xs font-bold">F1</span>
            </div>
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* TAG HEUER Logo */}
        <TagHeuerLogo />
      </div>
    </div>
  )

  const renderCTA = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6 max-w-md mx-auto">
      {/* Top Header with F1 Icon and Description */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 text-xs font-bold">F1</span>
          </div>
          <p className="text-white text-sm leading-tight">{fullDescription}</p>
        </div>
      </div>
      
      {/* TAG HEUER Logo */}
      <TagHeuerLogo />

      {/* Call to Action Button */}
      {callToAction && (
        <div className="mt-8">
          <Button 
            onClick={handleCallToAction}
            className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {callToAction.text}
          </Button>
        </div>
      )}
    </div>
  )

  const renderSchedule = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6 max-w-md mx-auto">
      {/* Top Header with F1 Icon and Description */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 text-xs font-bold">F1</span>
          </div>
          <p className="text-white text-sm leading-tight">{fullDescription}</p>
        </div>
      </div>
      
      {/* TAG HEUER Logo */}
      <TagHeuerLogo />

      {/* Race Schedule */}
      {schedule.length > 0 && (
        <div className="space-y-4">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex}>
              <h3 className="text-white font-bold text-sm mb-3">{day.day}</h3>
              <div className="space-y-2">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-white text-sm">{event.name}</span>
                    <span className="text-white text-sm">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action Button */}
      {callToAction && (
        <div className="mt-8">
          <Button 
            onClick={handleCallToAction}
            className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {callToAction.text}
          </Button>
        </div>
      )}
    </div>
  )

  const renderRich = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6 max-w-md mx-auto">
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImageUrl} 
            alt="F1 Hero" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Top Header with F1 Icon and Description */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-xs font-bold">F1</span>
            </div>
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* TAG HEUER Logo */}
        <TagHeuerLogo />

        {/* Date and Location */}
        <div className="text-center mb-6">
          <p className="text-white text-2xl font-bold mb-2">July 25-27</p>
          <p className="text-white text-sm">{circuit}, {location}</p>
        </div>

        {/* Call to Action Button */}
        {callToAction && (
          <div className="mt-8">
            <Button 
              onClick={handleCallToAction}
              className="w-full bg-white text-black py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {callToAction.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // Render based on variant
  switch (variant) {
    case "minimal":
      return renderMinimal()
    case "minimal-hero":
      return renderMinimalHero()
    case "cta":
      return renderCTA()
    case "schedule":
      return renderSchedule()
    case "rich":
      return renderRich()
    case "component-details":
    default:
      return renderComponentDetails()
  }
}
