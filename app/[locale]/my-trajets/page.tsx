"use client";

import React, { useState } from "react";
import RideCard, { RideData } from "@/components/search/RideCard";
import { mockRidesDetails } from "@/lib/mock-ride";
import {
  IoCarSportOutline,
  IoTicketOutline,
  IoStar,
  IoChevronForward,
} from "react-icons/io5";
import Image from "next/image";
import { Link } from "@/i18n/routing";

// Construct mock RideData from mockRidesDetails
const mockRides: RideData[] = Object.values(mockRidesDetails).map((d) => ({
  id: d.id,
  driver: d.driver,
  departure: {
    city: d.departure.city,
    time: d.departure.time,
    place: d.departure.address.split(",")[0],
  },
  arrival: {
    city: d.arrival.city,
    time: d.arrival.time,
    place: d.arrival.address.split(",")[0],
  },
  price: d.price,
  currency: d.currency,
  seatsAvailable: d.id === "r1" ? 3 : 1,
  duration: d.id === "r1" ? "3h15" : "1h45",
  features: Object.keys(d.amenities)
    .filter(
      (k) =>
        d.amenities[k as keyof typeof d.amenities] &&
        (k === "instantBooking" || k === "max2Back"),
    )
    .map((k) =>
      k === "instantBooking" ? "instant_booking" : "max_2_back",
    ) as ("instant_booking" | "max_2_back")[],
}));

export default function MyTrajetsPage() {
  const [activeTab, setActiveTab] = useState<"published" | "booked">(
    "published",
  );

  return (
    <main className="container mx-auto mt-8 md:mt-12 px-4 md:px-8 lg:px-12 pb-24">
      {/* Header Premium */}
      <div className="bg-primary text-white rounded-3xl p-6 lg:p-8 mb-12 relative overflow-hidden shadow-2xl">
        {/* Background Image Plaçée avec précaution pour un effet glass premium */}
        <Image
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000"
          alt="Abstract Highway"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-3xl">
          <div>
            <div className="w-12 h-1 bg-white mb-6 rounded-full opacity-60"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              Mes trajets
            </h1>
            <p className="text-white/90 text-lg font-medium max-w-xl leading-relaxed">
              Consultez l'historique de vos trajets proposés et gérez vos
              réservations passées et à venir avec fluidité.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
        {/* Colonne Gauche: Rides List */}
        <div className="w-full lg:w-8/12 flex flex-col">
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

          {/* Rides List */}
          <div className="flex flex-col gap-6 w-full">
            {activeTab === "published" ? (
              mockRides.length > 0 ? (
                mockRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-light-400 flex items-center justify-center rounded-3xl mb-6">
                    <IoCarSportOutline className="text-5xl text-neutral-400" />
                  </div>
                  <h3 className="text-2xl font-black text-dark mb-2">
                    Aucun trajet publié
                  </h3>
                  <p className="text-neutral-500 font-medium">
                    Vous n'avez pas encore proposé de trajet.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-light-400 flex items-center justify-center rounded-3xl mb-6">
                  <IoTicketOutline className="text-5xl text-neutral-400" />
                </div>
                <h3 className="text-2xl font-black text-dark mb-2">
                  Aucune réservation
                </h3>
                <p className="text-neutral-500 font-medium">
                  Vous n'avez pas encore réservé de trajet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite: Statistiques & Actions (Sticky) */}
        <div className="w-full lg:w-4/12 flex flex-col gap-6 sticky top-28">
          {/* Widget Action */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
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
    </main>
  );
}
