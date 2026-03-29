"use client";

import React from "react";
import { useTripSuggestions } from "@/hooks/useTrips";
import { mapToRideData } from "@/lib/ride-mapper";
import RideCard from "./RideCard";
import RideCardSkeleton from "../ui/RideCardSkeleton";
import { LuSparkles, LuSearch } from "react-icons/lu";

interface RideSuggestionsProps {
  depart: string;
  arrivee: string;
}

export default function RideSuggestions({
  depart,
  arrivee,
}: RideSuggestionsProps) {
  const { data: suggestions, isLoading } = useTripSuggestions(
    { depart, arrivee },
    true,
  );

  const displaySuggestions = suggestions?.map(mapToRideData) || [];

  if (!isLoading && displaySuggestions.length === 0) {
    return (
      <div className="mt-12 p-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-center">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-400 mx-auto mb-4 border border-neutral-100 shadow-sm">
          <LuSearch size={24} />
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">
          Aucun trajet même approximatif
        </h3>
        <p className="text-neutral-500 font-medium text-sm max-w-sm mx-auto leading-relaxed">
          Nous n'avons trouvé aucun trajet correspondant à vos critères, même en
          élargissant la recherche. Revenez plus tard ou proposez vous-même ce
          trajet !
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <LuSparkles size={16} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark tracking-tight">
            Suggestions pour vous
          </h2>
          <p className="text-neutral-500 font-medium text-xs">
            D'autres trajets qui pourraient vous intéresser à proximité.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <RideCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          displaySuggestions.map((ride) => (
            <div key={ride.id} className="relative">
              <RideCard ride={ride} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
