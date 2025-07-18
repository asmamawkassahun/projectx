import { Flight } from "@/types/flight";

export const flights: Flight[] = [
  {
    id: "emirates_flight_1",
    airline: {
      name: "Emirates",
      logo: "https://images.unsplash.com/photo-1730627667985-afed200aa517?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      website: "emirates.com",
    },
    departure: {
      date: "Mon, Aug 11",
      time: "3:20 pm",
      airport: "DXB",
    },
    arrival: {
      date: "Mon, Aug 11",
      time: "5:50 pm",
      airport: "BKK",
    },
    duration: "6h 45m",
    flightType: "Direct",
    price: {
      amount: 1920.0,
      currency: "USD",
    },
  },
  {
    id: "thai_airways_flight_1",
    airline: {
      name: "Thai Airways",
      logo: "https://plus.unsplash.com/premium_photo-1679758629964-a9c201b95d15?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      website: "thaiairways.com",
    },
    departure: {
      date: "Mon, Aug 11",
      time: "11:00 am",
      airport: "DXB",
    },
    arrival: {
      date: "Mon, Aug 11",
      time: "3:00 pm",
      airport: "BKK",
    },
    duration: "7h 5m",
    flightType: "Direct",
    price: {
      amount: 934.5,
      currency: "USD",
    },
  },

  {
    id: "emirates_flight_1",
    airline: {
      name: "Emirates",
      logo: "https://images.unsplash.com/photo-1730627667985-afed200aa517?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      website: "emirates.com",
    },
    departure: {
      date: "Mon, Aug 11",
      time: "3:20 pm",
      airport: "DXB",
    },
    arrival: {
      date: "Mon, Aug 11",
      time: "5:50 pm",
      airport: "BKK",
    },
    duration: "6h 45m",
    flightType: "Direct",
    price: {
      amount: 1920.0,
      currency: "USD",
    },
  },
  {
    id: "thai_airways_flight_1",
    airline: {
      name: "Thai Airways",
      logo: "https://plus.unsplash.com/premium_photo-1679758629964-a9c201b95d15?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      website: "thaiairways.com",
    },
    departure: {
      date: "Mon, Aug 11",
      time: "11:00 am",
      airport: "DXB",
    },
    arrival: {
      date: "Mon, Aug 11",
      time: "3:00 pm",
      airport: "BKK",
    },
    duration: "7h 5m",
    flightType: "Direct",
    price: {
      amount: 934.5,
      currency: "USD",
    },
  },
];
