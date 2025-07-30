import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, CheckCheck, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"


interface LastEmailProps {
    sender: {
        name: string
        avatar: string
        initials: string
    }
    heading?: boolean
    subject: string
    preview: string
    receivedTime: string
    event?: {
        title: string
        date: string
        time: string
        avatar: string
    }
    location?: {
        name: string
        mapImage: string
        coordinates?: {
            lat: number
            lng: number
        }
    }
    action: boolean
}

// Sub-components for better organization
const EmailHeader = ({ title = "Last Email" }: { title?: string }) => (
    <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <div className="w-full h-0.5 bg-white"></div>
    </div>
)

const EmailSummary = ({ senderName, receivedTime }: { senderName: string; receivedTime: string }) => (
    <div className="mb-6">
        <p className="text-xl font-semibold text-white dark:text-foreground">
            Your last email was from {senderName}, received {receivedTime.toLowerCase()}.
        </p>
    </div>
)

const SenderInfo = ({
    sender,
    subject,
    preview,
    receivedTime,
    hasLocation,
}: {
    sender: LastEmailProps["sender"]
    subject: string
    preview: string
    receivedTime: string
    hasLocation?: boolean
}) => (
    <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-10 h-10">
            <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
            <AvatarFallback className="bg-gray-600 text-white">{sender.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <div className="text-white font-medium text-sm mb-1">{sender.name}</div>
            <div className="text-white font-semibold mb-2">{subject}</div>
            <div className="text-gray-300 text-sm leading-relaxed mb-3">{preview}</div>
            <div className="flex items-center gap-2 text-blue-400 text-sm">
                {hasLocation ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span className={hasLocation ? "text-white/60" : ""}>Received: {receivedTime}</span>
            </div>
        </div>
    </div>
)

const EventCard = ({ event }: { event: NonNullable<LastEmailProps["event"]> }) => (
    <div className="bg-gray-700 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div>
            <div className="text-white font-medium text-sm mb-1">{event.title}</div>
            <div className="text-gray-300 text-xs">
                {event.date} • {event.time}
            </div>
        </div>
        <Avatar className="w-8 h-8">
            <AvatarImage src={event.avatar || "/placeholder.svg"} alt="Event participant" />
            <AvatarFallback className="bg-gray-600 text-white text-xs">U</AvatarFallback>
        </Avatar>
    </div>
)

const LocationMap = ({ location }: { location: NonNullable<LastEmailProps["location"]> }) => {
    // Function to handle map click and open Google Maps
    const handleMapClick = () => {
        if (location.coordinates) {
            const { lat, lng } = location.coordinates
            const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15`
            window.open(googleMapsUrl, "_blank")
        } else {
            const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location.name)}&z=15`
            window.open(googleMapsUrl, "_blank")
        }
    }

    // Function to handle directions
    const handleDirections = () => {
        if (location.coordinates) {
            const { lat, lng } = location.coordinates
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
            window.open(directionsUrl, "_blank")
        } else {
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name)}`
            window.open(directionsUrl, "_blank")
        }
    }

    return (
        <div className="relative mb-4 cursor-pointer">
            <div
                onClick={handleMapClick}
                className="relative h-32 bg-blue-900 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 active:scale-95"
            >
                <Image src={location.mapImage || "/placeholder.svg"} alt="Location map" fill className="object-cover" />
                <div className="absolute inset-0 bg-blue-900/60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 flex items-center gap-2 animate-ping">
                        <MapPin className="w-4 h-4 text-gray-900" />
                        <span className="text-gray-900 text-sm font-medium">{location.name}</span>
                    </div>
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
    )
}

export default function LastEmail({
    sender,
    heading,
    subject,
    preview,
    receivedTime,
    event,
    location,
    action,
}: LastEmailProps) {
    // Determine card styling based on props
    const getCardClassName = () => {
        if (location && event) return "bg-gray-800 border-gray-700 mb-4"
        return "dark:bg-[#1a1a1a] bg-black/10 text-black dark:text-black mb-4"
    }

    // Determine container styling
    const getContainerClassName = () => {
        if (!heading && !action) return "min-h-screen bg-neutral-900 text-white p-6"
        return "bg-background text-foreground p-6"
    }

    const showSummary = heading && (location || event)

    return (
        <div className={getContainerClassName()}>
            <div className="max-w-md mx-auto bg-background rounded-xl pb-8">
                <EmailHeader />

                <Card className={getCardClassName()}>
                    <CardContent className="p-4">
                        {showSummary && (
                            <>
                                <EmailSummary senderName={sender.name} receivedTime={receivedTime} />
                                <Separator className="border-t border-white/10 my-4" />
                            </>
                        )}

                        <SenderInfo
                            sender={sender}
                            subject={subject}
                            preview={preview}
                            receivedTime={receivedTime}
                            hasLocation={!!location}
                        />

                        {event && <EventCard event={event} />}
                        {location && <LocationMap location={location} />}

                        {action && (
                            <div>
                                <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium">Reply</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
