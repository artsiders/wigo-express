"use client";

import { useProfile } from "@/hooks/useProfile";
import {
  LuShieldCheck,
  LuCar,
  LuMapPin,
  LuSettings,
  LuChevronRight,
} from "react-icons/lu";
import { Link } from "@/i18n/routing";
import { IoCameraOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import Image from "next/image";
import Alert from "@/components/ui/Alert";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";

// Helper pour extraire les initiales du nom
function getInitials(name?: string | null): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? "";
  return (words[0][0] ?? "").toUpperCase() + (words[1][0] ?? "").toUpperCase();
}

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    if (typeof window !== "undefined")
      window.location.href = "/login?callbackUrl=/profile";
    return null;
  }

  const isLicensePending = profile.kycVerifications?.some(
    (v) => v.type === "LICENSE" && v.status === "PENDING",
  );

  const isIdentityPending = profile.kycVerifications?.some(
    (v) =>
      ["IDENTITY_RECTO", "IDENTITY_VERSO", "SELFIE"].includes(v.type) &&
      v.status === "PENDING",
  );

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Mon Profil" }]}
      />

      <SectionHeader
        title="Mon Profil"
        description="Gérez vos informations personnelles et vos préférences de trajet."
      />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar: User Quick Info */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-dark rounded-2xl p-8 shadow-2xl border border-neutral-800 text-white relative overflow-hidden group">
            {/* Décoration en arrière-plan */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            {/* Bouton Modifier déplacé ici */}
            <Link
              href="/profile/edit"
              className="absolute top-6 right-6 p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all z-20"
              title="Modifier le profil"
            >
              <LuSettings size={18} />
            </Link>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer w-32 h-32">
                {/* Affichage de l'image si dispo, sinon initiales */}
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-neutral-800 group-hover:opacity-80 transition-opacity"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-neutral-700 border-4 border-neutral-800 text-5xl font-bold text-white select-none">
                    {getInitials(profile.name)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-dark text-white">
                  <IoCameraOutline size={20} />
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-black">{profile.name}</h2>
              {profile.idVerified ? (
                <div className="flex items-center gap-2 mt-2 py-1 px-4 bg-green-400/30 rounded-full text-green-400 text-sm font-bold">
                  <IoShieldCheckmarkOutline />
                  Profil Vérifié
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2 py-1 px-4 bg-zinc-300/30 rounded-full text-zinc-500 text-sm font-bold">
                  <IoShieldCheckmarkOutline />
                  Profil non vérifié
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 w-full mt-10">
                <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Trajets
                  </p>
                  <p className="text-xl font-black">6</p>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Note
                  </p>
                  <p className="text-xl font-black">4.9/5</p>
                </div>
              </div>
            </div>
          </div>

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
                  <LuCar className="text-primary" size={20} />
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
          {/* Status Alerts */}
          {isLicensePending && (
            <Alert
              type="info"
              title="Dossier conducteur en cours"
              description="Nous vérifions vos documents de conduite. Vous recevrez une notification d'ici 24 à 48 heures."
              className="shadow-indigo-100/50"
            />
          )}

          {isIdentityPending && (
            <Alert
              type="info"
              title="Vérification d'identité en cours"
              description="Votre identité est en cours de validation par notre service de sécurité. Cela peut prendre quelques heures."
              className="shadow-indigo-100/50"
            />
          )}

          {/* Action Card: Become Driver (if not) */}
          {!profile.isDriver && !isLicensePending && (
            <Link href="/become-driver" className="group block">
              <div className="bg-primary rounded-2xl p-8 relative overflow-hidden transition-all hover:bg-primary-600">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Rentabilisez vos trajets quotidiens
                    </h3>
                    <p className="text-neutral-100 max-w-md">
                      Devenez conducteur sur la plateforme et partagez vos frais
                      de route en toute sécurité.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-md font-bold transition-transform group-hover:translate-x-1">
                    Commencer <LuChevronRight size={18} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
              </div>
            </Link>
          )}

          {/* Vehicle Section (if driver) */}
          {profile.isDriver && (
            <section className="bg-white border border-zinc-200 rounded-xl">
              <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="font-bold text-zinc-900">
                  Véhicules enregistrés
                </h3>
                <Link href="/profile/vehicles" className="btn-outlined">
                  Gérer
                </Link>
              </div>

              {!profile.vehicles || profile.vehicles.length === 0 ? (
                <div className="p-6 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">
                    Aucun véhicule enregistré.
                  </p>
                  <Link
                    href="/profile/vehicles"
                    className="text-xs font-bold px-3 py-1.5 bg-zinc-100 rounded-md"
                  >
                    Ajouter
                  </Link>
                </div>
              ) : (
                profile.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-6 flex items-center gap-6 border-b border-zinc-50 last:border-0"
                  >
                    <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-zinc-400">
                      <LuCar size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-zinc-900">
                        {v.make} {v.model}
                      </p>
                      <p className="text-xs text-zinc-500 uppercase tracking-tighter">
                        {v.licensePlate}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-600 rounded">
                          {v.seatsCapacity} Places
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              <Link href="/search" className="btn-dark w-fit mx-auto mt-6">
                Rechercher un trajet maintenant
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
