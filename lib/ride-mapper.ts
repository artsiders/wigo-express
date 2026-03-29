import { TripProvider } from "@/hooks/useTrips";
import { RideData } from "@/components/search/RideCard";

export const formatTime = (dateString: string) => {
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return dateString;
  }
};

export const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch (e) {
    return dateString;
  }
};

export const mapToRideData = (trip: TripProvider): RideData => {
  const features: ("instant_booking" | "max_2_back" | "pets_allowed")[] = [];
  if (trip.instantBooking) features.push("instant_booking");
  if (trip.max2Back) features.push("max_2_back");
  if (trip.pet) features.push("pets_allowed");

  return {
    id: trip.id,
    driver: {
      name: trip.driver.name || "Inconnu",
      photo: trip.driver.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200", 
      rating: trip.driver.rating || 5.0,
      reviewsCount: trip.driver.reviewsCount || 0,
      isVerified: trip.driver.idVerified || false,
    },
    departure: {
      city: trip.departureCity,
      time: formatTime(trip.departureDate),
      date: formatDate(trip.departureDate),
      place: trip.departurePlace || "Lieu non spécifié",
    },
    arrival: {
      city: trip.arrivalCity,
      time: "--:--",
      date: formatDate(trip.departureDate),
      place: trip.arrivalPlace || "Lieu non spécifié",
    },
    price: trip.price,
    currency: "$ CAD",
    seatsAvailable: trip.availableSeats,
    duration: trip.duration || "-",
    features,
  };
};
