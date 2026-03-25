"use client";

import { useProfile } from "@/hooks/useProfile";
import { DriverRegistrationForm } from "@/components/profile/DriverRegistrationForm";
import { IdVerificationForm } from "@/components/profile/IdVerificationForm";
import Navbar from "@/components/Navbar";
import { LuShieldCheck, LuCar } from "react-icons/lu";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-300 text-dark flex flex-col">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 sm:px-6 w-full flex-1 animate-pulse">
          <div className="h-10 w-48 bg-neutral-200 rounded-xl mb-10"></div>
          <div className="bg-white h-40 rounded-3xl mb-10 shadow-sm border border-neutral-100"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white h-112 rounded-3xl shadow-sm border border-neutral-100"></div>
            <div className="bg-white h-112 rounded-3xl shadow-sm border border-neutral-100"></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback si l'erreur n'est pas rattrapée par le scope middleware global
  if (error || !profile) {
    if (typeof window !== "undefined") {
      window.location.href = "/login?callbackUrl=/profile";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-light-300 text-dark overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-24 container mx-auto px-4 sm:px-6 w-full flex-1">
        <h1 className="text-4xl md:text-5xl font-black mb-10 font-outfit tracking-tight text-dark">
          Espace <span className="text-[#4D80C4]">Privé</span>
        </h1>
        
        {/* User Info Card */}
        <section className="bg-white rounded-3xl p-8 md:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)] relative">
          
          <div className="w-28 h-28 shrink-0 rounded-full bg-light-300 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden z-10">
            {profile.image ? (
              <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-neutral-400">{profile.name?.charAt(0) || "U"}</span>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-3xl font-black mb-1 text-dark">{profile.name}</h2>
            <p className="text-neutral-500 font-medium text-lg mb-6">{profile.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {profile.idVerified ? (
                <span className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-2xl text-sm font-bold border border-green-200">
                  <LuShieldCheck size={18} />
                  Passager Vérifié
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-700 px-5 py-2.5 rounded-2xl text-sm font-bold border border-amber-200">
                  Passager Classique
                </span>
              )}
              
              {profile.isDriver ? (
                <span className="flex items-center gap-2 bg-[#4D80C4]/10 text-[#4D80C4] px-5 py-2.5 rounded-2xl text-sm font-bold border border-[#4D80C4]/20">
                  <LuCar size={18} />
                  Conducteur Actif
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {(!profile.idVerified) && (
            <div className="flex-1">
              <IdVerificationForm kycVerifications={profile.kycVerifications} />
            </div>
          )}

          {!profile.isDriver && (
            <div className="flex-1">
              <DriverRegistrationForm kycVerifications={profile.kycVerifications} license={profile.license} />
            </div>
          )}
          
          {(profile.idVerified && profile.isDriver) && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-12 text-center shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 shadow-sm border border-green-100">
                <LuShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-dark">Votre profil est 100% complété</h3>
              <p className="text-neutral-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Vous êtes prêt(e) à voyager en toute sérénité ou à proposer vos propres trajets à la communauté Wigo Express.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
