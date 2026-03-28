"use client";

import { useState } from "react";
import RideCard, { RideData } from "@/components/search/RideCard";
import {
  IoCarSportOutline,
  IoTicketOutline,
  IoChevronForward,
} from "react-icons/io5";
import { Link } from "@/i18n/routing";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import { useMyTrajets, TripProvider } from "@/hooks/useTrips";
import Alert from "@/components/ui/Alert";
import RideCardSkeleton from "@/components/ui/RideCardSkeleton";

// Format API date to simple time string (e.g. "08:00")
const formatTime = (dateString: string) => {
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

const mapToRideData = (trip: TripProvider): RideData => {
  const features: ("instant_booking" | "max_2_back")[] = [];
  if (trip.instantBooking) features.push("instant_booking");
  if (trip.max2Back) features.push("max_2_back");

  return {
    id: trip.id,
    driver: {
      name: trip.driver.name || "Inconnu",
      photo:
        trip.driver.image ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      rating: trip.driver.rating || 5.0,
      reviewsCount: trip.driver.reviewsCount || 0,
      isVerified: trip.driver.idVerified || false,
    },
    departure: {
      city: trip.departureCity,
      time: formatTime(trip.departureDate),
      place: trip.departurePlace || "Lieu non spécifié",
    },
    arrival: {
      city: trip.arrivalCity,
      time: "--:--", // Pourrait être calculé avec duration
      place: trip.arrivalPlace || "Lieu non spécifié",
    },
    price: trip.price,
    currency: "MAD",
    seatsAvailable: trip.availableSeats,
    duration: trip.duration || "-",
    features,
  };
};

export default function MyTrajetsPage() {
  const [activeTab, setActiveTab] = useState<"published" | "booked">(
    "published",
  );
  const { data, isLoading, isError } = useMyTrajets();

  const publishedRides = data?.published?.map(mapToRideData) || [];
  const bookedRides = data?.booked?.map((b) => mapToRideData(b.trip)) || [];

  const currentRides = activeTab === "published" ? publishedRides : bookedRides;

  return (
    <div className="flex flex-col gap-6 w-full container">
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Mes Trajets" }]}
      />

      <SectionHeader
        title="Mes trajets"
        description="Consultez l'historique de vos trajets proposés et gérez vos réservations passées et à venir avec fluidité."
      />

      <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
        {/* Colonne Gauche: Rides List */}
        <div className="w-full flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-10 bg-white p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-neutral-100 w-fit">
            <button
              onClick={() => setActiveTab("published")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === "published" ? "bg-dark text-white shadow-md" : "text-neutral-500 hover:text-dark hover:bg-neutral-50"}`}
            >
              <IoCarSportOutline size={18} />
              Trajets publiés
            </button>
            <button
              onClick={() => setActiveTab("booked")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === "booked" ? "bg-dark text-white shadow-md" : "text-neutral-500 hover:text-dark hover:bg-neutral-50"}`}
            >
              <IoTicketOutline size={18} />
              Trajets réservés
            </button>
          </div>

          {/* Rides List Section */}
          <div className="flex flex-col gap-6 w-full">
            {isError && (
              <Alert
                type="error"
                title="Erreur de chargement"
                description="Nous n'avons pas pu charger vos trajets. Veuillez réessayer."
              />
            )}

            {isLoading && (
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <RideCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading &&
              !isError &&
              currentRides.length > 0 &&
              currentRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}

            {!isLoading && !isError && currentRides.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-light-400 flex items-center justify-center rounded-3xl mb-6">
                  {activeTab === "published" ? (
                    <IoCarSportOutline className="text-5xl text-neutral-400" />
                  ) : (
                    <IoTicketOutline className="text-5xl text-neutral-400" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-dark mb-2">
                  {activeTab === "published"
                    ? "Aucun trajet publié"
                    : "Aucune réservation"}
                </h3>
                <p className="text-neutral-500 font-medium">
                  {activeTab === "published"
                    ? "Vous n'avez pas encore proposé de trajet."
                    : "Vous n'avez pas encore réservé de trajet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite: Statistiques & Actions (Sticky) */}
        <div className="w-full xl:w-4/12 flex flex-col gap-6 sticky top-28">
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
              <IoCarSportOutline className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-black text-dark mb-3">
              Un trajet en vue ?
            </h3>
            <p className="text-neutral-500 font-medium text-sm mb-6 max-w-[200px]">
              Rentabilisez vos frais en proposant vos places vides à la
              communauté Wigo.
            </p>
            <Link
              href="/offer"
              className="w-full bg-dark text-white font-bold h-14 rounded-full hover:bg-primary transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Publier un trajet <IoChevronForward />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
