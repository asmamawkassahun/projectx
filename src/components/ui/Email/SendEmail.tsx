"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Plus, FileText, Diamond } from "lucide-react"


interface Contact {
  id: string
  name: string
  avatar?: string
  initials: string
}

interface EventDetails {
  title: string
  date: string
  time: string
  participants: Contact[]
  additionalCount?: number
}

interface LocationDetails {
  name: string
  mapImage?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface Attachment {
  id: string
  name: string
  type: string
  icon?: string
}

interface EmailComposerProps {
  title?: string
  componentLabel?: string
  recipients?: Contact[]
  message?: {
    subject: string
    preview: string
  }
  event?: EventDetails
  location?: LocationDetails
  attachments?: Attachment[]
  onSend?: () => void
  onAddRecipient?: () => void
  maxVisibleRecipients?: number
}

export default function SendEmail({
  title,
  componentLabel,
  recipients = [],
  message,
  event,
  location,
  attachments = [],
  onSend,
  onAddRecipient,
  maxVisibleRecipients,
}: EmailComposerProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])

  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId) ? prev.filter((id) => id !== recipientId) : [...prev, recipientId],
    )
  }

  // Function to handle map click and open Google Maps
  const handleMapClick = () => {
    if (location) {
      if (location.coordinates) {
        const { lat, lng } = location.coordinates
        const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15`
        window.open(googleMapsUrl, "_blank")
      } else {
        const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location.name)}&z=15`
        window.open(googleMapsUrl, "_blank")
      }
    }
  }

  // Function to handle directions
  const handleDirections = () => {
    if (location) {
      if (location.coordinates) {
        const { lat, lng } = location.coordinates
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        window.open(directionsUrl, "_blank")
      } else {
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name)}`
        window.open(directionsUrl, "_blank")
      }
    }
  }

  const visibleRecipients = recipients.slice(0, maxVisibleRecipients || recipients.length)
  const hiddenRecipientsCount = Math.max(0, recipients.length - (maxVisibleRecipients || recipients.length))

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 text-white min-h-screen pb-8 rounded-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Component Label */}

        {/* Recipients */}
        {recipients.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 ">
              <div className="bg-white/10 p-2 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {visibleRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => toggleRecipient(recipient.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedRecipients.includes(recipient.id)
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-gray-600"
                      }`}
                  >
                    {recipient.name}
                  </button>
                ))}
                {hiddenRecipientsCount > 0 && (
                  <span className="px-3 py-1 rounded-full text-sm bbg-white/10 text-gray-300">
                    +{hiddenRecipientsCount}
                  </span>
                )}
                {onAddRecipient && (
                  <button
                    onClick={onAddRecipient}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Message Preview */}
            {message && (
              <div className="space-y-2">
                <h3 className="font-semibold text-white">{message.subject}</h3>
                <p className="text-gray-400 text-sm">{message.preview}</p>
              </div>
            )}
          </div>
        )}

        {/* Event Details */}
        {event && (
          <Card className="bg-white/10 ">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{event.title}</h3>
                <div className="flex items-center">
                  {event.participants.slice(0, 3).map((participant, index) => (
                    <Avatar key={participant.id} className="w-6 h-6 -ml-1 ">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback className="text-xs bg-gray-600">{participant.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.additionalCount && event.additionalCount > 0 && (
                    <div className="w-6 h-6 -ml-1 bg-gray-600 rounded-full flex items-center justify-center text-xs ">
                      +{event.additionalCount}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {event.date} • {event.time}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Interactive Location */}
        {location && (
          <div>
            <Card className="bg-white/10 overflow-hidden cursor-pointer">
              <CardContent className="p-0">
                <div
                  onClick={handleMapClick}
                  className="relative h-32 transform transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  {location.mapImage ? (
                    <>
                      <img
                        src={location.mapImage || "/placeholder.svg"}
                        alt="Location map"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-900/20" />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 animate-ping">
                        <MapPin className="w-4 h-4 text-gray-900" />
                      </div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
                        {location.name}
                      </div>
                    </>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center relative">
                      {/* Network/Map Pattern */}
                      <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 300 128">
                          <defs>
                            <pattern id="grid-send" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid-send)" />
                          <circle cx="80" cy="40" r="2" fill="rgba(255,255,255,0.4)" />
                          <circle cx="150" cy="30" r="2" fill="rgba(255,255,255,0.4)" />
                          <circle cx="220" cy="60" r="2" fill="rgba(255,255,255,0.4)" />
                          <circle cx="120" cy="80" r="2" fill="rgba(255,255,255,0.4)" />
                          <line x1="80" y1="40" x2="150" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                          <line x1="150" y1="30" x2="220" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                          <line x1="80" y1="40" x2="120" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="text-center relative z-10">
                        <div className="animate-ping">
                          <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
                        </div>
                        <p className="text-white font-medium">{location.name}</p>
                      </div>
                    </div>
                  )}

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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-gray-400 font-medium">Attachments</h3>
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="bg-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-white font-medium">{attachment.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Send Button */}
        <div>
          <Button
            onClick={onSend}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-full"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
