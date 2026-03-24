import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  IoStar,
  IoShieldCheckmark,
  IoCashOutline,
  IoFlashOutline,
} from "react-icons/io5";

export interface RideData {
  id: string;
  driver: {
    name: string;
    photo: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
  };
  departure: {
    city: string;
    time: string;
    place: string;
  };
  arrival: {
    city: string;
    time: string;
    place: string;
  };
  price: number;
  currency: string;
  seatsAvailable: number;
  duration: string;
  features: ("instant_booking" | "max_2_back")[];
}

interface RideCardProps {
  ride: RideData;
}

export default function RideCard({ ride }: RideCardProps) {
  return (
    <Link href={`/ride/${ride.id}`} className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)] border border-neutral-100 hover:border-primary/20 transition-all duration-300 block w-full group cursor-pointer relative overflow-hidden">
      {/* Premium subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-colors"></div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        {/* Left Side: Times & Route */}
        <div className="flex-1 flex gap-6">
          {/* Timeline UI */}
          <div className="flex flex-col items-center justify-between py-1 relative w-6">
            <span className="text-sm font-black text-dark">
              {ride.departure.time}
            </span>
            <div className="flex-1 w-0.5 bg-neutral-200 my-2 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-neutral-500 font-bold bg-white py-1">
                {ride.duration}
              </div>
            </div>
            <span className="text-sm font-black text-dark">
              {ride.arrival.time}
            </span>
          </div>

          {/* Locations UI */}
          <div className="flex flex-col justify-between py-1">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-dark leading-none">
                {ride.departure.city}
              </h3>
              <p className="text-sm text-neutral-600 font-medium">
                {ride.departure.place}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark leading-none">
                {ride.arrival.city}
              </h3>
              <p className="text-sm text-neutral-600 font-medium">
                {ride.arrival.place}
              </p>
            </div>
          </div>
        </div>

        {/* Divider for mobile */}
        <div className="w-full h-px bg-neutral-100 md:hidden"></div>

        {/* Right Side: Driver & Price */}
        <div className="flex md:flex-col justify-between items-center md:items-end gap-4 min-w-[200px]">
          {/* Price */}
          <div className="flex-1 md:flex-none">
            <p className="text-3xl font-black text-primary leading-none group-hover:scale-105 transition-transform origin-right">
              {ride.price} <span className="text-lg">{ride.currency}</span>
            </p>
            <p className="text-xs font-bold text-neutral-500 mt-1 uppercase tracking-wider flex justify-start gap-2 items-center">
              <IoCashOutline size={14} /> par place
            </p>
          </div>

          {/* Driver Profile */}
          <div className="flex items-center gap-3 bg-light-400 px-3 py-2 rounded-2xl md:ml-auto">
            <div className="relative w-10 h-10 rounded-full shrink-0 shadow-sm border border-neutral-200">
              <Image
                src={ride.driver.photo}
                alt={ride.driver.name}
                fill
                className="object-cover rounded-full"
              />
              {ride.driver.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <IoShieldCheckmark className="text-green-500 text-sm" />
                </div>
              )}
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-dark">
                {ride.driver.name}
              </h4>
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-500">
                <IoStar className="text-yellow-400" />
                <span>{ride.driver.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Tags */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          {ride.features.includes("instant_booking") && (
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full tracking-wider">
              <IoFlashOutline size={14} /> Réservation instantanée
            </span>
          )}
          {ride.features.includes("max_2_back") && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full tracking-wider">
              Max. 2 à l'arrière
            </span>
          )}
        </div>
        <p className="text-xs font-bold text-neutral-600">
          {ride.seatsAvailable} {ride.seatsAvailable > 1 ? "places" : "place"}
        </p>
      </div>
    </Link>
  );
}
