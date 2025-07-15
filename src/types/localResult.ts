export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocalMap {
  link: string;
  image: string;
  gps_coordinates: GpsCoordinates;
}

export interface PlaceLinks {
  delivery?: string;
  website: string;
  directions: string;
}

export interface Place {
  position: number;
  label: string;
  title: string;
  place_id: string;
  lsig: string;
  place_id_search: string;
  links: PlaceLinks;
  phone: string;
  address: string;
  hours: string;
  gps_coordinates: GpsCoordinates;
  rating: number;
  reveiw: number;
}

export interface LocalResults {
  more_locations_link: string;
  places: Place[];
}

export interface LocalResultType {
  local_map: LocalMap;
  local_results: LocalResults;
}

export interface MapCardContentProps {
  localPlaces: Place[];
  mapData: LocalMap;
}
