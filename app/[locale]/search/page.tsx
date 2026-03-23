import React from 'react';
import { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RideSearchWidget from '@/components/search/RideSearchWidget';
import RideCard, { RideData } from '@/components/search/RideCard';
import { IoFilterOutline, IoCarOutline } from 'react-icons/io5';

// Added Custom SEO Metadata for the search page
export const metadata: Metadata = {
  title: 'Trajets Disponibles | WIGO EXPRESS',
  description: 'Trouvez et réservez votre prochain trajet en covoiturage premium au Canada.',
};

// Extremely premium random mocked data
const MOCK_RIDES: RideData[] = [
  {
    id: "r1",
    driver: {
      name: "Alexandre Tremblay",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
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
    price: 45.00,
    currency: "$",
    seatsAvailable: 3,
    duration: "3h 15m",
    features: ["instant_booking", "max_2_back"],
  },
  {
    id: "r2",
    driver: {
      name: "Sophie Laurent",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
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
    price: 38.50,
    currency: "$",
    seatsAvailable: 1,
    duration: "3h 15m",
    features: ["max_2_back"],
  },
  {
    id: "r3",
    driver: {
      name: "Jean-Michel Côté",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
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
    price: 15.00,
    currency: "$",
    seatsAvailable: 4,
    duration: "45m",
    features: ["instant_booking"],
  }
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const depart = typeof params.depart === 'string' ? params.depart : "";
  const arrivee = typeof params.arrivee === 'string' ? params.arrivee : "";
  const dateStr = typeof params.date === 'string' ? params.date : "";

  // Filter mocked rides (naive implementation for demo)
  let filteredRides = MOCK_RIDES;
  
  // Actually filter the mock data if query params match some of our cities.
  if (depart) {
    filteredRides = filteredRides.filter(r => r.departure.city.toLowerCase().includes(depart.toLowerCase()));
  }
  if (arrivee) {
    filteredRides = filteredRides.filter(r => r.arrival.city.toLowerCase().includes(arrivee.toLowerCase()));
  }

  // If filtered is empty, we just show all of them with a message for the demo
  const hasResults = filteredRides.length > 0;
  const displayRides = hasResults ? filteredRides : MOCK_RIDES;

  return (
    <div className="bg-light min-h-screen text-dark flex flex-col pt-24">
      <Navbar />
      
      {/* Search Header Area - Mobile Only */}
      <div className="w-full bg-white border-b border-neutral-100 shadow-sm z-40 pb-6 pt-4 px-4 lg:hidden">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
           {/* Mobile horizontal-ish widget */}
           <RideSearchWidget variant="horizontal" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 pl-4 lg:pl-0">
        
        {/* Left Sidebar: Search & Filters */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 self-start sticky top-28 z-30">
          
          <div className="hidden lg:block z-40">
            <RideSearchWidget variant="vertical" />
          </div>

          <div className="bg-dark rounded-4xl squircle p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-neutral-800 hidden lg:block text-white">
            <div className="flex items-center gap-3 mb-8 font-black text-white text-lg">
              <IoFilterOutline size={24} className="text-primary" />
              Trier & Filtrer
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Trier par</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-dark shrink-0">
                       <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-white transition-colors">Départ le plus tôt</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-600 group-hover:border-primary transition-colors flex items-center justify-center bg-dark shrink-0"></div>
                    <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">Prix le plus bas</span>
                  </label>
                </div>
              </div>

              <div className="h-px bg-neutral-800 w-full"></div>

              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Confort</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">Max. 2 à l'arrière</span>
                    <div className="w-11 h-6 bg-primary rounded-full relative shadow-inner shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">Réservation immédiate</span>
                    <div className="w-11 h-6 bg-neutral-700 rounded-full relative shadow-inner shrink-0">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-neutral-400 rounded-full shadow-sm"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content: Stats + Ride Cards */}
        <div className="flex-1 flex flex-col z-10 w-full">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-dark leading-tight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              Trajets disponibles
              <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full self-start sm:self-auto">{displayRides.length} trajets</span>
            </h1>
            {depart && arrivee ? (
               <p className="text-neutral-500 font-medium mt-2 text-lg">
                 De <span className="text-dark font-bold">{depart}</span> vers <span className="text-dark font-bold">{arrivee}</span> {dateStr && <span>le <span className="text-dark font-bold">{dateStr}</span></span>}
               </p>
            ) : (
               <p className="text-neutral-500 font-medium mt-2 text-lg">
                 Découvrez tous nos trajets premium.
               </p>
            )}
            
            {!hasResults && (
              <div className="mt-8 bg-orange-50/80 border border-orange-100 text-orange-700 p-5 rounded-3xl flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0">
                  <IoCarOutline size={26} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Aucun trajet ne correspond</h3>
                  <p className="text-sm text-orange-600/80">Nous n'avons pas trouvé de trajet exact. Voici quelques suggestions populaires que vous pourriez aimer à la place.</p>
                </div>
              </div>
            )}
          </div>

          {/* Ride List */}
          <div className="flex flex-col gap-6 w-full">
            {displayRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <button className="px-10 py-4 bg-white border-2 border-neutral-100 rounded-full shadow-sm text-sm font-bold text-dark hover:border-primary hover:text-primary transition-colors hover:shadow-md">
              Charger plus de trajets
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
