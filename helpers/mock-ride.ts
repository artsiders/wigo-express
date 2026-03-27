import { RideData } from "@/components/search/RideCard";

 // Extremely premium random mocked data
export const MOCK_RIDES: RideData[] = [
  {
    id: "r1",
    driver: {
      name: "Alexandre Tremblay",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 4.9,
      reviewsCount: 124,
      isVerified: true,
    },
    departure: {
      city: "Montréal, QC",
      time: "08:00",
      place: "Station Berri-UQAM",
    },
    arrival: {
      city: "Québec, QC",
      time: "11:15",
      place: "Gare du Palais",
    },
    price: 45.0,
    currency: "$",
    seatsAvailable: 3,
    duration: "3h 15m",
    features: ["instant_booking", "max_2_back"],
  },
  {
    id: "r2",
    driver: {
      name: "Sophie Laurent",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      rating: 5.0,
      reviewsCount: 89,
      isVerified: true,
    },
    departure: {
      city: "Montréal, QC",
      time: "10:30",
      place: "Université de Montréal",
    },
    arrival: {
      city: "Québec, QC",
      time: "13:45",
      place: "Université Laval",
    },
    price: 38.5,
    currency: "$",
    seatsAvailable: 1,
    duration: "3h 15m",
    features: ["max_2_back"],
  },
  {
    id: "r3",
    driver: {
      name: "Jean-Michel Côté",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      rating: 4.7,
      reviewsCount: 32,
      isVerified: false,
    },
    departure: {
      city: "Montréal, QC",
      time: "14:00",
      place: "Station Namur",
    },
    arrival: {
      city: "Laval, QC",
      time: "14:45",
      place: "Carrefour Laval",
    },
    price: 15.0,
    currency: "$",
    seatsAvailable: 4,
    duration: "45m",
    features: ["instant_booking"],
  },
];
