"use client";

import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import { LuShieldCheck, LuCar } from "react-icons/lu";
import { Link } from "@/i18n/routing";

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

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Stats Cards */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 font-black text-2xl">
              12
            </div>
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-1">Trajets partagés</h3>
            <p className="text-2xl font-black text-dark">850 km</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 font-black text-2xl">
              4.8
            </div>
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-1">Note globale</h3>
            <p className="text-2xl font-black text-dark">Basé sur 24 avis</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4 font-black text-2xl">
              98%
            </div>
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-1">Fiabilité</h3>
            <p className="text-2xl font-black text-dark">Réponse rapide</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Main Activity / Car Management */}
          <div className="space-y-8">
            {profile.isDriver ? (
               <section className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-neutral-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-dark leading-tight tracking-tight">Votre Véhicule</h3>
                  <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline transition-all">Modifier</button>
                </div>
                <div className="flex items-center gap-6 p-6 bg-light-300 rounded-2xl border border-neutral-100">
                  <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <LuCar size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-dark">Véhicule Enregistré</h4>
                    <p className="text-neutral-500 font-bold uppercase tracking-tighter opacity-70">Plaque : NON-SPECIFIÉ</p>
                    <div className="flex gap-4 mt-2">
                       <span className="text-[10px] font-black bg-white px-2 py-1 rounded-md text-neutral-500 border border-neutral-100 uppercase">3 Places</span>
                       <span className="text-[10px] font-black bg-white px-2 py-1 rounded-md text-neutral-500 border border-neutral-100 uppercase underline decoration-primary decoration-2">Covoitureur Premium</span>
                    </div>
                  </div>
                </div>
               </section>
            ) : (
              <Link href="/become-driver?mode=become-driver" className="block group">
                <section className="bg-dark rounded-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-dark relative overflow-hidden transition-all active:scale-[0.99]">
                  {/* Decorative element */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-all"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white mb-4 leading-tight">Devenez Conducteur <br /><span className="text-primary">et gagnez de l'argent.</span></h3>
                    <p className="text-neutral-400 font-medium text-lg mb-8 max-w-sm">
                      Partagez vos frais de trajet, réduisez votre empreinte carbone et faites de nouvelles rencontres.
                    </p>
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                      Commencer maintenant
                    </div>
                  </div>
                </section>
              </Link>
            )}

            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-neutral-100">
               <h3 className="text-2xl font-black text-dark mb-8 leading-tight tracking-tight">Prochains Trajets</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-center p-12 border-2 border-dashed border-neutral-100 rounded-3xl text-center">
                   <div>
                     <p className="text-neutral-400 font-bold mb-1">Aucun trajet prévu pour le moment.</p>
                     <p className="text-sm text-neutral-300 font-medium">Pourquoi ne pas en chercher un ?</p>
                   </div>
                 </div>
               </div>
            </section>
          </div>

          {/* Verification & Security Side */}
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-neutral-100 h-full">
            <h3 className="text-2xl font-black text-dark mb-8 leading-tight tracking-tight">Sécurité & Vérification</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-5 p-6 bg-green-50/50 rounded-2xl border border-green-100">
                <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <LuShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-green-800">Identité Vérifiée</h4>
                  <p className="text-green-700/70 text-sm font-medium leading-relaxed">Votre compte est totalement sécurisé. Les autres membres vous font plus confiance.</p>
                </div>
              </div>

              <div className="p-6 bg-light-300 rounded-2xl border border-neutral-100">
                <h4 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-4">Paramètres du compte</h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-dark font-bold text-sm border border-transparent hover:border-neutral-100">Changer le mot de passe</button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-dark font-bold text-sm border border-transparent hover:border-neutral-100">Préférences de notifications</button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white transition-all text-dark font-bold text-sm border border-transparent hover:border-neutral-100">Gérer mes documents KYC</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
