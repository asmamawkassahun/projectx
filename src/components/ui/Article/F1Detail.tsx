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

  const renderComponentDetails = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* F1 Info Card */}
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/f1-logo.png" alt="F1 logo" />
            <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
              F1
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* Sponsor Logo */}
        {sponsorLogoUrl && (
          <div className="flex justify-center">
            <div className="bg-red-600 rounded-lg px-4 py-2">
              <span className="text-green-400 font-bold text-sm">TAG HEUER</span>
            </div>
          </div>
        )}

        {/* Schedule */}
        {schedule.length > 0 && (
          <div className="space-y-4">
            {schedule.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-white font-bold text-sm mb-2">{day.day}</h3>
                <div className="space-y-1">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="flex justify-between text-sm">
                      <span className="text-gray-300">{event.name}</span>
                      <span className="text-white">{event.time}</span>
                    </div>
                  ))}
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
    </div>
  )

  const renderMinimal = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* F1 Info Card */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/f1-logo.png" alt="F1 logo" />
          <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
            F1
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{fullDescription}</p>
        </div>
      </div>
    </div>
  )

  const renderMinimalHero = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Minimal + Hero</span>
        </div>
      </div>

      {/* F1 Info Card */}
      <div className="bg-gray-800/80 bg-red-900/20 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/f1-logo.png" alt="F1 logo" />
            <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
              F1
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* Sponsor Logo */}
        {sponsorLogoUrl && (
          <div className="flex justify-center">
            <div className="bg-red-600 rounded-lg px-4 py-2">
              <span className="text-green-400 font-bold text-sm">TAG HEUER</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderCTA = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* F1 Info Card */}
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/f1-logo.png" alt="F1 logo" />
            <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
              F1
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* Sponsor Logo */}
        {sponsorLogoUrl && (
          <div className="flex justify-center">
            <div className="bg-red-600 rounded-lg px-4 py-2">
              <span className="text-green-400 font-bold text-sm">TAG HEUER</span>
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
    </div>
  )

  const renderSchedule = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* F1 Info Card */}
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/f1-logo.png" alt="F1 logo" />
            <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
              F1
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="text-white text-sm leading-tight">{fullDescription}</p>
          </div>
        </div>
        
        {/* Sponsor Logo */}
        {sponsorLogoUrl && (
          <div className="flex justify-center">
            <div className="bg-red-600 rounded-lg px-4 py-2">
              <span className="text-green-400 font-bold text-sm">TAG HEUER</span>
            </div>
          </div>
        )}

        {/* Schedule */}
        {schedule.length > 0 && (
          <div className="space-y-4">
            {schedule.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-white font-bold text-sm mb-2">{day.day}</h3>
                <div className="space-y-1">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="flex justify-between text-sm">
                      <span className="text-gray-300">{event.name}</span>
                      <span className="text-white">{event.time}</span>
                    </div>
                  ))}
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
    </div>
  )

  const renderRich = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">F1 Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Rich F1 Card with Background Image */}
      <div className="relative rounded-lg overflow-hidden">
        {backgroundImageUrl && (
          <img 
            src={backgroundImageUrl} 
            alt={`${circuit} circuit`} 
            className="w-full h-64 object-cover"
          />
        )}
        
        {/* Dark Overlay for Text */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src="/f1-logo.png" alt="F1 logo" />
              <AvatarFallback className="bg-white text-red-600 text-xs font-bold">
                F1
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-white text-sm leading-tight">{fullDescription}</p>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex flex-col items-center gap-2">
            {/* Sponsor Logo */}
            {sponsorLogoUrl && (
              <div className="bg-red-600 rounded-lg px-4 py-2">
                <span className="text-green-400 font-bold text-sm">TAG HEUER</span>
              </div>
            )}
            
            {/* Date */}
            <p className="text-white text-2xl font-bold">July 25-27</p>
            
            {/* Location */}
            <p className="text-white text-sm">{circuit}, {location}</p>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-center">
            {callToAction && (
              <Button 
                onClick={handleCallToAction}
                className="bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                {callToAction.text}
              </Button>
            )}
          </div>
        </div>
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
