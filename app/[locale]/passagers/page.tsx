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
  IoCheckmarkCircle,
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
      <section className="relative w-full bg-light z-20 pb-32 px-4 lg:px-6">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* STEP 1: Des trajets taillés */}
          <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-neutral-100 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
            <div className="flex-1 w-full text-left order-2 lg:order-1 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-blue-50 text-primary flex items-center justify-center rounded-2xl mb-8 border border-blue-100">
                <IoSearchOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Des trajets taillés <br />
                <span className="text-primary">pour vous.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed mb-6 max-w-md">
                Indiquez simplement d'où vous partez et où vous allez. Notre
                algorithme vous propose instantanément les meilleures
                correspondances, au meilleur prix. Fini les longs trajets en
                solitaire.
              </p>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="bg-white p-8 lg:p-12 rounded-xl shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-neutral-100/60 w-full max-w-md flex items-stretch">
                {/* Vertical connection line & dots */}
                <div className="relative flex flex-col items-center justify-between py-1 mr-6 lg:mr-8 shrink-0">
                  <div className="absolute top-2 bottom-2 w-[2px] bg-neutral-100"></div>
                  <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] z-10"></div>
                  <div className="w-3.5 h-3.5 bg-dark rounded-full z-10"></div>
                </div>
                {/* Horizontal bars */}
                <div className="flex-1 flex flex-col justify-between py-1 gap-12 lg:gap-14">
                  <div className="flex items-center justify-between w-full h-4">
                    <div className="h-full bg-neutral-100/80 rounded-full w-[65%]"></div>
                    <div className="h-full bg-neutral-100/80 rounded-full w-[15%]"></div>
                  </div>
                  <div className="flex items-center justify-between w-full h-4">
                    <div className="h-full bg-neutral-100/80 rounded-full w-[50%]"></div>
                    <div className="h-full bg-neutral-100/80 rounded-full w-[15%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Roulez l'esprit tranquille */}
          <div className="w-full bg-[#111811] text-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-green-900/30 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_35px_70px_rgba(0,0,0,0.5)] relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-1 w-full flex justify-center lg:justify-start relative z-10">
              <div className="bg-[#1c241c] border border-green-900/50 rounded-2xl p-6 sm:p-8 transform -rotate-1 hover:rotate-0 transition-all duration-500 shadow-2xl w-full max-w-sm">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative shadow-lg">
                    <Image
                      src="/images/profile.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-white">
                      Marc-Antoine
                    </h3>
                    <div className="flex items-center gap-1 mt-1 mb-2 text-[#4ade80] font-bold text-[10px] uppercase bg-green-500/10 px-2 py-1 rounded w-max border border-green-500/20">
                      <IoShieldCheckmarkOutline size={12} /> Identité vérifiée
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <IoStar key={i} size={14} />
                      ))}
                      <span className="ml-1 text-xs font-bold text-white">
                        4.9/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full lg:pl-10 relative z-10 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-[#1c241c] text-white flex items-center justify-center rounded-2xl mb-8 border border-green-900/50">
                <IoShieldCheckmarkOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
                Roulez l'esprit <br />
                <span className="text-[#4ade80]">tranquille.</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-md">
                Oubliez les mauvaises surprises. L'identité de chaque conducteur
                est vérifiée (pièce d'identité, permis). Vous savez exactement
                avec qui vous montez grâce aux avis certifiés laissés par notre
                communauté.
              </p>
            </div>
          </div>

          {/* STEP 3: Paiement en ligne */}
          <div className="w-full bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.05)] border border-blue-100 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-transform duration-500 hover:shadow-[0_25px_60px_rgba(37,99,235,0.1)]">
            <div className="flex-1 w-full text-left order-2 lg:order-1 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-blue-100 text-primary flex items-center justify-center rounded-2xl mb-8 border border-blue-200">
                <IoWalletOutline size={28} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6 text-dark">
                Fini les paiements <br />
                <span className="text-primary">en liquide.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-md">
                Réservez et payez en ligne en un seul clic. Le paiement est
                sécurisé et transféré automatiquement au conducteur une fois le
                trajet accompli. Gagnez du temps et évitez les tracas à
                l'arrivée.
              </p>
              <Link
                href="/register"
                className="btn-secondary w-max bg-white text-dark border-neutral-200 shadow-sm hover:border-neutral-300"
              >
                Rejoindre Wigo Express
              </Link>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2 relative z-10">
              <div className="bg-dark text-white rounded-2xl p-10 shadow-2xl w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500 relative">
                <div className="absolute -top-2 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border-4 border-dark z-20">
                  <IoCheckmarkCircle className="inline mr-1" size={14} />{" "}
                  PAIEMENT GARANTI
                </div>
                <div className="text-left mb-8 relative z-10">
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-3">
                    Montant du trajet
                  </p>
                  <h3 className="text-5xl font-black tracking-tighter text-white">
                    15.00{" "}
                    <span className="text-2xl text-neutral-400 inline-block -translate-y-2">
                      $
                    </span>
                  </h3>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(37,99,235,0.2)] flex justify-center items-center gap-2 transition-transform hover:scale-[1.02] relative z-10 border border-blue-500">
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
