"use client";

import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import {
  LuShieldCheck,
  LuCar,
  LuMapPin,
  LuStar,
  LuSettings,
  LuChevronRight,
} from "react-icons/lu";
import { Link } from "@/i18n/routing";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-300 text-dark flex flex-col">
        <Navbar />
        <div className="pt-24 container mx-auto px-6 w-full flex-1 animate-pulse">
          <div className="h-8 w-64 bg-zinc-200 rounded mb-8"></div>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white h-64 border border-zinc-200 rounded-xl"></div>
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white h-32 border border-zinc-200 rounded-xl"></div>
              <div className="bg-white h-96 border border-zinc-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    if (typeof window !== "undefined")
      window.location.href = "/login?callbackUrl=/profile";
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-blue-100">
      <Navbar />

      <main className="pt-38 pb-16 container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Mon Profil{" "}
              <span className="text-zinc-400 font-normal">/ Paramètres</span>
            </h1>
            <p className="text-zinc-500 mt-1">
              Gérez vos informations personnelles et vos préférences de trajet.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors flex items-center gap-2 text-zinc-700">
              <LuSettings size={16} />
              Modifier
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar: User Quick Info */}
          <aside className="lg:col-span-4 space-y-6">
            <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="p-6 text-center border-b border-zinc-100">
                <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden ring-4 ring-zinc-50">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-zinc-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-zinc-500">{profile.email}</p>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4 text-center bg-zinc-50/50">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Note
                  </p>
                  <p className="text-lg font-bold text-zinc-900 flex items-center justify-center gap-1">
                    4.8{" "}
                    <LuStar
                      size={14}
                      className="text-amber-500 fill-amber-500"
                    />
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Trajets
                  </p>
                  <p className="text-lg font-bold text-zinc-900">24</p>
                </div>
              </div>
            </section>

            {/* Verification Status */}
            <section className="bg-white border border-zinc-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Vérifications
              </h3>
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-3 p-3 rounded-md border ${profile.idVerified ? "bg-emerald-50/50 border-emerald-100" : "bg-zinc-50 border-zinc-100"}`}
                >
                  <LuShieldCheck
                    className={
                      profile.idVerified ? "text-emerald-600" : "text-zinc-400"
                    }
                    size={20}
                  />
                  <span
                    className={`text-sm font-medium ${profile.idVerified ? "text-emerald-900" : "text-zinc-500"}`}
                  >
                    {profile.idVerified
                      ? "Identité confirmée"
                      : "Identité non vérifiée"}
                  </span>
                </div>
                {profile.isDriver && (
                  <div className="flex items-center gap-3 p-3 rounded-md border bg-blue-50/50 border-blue-100">
                    <LuCar className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-900">
                      Conducteur certifié
                    </span>
                  </div>
                )}
              </div>
            </section>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Action Card: Become Driver (if not) */}
            {!profile.isDriver && (
              <Link href="/become-driver" className="group block">
                <div className="bg-zinc-900 rounded-xl p-8 relative overflow-hidden transition-all hover:bg-black">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Rentabilisez vos trajets quotidiens
                      </h3>
                      <p className="text-zinc-400 max-w-md">
                        Devenez conducteur sur la plateforme et partagez vos
                        frais de route en toute sécurité.
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-md font-bold transition-transform group-hover:translate-x-1">
                      Commencer <LuChevronRight size={18} />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
                </div>
              </Link>
            )}

            {/* Vehicle Section (if driver) */}
            {profile.isDriver && (
              <section className="bg-white border border-zinc-200 rounded-xl">
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900">
                    Véhicule enregistré
                  </h3>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    Gérer
                  </button>
                </div>
                <div className="p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-zinc-400">
                    <LuCar size={32} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-900">
                      Véhicule non spécifié
                    </p>
                    <p className="text-xs text-zinc-500 uppercase tracking-tighter">
                      Immatriculation en attente
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-600 rounded">
                        3 Places disponibles
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Upcoming Trips Area */}
            <section className="bg-white border border-zinc-200 rounded-xl">
              <div className="px-6 py-4 border-b border-zinc-100">
                <h3 className="font-bold text-zinc-900">Activités récentes</h3>
              </div>
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                  <LuMapPin className="text-zinc-300" size={24} />
                </div>
                <h4 className="text-zinc-900 font-semibold">
                  Aucun trajet prévu
                </h4>
                <p className="text-zinc-500 text-sm mt-1 max-w-xs mx-auto">
                  Vos futurs trajets en tant que passager ou conducteur
                  apparaîtront ici.
                </p>
                <Link
                  href="/search"
                  className="inline-block mt-6 text-sm font-bold text-blue-600 hover:underline"
                >
                  Rechercher un trajet maintenant
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
