"use client"
import type React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, FileText, MapPin, CheckCheckIcon } from "lucide-react"
import { Card, CardContent } from "../card"

interface SummarizeEmailProps {
  summary?: string
  messages?: {
    avatar: string
    fallback: string
    content: string
    sender?: string
    subject?: string
    preview?: string
    receivedTime?: string
  }[]
  event?: {
    title: string
    date: string
    time: string
    avatar: string
  }
  location?: {
    name: string
    mapImage?: string
  }
  attachments?: {
    name: string
    icon?: React.ReactNode
  }[]
}

export default function SummarizeEmail({
  summary = "Gustavo asked if you were planning anything for your 39th birthday",
  messages = [],
  event,
  location,
  attachments = []
}: SummarizeEmailProps) {
  
  // Function to handle map click and open Google Maps
  const handleMapClick = () => {
    if (location) {
      const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location.name)}&z=15`
      window.open(googleMapsUrl, "_blank")
    }
  }

  // Function to handle directions
  const handleDirections = () => {
    if (location) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name)}`
      window.open(directionsUrl, "_blank")
    }
  }

  return (
    <div className="bg-white/10 text-white min-h-screen p-6 pb-8 max-w-md mx-auto rounded-xl">
      {/* Top Summary Bar */}
      {summary && (
        <div className="mb-6">
          <p className="text-white text-base leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Main Email/Message Thread Section */}
      {messages && messages.length > 0 && (
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={message.avatar} alt={message.fallback} />
                <AvatarFallback className={`${index === 0 ? "bg-orange-500" : "bg-purple-500"} text-white text-sm`}>
                  {message.fallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {/* Recipient Tag for second message */}
                {message.sender && (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={message.avatar} alt="Recipient" />
                      <AvatarFallback className="bg-purple-500 text-white text-xs">{message.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                      {message.sender}
                    </div>
                  </div>
                )}
                
                {/* Message Title */}
                {message.subject && (
                  <div className="text-white text-sm font-medium mb-1">{message.subject}</div>
                )}
                
                {/* Message Body */}
                <div className={`${message.sender ? "text-gray-400" : "text-white"} text-sm leading-relaxed mb-3`}>
                  {message.content}
                </div>
                
                {/* Message Status/Timestamp */}
                {message.receivedTime && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCheckIcon className="w-4 h-4 text-blue-400" />
                    <span>Received: {message.receivedTime}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Card */}
      {event && (
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-8 h-8">
            <AvatarImage src={event.avatar} alt={event.title} />
            <AvatarFallback className="bg-blue-500 text-white text-xs">C</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{event.title}</div>
            <div className="text-gray-400 text-xs">{event.date} • {event.time}</div>
          </div>
        </div>
      )}

            {/* Interactive Map */}
      {location && (
        <div 
          className="relative rounded-lg overflow-hidden mb-6 cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={handleMapClick}
        >
          <div className="w-full h-40 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 relative">
            {/* Network/Map Pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 300 160">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="80" cy="60" r="2" fill="rgba(255,255,255,0.4)" />
                <circle cx="150" cy="40" r="2" fill="rgba(255,255,255,0.4)" />
                <circle cx="220" cy="80" r="2" fill="rgba(255,255,255,0.4)" />
                <circle cx="120" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
                <line x1="80" y1="60" x2="150" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="150" y1="40" x2="220" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="80" y1="60" x2="120" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>

            {/* Location Pin with Animation */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-4 py-2 animate-pulse">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center animate-ping">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="text-white text-sm font-medium">{location.name}</span>
            </div>

            {/* Directions Button */}
            <button
              className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                handleDirections()
              }}
            >
              Directions
            </button>
          </div>
        </div>
      )}

      {/* Attachments Section */}
      {attachments && attachments.length > 0 && (
        <div className="mb-6">
          <div className="text-gray-400 text-sm mb-3">Attachments</div>
          {attachments.map((attachment, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              {attachment.icon || <FileText className="w-6 h-6 text-gray-400" />}
              <span className="text-white text-sm font-medium">{attachment.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reply Button */}
      <div className="transform transition-transform duration-200 hover:scale-105 active:scale-95">
        <Button 
          className="w-full bg-white text-black hover:bg-gray-100 font-medium py-4 rounded-full text-base"
        >
          Reply
        </Button>
      </div>
    </div>
  )
}
