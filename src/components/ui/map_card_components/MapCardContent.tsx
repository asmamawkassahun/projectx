import Image from "next/image";
import { Card } from "../card";
import { Star, MapPin, Clock, Globe, Send, Phone } from "lucide-react";
import { ShadCnButton } from "../shadcnButton";
import Link from "next/link";
import {
  GpsCoordinates,
  LocalMap,
  MapCardContentProps,
  Place,
} from "@/types/localResult";

function MapCard({
  mapData,
}: {
  mapData: { link: string; gps_coordinates: GpsCoordinates; image: string };
}) {
  // Construct the Google Maps embed URL using GPS coordinates for precision
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${mapData.gps_coordinates.latitude},${mapData.gps_coordinates.longitude}`
  )}&output=embed`;

  const handleImageClick = () => {
    window.open(mapData.link, "_blank");
  };

  return (
    <div className="relative w-full h-[12rem] rounded-3xl overflow-hidden">
      {!mapData.image ? (
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map of locations"
          className="rounded-3xl" // Apply border-radius to the iframe
        ></iframe>
      ) : (
        <Image
          src={mapData.image}
          alt="Map of locations"
          width={689}
          height={192}
          className="object-cover rounded-3xl cursor-pointer"
          onClick={handleImageClick}
        />
      )}
    </div>
  );
}

function PlaceCard({
  title,
  address,
  hours,
  links,
  phone,
  label,
  rating,
  reveiw,
}: Place) {
  return (
    <div className="flex items-start space-x-4 py-4 px-[1.125rem] rounded-3xl dark:bg-[#1a1a1a] bg-black/10">
      <div className="relative w-[8.75rem] h-[6.125rem] flex-shrink-0 rounded-2xl overflow-hidden">
        <Image
          src={"/images/Image1.png"}
          alt={`Image of ${title}`}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-4">
        <h3 className="text-base font-semibold text-foreground truncate">
          {title}
        </h3>

        <div className="flex  space-x-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-foreground text-sm">
              {rating} ({reveiw})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm ">
            <MapPin className="h-3.5 w-3.5 text-foreground/50" />
            <span className="truncate text-foreground text-sm">{address}</span>
          </div>
          {hours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-foreground/50" />
              <span className="text-foreground text-sm">{hours}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <ShadCnButton
            asChild
            variant="outline"
            size="sm"
            className="flex items-center space-x-2.5 rounded-full p-3 dark:bg-white/10 bg-black/10"
          >
            <Link
              href={links.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </Link>
          </ShadCnButton>
          <ShadCnButton
            asChild
            variant="outline"
            size="sm"
            className="flex items-center space-x-2.5 rounded-full p-3 dark:bg-white/10 bg-black/10"
          >
            <Link
              href={links.directions}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="h-3.5 w-3.5" />
              Directions
            </Link>
          </ShadCnButton>
          <ShadCnButton
            asChild
            variant="outline"
            size="sm"
            className="flex items-center space-x-2.5 rounded-full p-3 dark:bg-white/10 bg-black/10"
          >
            <Link
              href={`tel:${phone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </Link>
          </ShadCnButton>
        </div>
      </div>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full  text-base font-medium text-foreground bg-white/10 dark:black/10 p-2">
        {label}
      </div>
    </div>
  );
}

export default function MapCardContent({
  localPlaces,
  mapData,
}: MapCardContentProps) {
  return (
    <div className="w-full max-w-[43.0625rem] space-y-4">
      <div className="flex items-center space-x-4  dark:text-white text-black text-sm font-semibold">
        <span>Local results</span>
        <span>6</span>
      </div>

      <MapCard mapData={mapData} />
      <div className="space-y-4">
        {localPlaces.map((place) => (
          <PlaceCard key={place.place_id} {...place} />
        ))}
      </div>

      <ShadCnButton className="text-xs font-semibold text-foreground hover:bg-transparent rounded-full px-3 py-2.5 dark:bg-[#1a1a1a] bg-black/10">
        See more
      </ShadCnButton>
    </div>
  );
}
