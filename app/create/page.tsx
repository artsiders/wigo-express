"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/components/auth-modal";
import {
  Play,
  Sparkles,
  User,
  Clock,
  Loader2,
  Wand2,
  Download,
  Gem,
  Flame,
  Smile,
  ListVideo,
  Image as ImageIcon,
  X,
  ArrowUpRight,
  CheckIcon,
  Star,
  Lock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getGenerations, saveGeneration } from "@/actions/generations";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function StaticToReelApp() {
  const { status } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [tone, setTone] = useState("");
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRestored, setIsRestored] = useState(false); // To avoid hydration mismatches
  const [history, setHistory] = useState<any[]>([]);

  // 1. Restore from LocalStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("snapToReel_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.uploadedImage) setUploadedImage(parsed.uploadedImage);
        if (parsed.productName) setProductName(parsed.productName);
        if (parsed.tone) setTone(parsed.tone);
        if (parsed.script) setScript(parsed.script);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.error("Impossible de restaurer le brouillon:", e);
    }
    setIsRestored(true);
  }, []);

  // 2. Save to LocalStorage whenever critical states change (after restore phase)
  useEffect(() => {
    if (!isRestored) return;

    // Only save if we actually have data, to avoid overwriting with empty defaults
    if (uploadedImage || productName || tone || script) {
      const draft = {
        uploadedImage,
        productName,
        tone,
        script,
        currentStep: currentStep < 4 ? currentStep : 3 // Keep user at max step 3 before video gen
      };
      localStorage.setItem("snapToReel_draft", JSON.stringify(draft));
    }
  }, [uploadedImage, productName, tone, script, currentStep, isRestored]);

  // Handle successful generation (clear draft)
  const clearDraft = useCallback(() => {
    localStorage.removeItem("snapToReel_draft");
  }, []);

  const resetForm = useCallback(() => {
    clearDraft();
    setUploadedImage(null);
    setProductName("");
    setTone("");
    setScript("");
    setCurrentStep(1);
  }, [clearDraft]);

  // Handle history fetching
  useEffect(() => {
    if (status === "authenticated") {
      getGenerations().then(data => setHistory(data)).catch(console.error);
    } else {
      setHistory([]);
    }
  }, [status]);

  useGSAP(() => {
    gsap.fromTo(
      ".fade-in-up",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const animateStepEntrance = (selector: string) => {
    gsap.fromTo(
      selector,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setCurrentStep(2);
        setTimeout(() => animateStepEntrance(".step-2-container"), 50);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Fichier trop volumineux (max 5MB)");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxSize: 5242880,
    multiple: false,
  });

  const generateScript = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const scripts: Record<string, string> = {
        Luxe: `Découvrez ${productName || "ce produit exceptionnel"}. Un design raffiné qui sublime chaque détail. L'excellence à portée de main. Vivez l'expérience premium.`,
        Urgent: `${productName || "Ce produit"} - OFFRE LIMITÉE ! Ne laissez pas passer cette opportunité unique. Stock limité. Commandez maintenant avant qu'il ne soit trop tard !`,
        Humoristique: `Alors comme ça vous cherchez ${productName || "le produit parfait"} ? Spoiler alert : vous venez de le trouver ! 😎 Préparez-vous à impressionner tout le monde.`,
      };
      const selectedScript =
        scripts[tone] ||
        `Découvrez ${productName || "notre produit"} dans toute sa splendeur. Innovation et qualité réunies.`;

      setScript(selectedScript);
      setIsGenerating(false);
      setCurrentStep(3);
      setTimeout(() => animateStepEntrance(".step-3-container"), 50);
    }, 1500);
  };

  const generateVideo = () => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }

    setIsGeneratingVideo(true);
    setTimeout(async () => {
      try {
        await saveGeneration({
          prompt: productName || "Produit sans nom",
          tone: tone || "Neutre",
          script: script,
          imageUrl: uploadedImage || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&h=533&fit=crop"
        });
        const updated = await getGenerations();
        setHistory(updated);
      } catch (err) {
        console.error("Save error:", err);
      }

      setIsGeneratingVideo(false);
      clearDraft(); // Clean the local storage when generation successfully triggers
      setCurrentStep(4);
      setTimeout(() => animateStepEntrance(".step-4-container"), 50);

      // Animate the final video reveal
      gsap.fromTo(".final-video-reveal",
        { scale: 0.9, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
      );
    }, 2500);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f9f9f9] text-black font-sans selection:bg-black selection:text-white relative">
      <div className="relative z-10 bg-[#070707] pb-12">

        {/* Header */}
        <header className={`sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] bg-[#f9f9f9] ${isScrolled ? 'border-b border-black/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] py-3' : 'border-b border-black/5 py-4'}`}>
          <div className="container mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image src="/images/dark-logo.png" alt="SnapToAd Logo" fill className="object-contain block dark:hidden" priority />
                <Image src="/images/light-logo.png" alt="SnapToAd Logo" fill className="object-contain hidden dark:block" priority />
              </div>
              <span className="text-sm font-bold tracking-widest hidden sm:inline-block text-black">SnapToAd</span>
            </Link>

              
              <Link
                href="/my-account"
                className="group flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-widest border border-black/10 rounded-full text-black hover:bg-black/5 hover:border-black/20 transition-all active:scale-95"
              >
                <User className="w-4 h-4 text-neutral-900 transition-colors" />
                <span className="hidden sm:inline">Mon Compte</span>
              </Link>
          </div>
        </header>

        <main className="bg-[#f9f9f9] px-6 py-12 md:py-20 text-black">
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Left Column - Steps */}
            <div className="flex-1 w-full max-w-2xl">

              <div className="fade-in-up mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
                    Créer un Reel.
                  </h1>
                  <p className="text-neutral-400 font-light text-lg">
                    Suivez les étapes. L'IA s'occupe de la magie.
                  </p>
                </div>
                {(uploadedImage || productName || tone || script) && currentStep < 4 && (
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors bg-white border border-black/10 px-4 py-2.5 rounded-full shadow-sm hover:border-red-500/30 hover:bg-red-50 shrink-0 self-start lg:mt-2"
                  >
                    <X className="w-3.5 h-3.5" /> Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-12">

                {/* Step 1: Upload */}
                <section className="fade-in-up relative pl-10 md:pl-12">
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center w-7">
                    <div className={`w-7 h-7 aspect-square rounded-full flex items-center justify-center text-[10px] font-bold z-10 bg-black ${currentStep >= 1 ? 'text-white' : 'text-neutral-600'}`}>
                      {currentStep > 1 ? <CheckIcon className="w-4 h-4 text-white" /> : 1}
                    </div>
                    <div className="w-px h-full bg-black/10 my-2"></div>
                  </div>

                  <h2 className="text-xs font-bold mb-6 tracking-widest uppercase text-neutral-500">
                    L'Image Source
                  </h2>

                  {!uploadedImage ? (
                    <div
                      {...getRootProps()}
                      className={`group bg-white border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${isDragActive
                        ? "border-black bg-neutral-50 scale-[1.02]"
                        : "border-black/10 hover:border-black/30 hover:bg-neutral-50 hover:shadow-xl"
                        }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <ImageIcon
                          className="w-8 h-8 text-black/50"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-lg font-bold text-black mb-2">
                        {isDragActive ? "Lâchez l'image ici..." : "Glissez votre photo produit"}
                      </p>
                      <p className="text-sm text-neutral-500 font-medium mb-6">
                        JPG, PNG, WEBP (Max 5MB)
                      </p>
                      <div className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full group-hover:bg-black/90 transition-colors shadow-lg pointer-events-none">
                        Parcourir les fichiers
                      </div>
                    </div>
                  ) : (
                    <div className="relative group overflow-hidden rounded-3xl border border-black/10 inline-block w-full max-w-md shadow-xl bg-white p-2">
                      <div className="relative w-full h-auto rounded-2xl overflow-hidden aspect-square">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-2 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center">
                        <button
                          onClick={resetForm}
                          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl"
                        >
                          <X className="w-4 h-4" /> Remplacer
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Step 2: Context */}
                {currentStep >= 2 && (
                  <section className="step-2-container relative pt-8 pl-10 md:pl-12">
                    <div className="absolute left-0 top-8 bottom-0 flex flex-col items-center w-7">
                      <div className={`w-7 h-7 aspect-square rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${currentStep >= 2 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                        {currentStep > 2 ? <CheckIcon className="w-4 h-4 text-white" /> : 2}
                      </div>
                      <div className={`w-px h-full my-2 ${currentStep >= 2 ? 'bg-black/10' : 'bg-neutral-200'}`}></div>
                    </div>

                    <h2 className="text-xs font-bold mb-6 tracking-widest uppercase text-neutral-700">
                      Le Contexte
                    </h2>

                    <div className="flex flex-col gap-6 mb-8">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 text-neutral-600">
                          Nom du produit
                        </label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Ex: Sneakers Air Premium"
                          className="w-full px-5 py-4 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-black/30 focus:bg-neutral-50 transition-colors text-black placeholder:text-neutral-400 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 text-neutral-600">
                          Ton de la vidéo
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setTone('Luxe')}
                            className={`group flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${tone === 'Luxe' ? 'bg-black/90 border-black/80 shadow-lg' : 'bg-neutral-50 border-black/10 hover:bg-black/5 hover:border-black/20'}`}
                          >
                            <Gem className={`w-6 h-6 mb-3 transition-colors ${tone === 'Luxe' ? 'text-white' : 'text-black/50 group-hover:text-black/80'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${tone === 'Luxe' ? 'text-white' : 'text-black/50 group-hover:text-black'}`}>Luxe</span>
                          </button>
                          <button
                            onClick={() => setTone('Urgent')}
                            className={`group flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${tone === 'Urgent' ? 'bg-black/90 border-black/80 shadow-lg' : 'bg-neutral-50 border-black/10 hover:bg-black/5 hover:border-black/20'}`}
                          >
                            <Flame className={`w-6 h-6 mb-3 transition-colors ${tone === 'Urgent' ? 'text-white' : 'text-black/50 group-hover:text-black/80'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${tone === 'Urgent' ? 'text-white' : 'text-black/50 group-hover:text-black'}`}>Urgent</span>
                          </button>
                          <button
                            onClick={() => setTone('Humoristique')}
                            className={`group flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${tone === 'Humoristique' ? 'bg-black/90 border-black/80 shadow-lg' : 'bg-neutral-50 border-black/10 hover:bg-black/5 hover:border-black/20'}`}
                          >
                            <Smile className={`w-6 h-6 mb-3 transition-colors ${tone === 'Humoristique' ? 'text-white' : 'text-black/50 group-hover:text-black/80'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${tone === 'Humoristique' ? 'text-white' : 'text-black/50 group-hover:text-black'}`}>Décalé</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {currentStep === 2 && (
                      <button
                        onClick={generateScript}
                        disabled={!productName || !tone || isGenerating}
                        className="group relative inline-flex items-center gap-5 rounded-full bg-black p-2 pl-6 font-extrabold text-white transition-all duration-500 hover:scale-[1.02] hover:bg-black/90 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <span className="text-xs uppercase tracking-[0.2em] pt-px">
                          {isGenerating ? "Création de la magie..." : "Rédiger le Script"}
                        </span>
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white text-black">
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          )}
                        </div>
                      </button>
                    )}
                  </section>
                )}

                {/* Step 3: Script Review */}
                {currentStep >= 3 && (
                  <section className="step-3-container relative pt-8 pl-10 md:pl-12">
                    <div className="absolute left-0 top-8 bottom-0 flex flex-col items-center w-7">
                      <div className={`w-7 h-7 aspect-square rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${currentStep >= 3 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                        {currentStep > 3 ? <CheckIcon className="w-4 h-4 text-white" /> : 3}
                      </div>
                      <div className={`w-px h-full my-2 ${currentStep === 3 ? "hidden" : "bg-black/10"}`}></div>
                    </div>

                    <h2 className="text-xs font-bold mb-6 tracking-widest uppercase text-neutral-500">
                      Le Script IA
                    </h2>

                    <div className="relative group">
                      <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        rows={4}
                        className="w-full px-6 py-5 bg-white border border-black/10 rounded-2xl focus:outline-none focus:border-black/50 focus:ring-4 focus:ring-black/5 transition-colors resize-none text-lg font-medium leading-relaxed tracking-wide shadow-sm text-black"
                        placeholder="Votre script..."
                      />
                      <div className="absolute top-4 right-4 bg-black/5 text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest pointer-events-none">
                        BETA IA
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~ {Math.max(1, Math.ceil(script.split(" ").filter((w) => w).length / 2.5))} sec d'audio</span>
                      <span>{script.split(" ").filter((w) => w).length} mots</span>
                    </div>

                    {currentStep === 3 && (
                      <div className="mt-8">
                        <button
                          onClick={generateVideo}
                          disabled={isGeneratingVideo || status === "loading"}
                          className="group relative inline-flex items-center gap-5 rounded-full bg-white p-2 pl-6 font-extrabold text-black transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <span className="text-xs uppercase tracking-[0.2em] pt-px">
                            {isGeneratingVideo 
                              ? "Génération du Reel..." 
                              : "Générer la Vidéo"
                            }
                          </span>
                          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black text-white">
                            {isGeneratingVideo ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/* Step 4: Finished */}
                {currentStep >= 4 && (
                  <section className="step-4-container relative pt-8 pb-12 pl-10 md:pl-12">
                    <div className="absolute left-0 top-8 flex flex-col items-center w-7">
                      <div className="w-7 h-7 aspect-square rounded-full flex items-center justify-center text-[10px] font-bold z-10 bg-black text-white">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <h2 className="text-xs font-bold mb-6 tracking-widest uppercase text-black flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Prêt à être publié
                    </h2>

                    <div className="flex gap-4">
                      <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all">
                        <Download className="w-4 h-4" /> Télécharger MP4
                      </button>
                      <button
                        onClick={resetForm}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-black/10 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:border-black/30 hover:bg-neutral-50 bg-white transition-colors">
                        Nouveau Reel
                      </button>
                    </div>
                  </section>
                )}

              </div>
            </div>

            {/* Right Column - Live Preview Phone */}
            <div className="w-full lg:w-[400px] xl:w-[450px]">
              <div className="fade-in-up lg:sticky lg:top-24">

                <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-500 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStep >= 4 ? 'bg-emerald-400' : 'bg-neutral-300'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStep >= 4 ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                    </span>
                    Live Preview
                  </h2>
                </div>

                <div className="relative mx-auto bg-white border border-black/5 rounded-[3rem] p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                  {/* Notch */}
                  <div className="absolute top-3 inset-x-0 h-6 flex justify-center z-30">
                    <div className="w-32 h-4 bg-white border border-black/5 border-t-0 rounded-b-xl mt-px"></div>
                  </div>

                  <div className="relative bg-[#111] rounded-4xl overflow-hidden aspect-9/16 border border-white/5">

                    {uploadedImage ? (
                      <div className="relative w-full h-full">
                        {/* Background blurred image for styling */}
                        <Image
                          src={uploadedImage}
                          alt="Background Preview"
                          fill
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                        />

                        {/* Main Image */}
                        <Image
                          src={uploadedImage}
                          alt="Preview"
                          fill
                          className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                        />

                        {/* Overlay UI when Script/Video is applied */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/50 to-transparent z-20 pointer-events-none" />

                        <div className="absolute z-30 inset-x-4 bottom-8 flex flex-col gap-3">

                          {/* Brand Tag */}
                          {productName && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 w-max">
                              <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                                {productName}
                              </p>
                            </div>
                          )}

                          {/* Captions */}
                          {script && (
                            <div className="bg-black/60 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
                              <p className="text-white text-xs leading-relaxed font-medium">
                                {script}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Play Button or Loading State */}
                        {isGeneratingVideo ? (
                          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white animate-pulse">Rendu en cours...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors shadow-2xl border border-white/30 group">
                              <Play
                                className="w-6 h-6 text-white fill-white ml-1 group-hover:scale-110 transition-transform"
                                strokeWidth={0}
                              />
                            </button>
                          </div>
                        )}

                        {/* Duration / Status Badge */}
                        <div className="absolute top-8 right-6 z-30 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            {currentStep >= 4 ? '15s • PRO' : 'DRAFT'}
                          </span>
                        </div>

                        {/* Final Video Reveal Overlay Effect */}
                        {currentStep >= 4 && (
                          <div className="final-video-reveal absolute inset-0 z-20 pointer-events-none border-4 border-emerald-500/50 rounded-4xl shadow-[inset_0_0_50px_rgba(16,185,129,0.2)]" />
                        )}

                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 relative overflow-hidden">
                        <ImageIcon
                          className="w-12 h-12 text-white/40 mb-4"
                          strokeWidth={1.5}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Aperçu indisponible</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </main>

        {/* History Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-12 md:pb-24 border-t border-black/5 bg-[#070707]">
          <div className="flex items-center mb-8">
            <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-300 flex items-center gap-2">
              <ListVideo className="w-4 h-4" /> Historique des Générations
            </h2>
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 fade-in-up">
              {history.map((item) => (
                <div key={item.id} className="group relative cursor-pointer">
                  <div className="relative aspect-9/16 overflow-hidden rounded-2xl mb-3 border border-white/10 bg-white/5 shadow-sm">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.prompt || "Video"}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl">
                        <Play
                          className="w-4 h-4 text-black fill-black ml-0.5"
                          strokeWidth={0}
                        />
                      </div>
                    </div>
                    {/* Etiquette type "Ton" visuelle */}
                    {item.tone && (
                      <div className="absolute top-2 left-2 flex items-center">
                        <span className="bg-white/90 text-black shadow-sm font-medium text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-black/10">
                          {item.tone}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold uppercase text-white tracking-widest truncate">{item.prompt || "Sans Titre"}</h3>
                    <div className="text-[10px] text-neutral-400 font-medium capitalize">
                      Il y a {formatDistanceToNow(new Date(item.createdAt), { locale: fr })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full relative overflow-hidden flex flex-col items-center justify-center py-24 px-4 border border-dashed border-white/10 rounded-3xl bg-neutral-300/8">
              {/* Subtle background glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 w-20 h-20 mb-8 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="relative z-10 text-lg md:text-xl font-bold uppercase tracking-[0.15em] text-white mb-4 text-center">L'historique est vide</h3>
              <p className="relative z-10 text-sm text-neutral-400 font-medium text-center max-w-sm mb-8 leading-relaxed">
                Révélez le potentiel de vos produits. Transformez votre première image en vidéo pour construire votre galerie.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="relative z-10 px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" /> Créer mon premier Reel
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 
        Curtain Reveal Footer (Copied from landing page)
      */}
      <footer className="footer-wrapper bg-[#f4f4f4] text-black overflow-hidden sticky bottom-0 z-0 flex flex-col">
        <div className="footer-content w-full h-full flex flex-col justify-between px-6 pt-24 pb-6 md:px-12 md:pt-32 md:pb-12 relative">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full container mx-auto flex-1 py-6">
            <div className="max-w-2xl">
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-6 leading-[0.9]">
                Une question ? <br /><span className="text-neutral-400">On est là.</span>
              </h3>
              <p className="text-neutral-500 text-base md:text-xl font-medium max-w-md">
                Besoin d'aide ou d'inspiration ? Notre équipe d'experts vous accompagne pour tirer le maximum de l'IA.
              </p>
            </div>
            <div className="mt-12 md:mt-0 pb-4">
              <a
                href="https://wa.me/237677417638?text=Bonjour%20%21%20J%27ai%20besoin%20d%27aide%20avec%20SnapToAd."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-5 sm:gap-8 rounded-full bg-[#0a0a0a] border border-white/20 p-2 pl-6 sm:pl-8 font-extrabold text-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:scale-[1.02] hover:bg-black hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] active:scale-95"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <span className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] pt-px whitespace-nowrap flex items-center gap-3">
                  Contacter le support
                </span>
                <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center overflow-hidden rounded-full bg-emerald-500/50 text-white shrink-0">
                  <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                  <ArrowUpRight className="absolute h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col w-full container mx-auto mt-auto">
            <div className="w-full h-px bg-neutral-300 mb-6 md:mb-8 z-10 relative"></div>

            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 gap-6 z-10 relative">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-medium normal-case tracking-normal">
                  Powered by
                </span>
                <a href="https://altplus.dev" target="_blank" rel="noopener noreferrer" className="hover:text-black lowercase text-neutral-600 transition-colors relative group">
                  Altplus
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              <Link href="/legal" className="hover:text-black transition-colors relative group">
                Légal & CGU
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
