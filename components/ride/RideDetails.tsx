"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MockRideDetails } from "@/lib/mock-ride";
import {
  IoArrowBack,
  IoCardOutline,
  IoLocationOutline,
  IoMapOutline,
  IoCarOutline,
  IoCloseCircleOutline,
  IoStar,
  IoChevronDown,
  IoShieldCheckmark,
  IoFlashOutline,
} from "react-icons/io5";

interface RideDetailsProps {
  ride: MockRideDetails;
}

export default function RideDetails({ ride }: RideDetailsProps) {
  const router = useRouter();
  const [seatsToReserve, setSeatsToReserve] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="container mx-auto pt-4 md:pt-12 px-4 sm:px-8 animate-fade-in pb-12">
      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-dark font-bold hover:text-primary transition-colors mb-8 group"
      >
        <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center bg-white group-hover:border-primary/30 group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)] transition-all">
          <IoArrowBack size={20} />
        </div>
        <span>Retour aux résultats</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Main Details */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Header Title */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-dark leading-tight flex items-center flex-wrap gap-4">
              <span>{ride.departure.city.split(",")[0]}</span>
              <span className="text-neutral-300">vers</span>
              <span>{ride.arrival.city.split(",")[0]}</span>
            </h1>
            <p className="text-xl font-bold text-primary mt-3">
              {ride.departure.date} à {ride.departure.time}
            </p>
          </div>

          {/* Premium Journey Timeline */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 mt-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
            <h2 className="text-2xl font-black text-dark mb-8">Itinéraire</h2>

            <div className="flex flex-col relative px-2">
              {/* Departure Node */}
              <div className="flex gap-4 md:gap-6 relative group">
                <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-neutral-200"></div>

                <div className="w-5 h-5 rounded-full border-4 border-primary bg-white shadow-md shadow-primary/20 shrink-0 relative z-10 mt-1.5 transition-transform"></div>

                <div className="flex-1 pb-10">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="text-lg font-black text-dark">
                      {ride.departure.time.split(" ")[0]}
                    </span>
                    <h3 className="text-lg font-bold text-dark">
                      {ride.departure.city}
                    </h3>
                  </div>
                  <p className="text-base font-medium text-neutral-600 mb-1">
                    {ride.departure.address}
                  </p>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
                    {ride.departure.description}
                  </p>
                </div>
              </div>

              {/* Arrival Node */}
              <div className="flex gap-4 md:gap-6 relative group pt-2">
                <div className="bg-white rounded-full p-1 shadow-sm shadow-dark/10 shrink-0 relative z-10 mt-0.5 -ml-[3px] border border-neutral-100 group-hover:-translate-y-1 transition-transform">
                  <IoLocationOutline size={18} className="text-dark" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="text-lg font-black text-dark">
                      {ride.arrival.time.split(" ")[0]}
                    </span>
                    <h3 className="text-lg font-bold text-dark">
                      {ride.arrival.city}
                    </h3>
                  </div>
                  <p className="text-base font-medium text-neutral-600 mb-1">
                    {ride.arrival.address}
                  </p>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
                    {ride.arrival.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center gap-5 group cursor-pointer hover:border-primary/20 transition-colors">
              <div className="relative w-16 h-16 rounded-full shrink-0 shadow-sm border border-neutral-200">
                <Image
                  src={ride.driver.photo}
                  alt={ride.driver.name}
                  fill
                  className="object-cover rounded-full transition-transform duration-500"
                />
                {ride.driver.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <IoShieldCheckmark className="text-green-500 text-base" />
                  </div>
                )}
              </div>
              <div className="text-left flex-1">
                <h4 className="text-base font-bold text-dark">
                  {ride.driver.name}
                </h4>
                <div className="flex items-center gap-1 text-sm font-bold text-neutral-500 mt-1">
                  <IoStar className="text-yellow-400" />
                  <span className="text-dark">{ride.driver.rating}</span>
                  <span className="text-neutral-400 hidden sm:inline">
                    ({ride.driver.reviewsCount} avis)
                  </span>
                </div>
              </div>
            </div>

            {/* Car */}
            <div className="bg-white rounded-3xl p-0 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col sm:flex-row relative overflow-hidden group min-h-[140px]">
              <div className="p-6 sm:w-1/2 flex flex-col justify-center relative z-10">
                <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Véhicule
                </h4>
                <p className="text-lg font-bold text-dark">
                  {ride.car.make} {ride.car.model}
                </p>
                <p className="text-sm font-medium text-neutral-500">
                  {ride.car.color} • Année {ride.car.year}
                </p>
              </div>
              {ride.car.photo ? (
                <div className="relative h-60 sm:h-auto sm:w-1/2 bg-neutral-100">
                  <Image
                    src={ride.car.photo}
                    alt={ride.car.make}
                    fill
                    className="object-cover transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="p-6 sm:w-1/2 flex items-center justify-end relative z-0">
                  <div className="absolute -right-4 -bottom-4 bg-neutral-50 rounded-full p-8 group-hover:scale-110 transition-transform">
                    <IoCarOutline size={48} className="text-neutral-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Stops */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <IoMapOutline size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="text-base font-bold text-dark">
                  Arrêts supplémentaires
                </h4>
                <p className="text-sm font-medium text-neutral-500">
                  Cet itinéraire compte{" "}
                  {ride.stops.length > 0 ? "plusieurs" : "zéro"} arrêts.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-neutral-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                <IoCloseCircleOutline size={24} className="text-neutral-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-dark">
                  Politique d'annulation
                </h4>
                <p
                  className="text-sm font-medium text-neutral-500 leading-snug line-clamp-2"
                  title={ride.policy.description}
                >
                  {ride.policy.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Sticky Widget */}
        <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-6 self-start sticky top-28 z-30">
          <div className="bg-dark rounded-4xl squircle p-8 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-neutral-800 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Price Header */}
            <div className="mb-8 relative z-10">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-white leading-none">
                  {Math.floor(ride.price)}
                </span>
                <span className="text-2xl font-bold">{ride.currency}</span>
                <span className="text-sm font-medium text-neutral-400 mb-1 ml-1 uppercase tracking-wider">
                  par place
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                {ride.amenities.instantBooking && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-dark bg-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-white/10">
                    <IoFlashOutline
                      size={15}
                      className="shrink-0 -translate-y-[0.5px]"
                    />{" "}
                    Instantané
                  </span>
                )}
                {ride.amenities.max2Back && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Max 2 / arrière
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-neutral-800 w-full mb-8"></div>

            {/* Comfort / Options */}
            <div className="mb-8 space-y-4 relative z-10">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Ce qui est inclus
              </h4>

              <div className="flex flex-wrap gap-2">
                {ride.amenities.luggage && (
                  <div className="px-3 py-2 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-300"
                    >
                      <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                      <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"></path>
                      <path d="M10 20h4"></path>
                    </svg>
                    <span className="text-sm font-medium text-neutral-300">
                      Bagage max
                    </span>
                  </div>
                )}
                {/* Visual indicator for non-included if we want, or just omit them. Keeping it clean. */}
                {!ride.amenities.smoking && (
                  <div className="px-3 py-2 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-center gap-2">
                    <div className="relative">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-500"
                      >
                        <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                        <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full border-t border-neutral-500 rotate-45 transform origin-center translate-y-[8px]"></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">
                      Non Fumeur
                    </span>
                  </div>
                )}
                {!ride.amenities.pet && (
                  <div className="px-3 py-2 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-center gap-2">
                    <div className="relative">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-500"
                      >
                        <path d="M12 5c2 0 2-3 2-3s0 3 2 3c1.7 0 2 1.3 2 3 0 1.5-.7 3-1.4 4-.6.9-1.6 1.5-2.6 1.7V22H10v-5.2c-1 .2-2-.8-2.6-1.7-.7-1-1.4-2.5-1.4-4 0-1.7.3-3 2-3z"></path>
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full border-t border-neutral-500 rotate-45 transform origin-center translate-y-[8px]"></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">
                      Animaux interdits
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Warning / Pre-authorization Note */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex gap-3 relative z-10 hover:bg-white/10 transition-colors">
              <IoCardOutline
                size={24}
                className="text-neutral-400 shrink-0 mt-0.5"
              />
              <p className="text-xs font-medium text-neutral-300 leading-relaxed">
                La contribution de {Math.floor(ride.price)}$ est préautorisée
                sur votre carte. Une partie du montant est reversée en cas
                d'annulation de dernière minute. (frais: {ride.bookingFee}$)
              </p>
            </div>

            {/* Booking Controls */}
            <div className="flex flex-col gap-4 relative z-20">
              <div className="relative h-14">
                <button
                  className="w-full h-full flex items-center justify-between px-5 rounded-full bg-dark-900 border border-neutral-700 hover:border-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-sm font-bold text-white">
                    Réserver {seatsToReserve} place
                    {seatsToReserve > 1 ? "s" : ""}
                  </span>
                  <IoChevronDown
                    className={`text-white transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 w-full bg-dark border border-neutral-700 shadow-2xl rounded-2xl overflow-hidden z-30">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        className="w-full text-left px-5 py-3 hover:bg-neutral-800 text-sm font-bold text-white transition-colors"
                        onClick={() => {
                          setSeatsToReserve(num);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {num} place{num > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="w-full h-14 bg-primary text-white text-base font-black rounded-full hover:bg-white hover:text-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Confirmer & Payer
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
