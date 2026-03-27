"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import {
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
  IoChevronForward,
  IoStar,
} from "react-icons/io5";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PassagersPage() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useGSAP(
    () => {
      // Intro animations
      gsap.from(".hero-elem", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Stack cards narrative
      const stackCards = gsap.utils.toArray(".stack-card") as HTMLElement[];
      stackCards.forEach((card, i) => {
        if (i !== stackCards.length - 1) {
          const nextCard = stackCards[i + 1];
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.5,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: () => `top ${120 + i * 40 + card.offsetHeight}`,
              end: () => `top ${120 + (i + 1) * 40}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="bg-light text-dark overflow-clip transition-colors duration-1000 min-h-screen"
    >
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/bg-texture.png')] opacity-50 z-0"></div>
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-primary-100/50 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-dark leading-tight hero-elem">
            Votre prochain départ commence{" "}
            <span className="text-primary-gradient">ici.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium hero-elem">
            Laissez-vous conduire. Avec des profils vérifiés et des paiements
            garantis, il n'a jamais été aussi simple de traverser le Canada à
            petit prix.
          </p>
          <div className="flex justify-center hero-elem">
            <Link
              href="/search?searchOpen=true"
              className="btn-primary text-lg px-8 py-4"
            >
              Chercher un trajet <IoChevronForward />
            </Link>
          </div>
        </div>
      </section>

      {/* NARRATIVE STEPS */}
      <section className="relative w-full bg-light z-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* STEP 1 */}
          <div className="stack-card sticky top-28 z-10 w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 mb-[10vh] overflow-hidden">
            <div className="flex-1">
              <div className="w-16 h-16 bg-blue-50 text-primary flex items-center justify-center rounded-2xl mb-8 border border-blue-100 shadow-inner">
                <IoSearchOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Des trajets taillés <br />
                <span className="text-primary">pour vous.</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                Indiquez simplement d'où vous partez et où vous allez. Notre
                algorithme vous propose instantanément les meilleures
                correspondances, au meilleur prix. Fini les longs trajets en
                solitaire.
              </p>
            </div>
            <div className="flex-1 w-full bg-light rounded-2xl p-6 relative border border-black/5 shadow-inner">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                  <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                  <div className="flex-1 h-3 bg-neutral-100 rounded-full"></div>
                  <div className="w-16 h-4 bg-neutral-200 rounded-md"></div>
                </div>
                <div className="w-0.5 h-6 bg-neutral-200 ml-5"></div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                  <div className="w-3 h-3 bg-dark rounded-full"></div>
                  <div className="flex-1 h-3 bg-neutral-100 rounded-full"></div>
                  <div className="w-16 h-4 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
              <div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[50px] pointer-events-none"></div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="stack-card sticky top-36 z-20 w-full bg-dark-900 text-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-neutral-800 p-8 lg:p-16 flex flex-col lg:flex-row-reverse items-center gap-12 mb-[10vh] overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-1 relative z-10 lg:pl-10">
              <div className="w-16 h-16 bg-white/10 text-white flex items-center justify-center rounded-2xl mb-8 backdrop-blur-md border border-white/20">
                <IoShieldCheckmarkOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Roulez l'esprit <br />
                <span className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                  tranquille.
                </span>
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed mb-8">
                Oubliez les mauvaises surprises. L'identité de chaque conducteur
                est vérifiée (pièce d'identité, permis). Vous savez exactement
                avec qui vous montez grâce aux avis certifiés laissés par notre
                communauté.
              </p>
            </div>

            <div className="flex-1 w-full relative z-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 transform -rotate-2 hover:rotate-0 transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white/30 shrink-0 shadow-lg">
                    <Image
                      src="/images/profile.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Marc-Antoine</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs px-2 py-1 rounded-md font-bold uppercase flex items-center gap-1">
                        <IoShieldCheckmarkOutline /> Identité Vérifiée
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <IoStar key={i} size={16} />
                      ))}
                      <span className="ml-1 text-sm font-bold text-white">
                        4.9/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="stack-card sticky top-44 z-30 w-full bg-linear-to-br from-primary-800 to-primary-600 text-white rounded-3xl shadow-[0_30px_80px_rgba(37,99,235,0.4)] border border-blue-400/30 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
            <div className="flex-1 relative z-10">
              <div className="w-16 h-16 bg-white/10 text-white flex items-center justify-center rounded-2xl mb-8 backdrop-blur-md border border-white/20">
                <IoWalletOutline size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6 text-white">
                Fini les <br />
                paiements en <span className="text-blue-200">liquide.</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Réservez et payez en ligne en un seul clic. Le paiement est
                sécurisé et transféré automatiquement au conducteur une fois le
                trajet accompli. Gagnez du temps et évitez les tracas à
                l'arrivée.
              </p>
              <Link
                href="/register"
                className="btn-secondary w-max bg-white text-primary border-none hover:bg-neutral-100"
              >
                Rejoindre Wigo Express
              </Link>
            </div>

            <div className="flex-1 w-full flex justify-center relative z-10">
              <div className="bg-white text-dark rounded-2xl p-8 shadow-2xl w-full max-w-sm transform rotate-2 hover:rotate-0 transition-all duration-500 relative">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white">
                  Sécurisé
                </div>
                <div className="text-center mb-6">
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-1">
                    Montant du trajet
                  </p>
                  <h3 className="text-5xl font-black text-dark tracking-tighter">
                    15.00{" "}
                    <span className="text-2xl text-neutral-400 inline-block -translate-y-2">
                      $
                    </span>
                  </h3>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-[0_10px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2 transition-transform hover:scale-[1.02]">
                  Confirmer et Payer <IoChevronForward />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
