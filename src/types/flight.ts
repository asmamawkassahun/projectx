export interface Flight {
  id: string;
  airline: Airline;
  departure: FlightDetails;
  arrival: FlightDetails;
  duration: string;
  flightType: string;
  price: Price;
}

export interface Airline {
  name: string;
  logo: string;
  website: string;
}

export interface FlightDetails {
  date: string;
  time: string;
  airport: string;
}

export interface Price {
  amount: number;
  currency: string;
}
