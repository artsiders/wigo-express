import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Settings,
  Sparkles,
  ListVideo,
  CreditCard,
  User,
  ArrowRight
} from "lucide-react";

export default async function MyAccountPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Header compact façon navigation */}
      <header className="sticky top-0 z-50 bg-[#f9f9f9]/80 backdrop-blur-md border-b border-black/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/create" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <ArrowRight className="w-4 h-4 text-black rotate-180" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-black">Retour au Studio</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Panel</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-20">

        {/* En-tête de la page */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
              Mon Profil.
            </h1>
            <p className="text-neutral-500 font-medium text-lg">
              Bienvenue, {session?.user?.name?.split(' ')[0] || "Créateur"}. Gérez votre espace.
            </p>
          </div>

          {session?.user?.image ? (
            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-4xl overflow-hidden border border-black/10 shadow-xl">
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-4xl bg-black border border-black/10 shadow-xl flex items-center justify-center">
              <User className="h-8 w-8 text-white/50" />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Colonne de gauche : Infos & Actions (1/3) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">

            {/* Carte Infos */}
            <div className="bg-white rounded-4xl p-8 border border-black/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Informations
              </h2>

              {session ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nom Complet</label>
                    <p className="font-semibold text-black mt-1 text-lg">{session.user?.name || "Non spécifié"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Adresse Email</label>
                    <p className="font-semibold text-black mt-1">{session.user?.email}</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-10 pt-8 border-t border-black/5">
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}>
                  <button type="submit" className="w-full group flex items-center justify-between px-5 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest">Déconnexion</span>
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

            {/* Carte Support */}
            <div className="bg-[#0a0a0a] rounded-4xl p-8 border border-black/5 shadow-xl text-white">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
                Besoin d'aide ?
              </h2>
              <p className="text-sm font-medium text-neutral-300 mb-6 leading-relaxed">
                Notre équipe est disponible pour vous accompagner dans la création de vos Reels viraux.
              </p>
              <a href="https://wa.me/237677417638?text=Bonjour%20%21%20J%27ai%20besoin%20d%27aide%20avec%20SnapToAd." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-neutral-300 transition-colors">
                Contacter le support <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Colonne de droite : Contenu principal (2/3) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">

            {/* Abonnement et Crédits */}
            <div className="bg-white rounded-4xl p-8 md:p-10 border border-black/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
              {/* Effet d'arrière plan */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Plan Actuel
                </h2>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100/50 text-emerald-700 border border-emerald-200">
                  Plan Standard
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter">5</span>
                  <span className="text-neutral-400 font-medium pb-1.5 md:pb-2 text-lg uppercase tracking-widest">/ 5 Vidéos restantes</span>
                </div>

                <div className="w-full bg-neutral-100 rounded-full h-3 mb-4 overflow-hidden">
                  <div className="bg-black h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <div className="items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-50 border border-black/5 px-4 py-3 rounded-xl inline-flex">
                  <Sparkles className="w-4 h-4 text-neutral-500" />
                  L'intégration de la facturation et des modèles IA arrive bientôt.
                </div>
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white rounded-4xl border border-black/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
              <div className="p-8 md:p-10 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <ListVideo className="w-4 h-4" /> Mes Créations
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">0 Total</span>
              </div>

              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-neutral-50">
                <div className="w-16 h-16 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center mb-6">
                  <ListVideo className="w-6 h-6 text-neutral-300" />
                </div>
                <h3 className="text-lg font-bold text-black uppercase tracking-widest mb-2">Aucune vidéo générée.</h3>
                <p className="text-neutral-500 text-sm font-medium max-w-sm mb-8 leading-relaxed">
                  Il est temps de sublimer vos produits. Générez votre première vidéo promotionnelle virale en quelques clics.
                </p>
                <Link
                  href="/create"
                  className="group relative inline-flex items-center gap-4 rounded-full bg-black px-6 py-4 font-extrabold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black/90 hover:shadow-xl active:scale-95"
                >
                  <span className="text-xs uppercase tracking-widest">
                    Créer un Reel
                  </span>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
