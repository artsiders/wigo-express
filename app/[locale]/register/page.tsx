"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoChevronBack,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { signIn } from "next-auth/react";
import AlertDialog, { AlertType } from "@/components/ui/AlertDialog";
import Alert from "@/components/ui/Alert";
import gsap from "gsap";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    desc: string;
  }>({ isOpen: false, type: "info", title: "", desc: "" });

  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
      );
      gsap.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setAlertInfo({
        isOpen: true,
        type: "warning",
        title: "Sécurité",
        desc: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setAlertInfo({
          isOpen: true,
          type: "error",
          title: "Erreur d'inscription",
          desc: errorData.message || "Une erreur est survenue.",
        });
        setLoading(false);
        return;
      }

      // Inscription réussie : on connecte l'utilisateur automatiquement
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setAlertInfo({
          isOpen: true,
          type: "error",
          title: "Erreur de connexion",
          desc: "L'inscription a réussi, mais la connexion a échoué.",
        });
        setLoading(false);
      } else {
        window.location.href = "/profile";
      }
    } catch (error) {
      setAlertInfo({
        isOpen: true,
        type: "error",
        title: "Erreur",
        desc: "Impossible de joindre le serveur.",
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <>
      <AlertDialog
        isOpen={alertInfo.isOpen}
        type={alertInfo.type}
        title={alertInfo.title}
        description={alertInfo.desc}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />
      <main className="min-h-screen bg-light-300 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row-reverse overflow-hidden min-h-[750px]">
          {/* Right Column - Image (Reversed for variation) */}
          <div
            ref={imageRef}
            className="hidden lg:flex flex-col relative w-1/2 bg-dark"
          >
            <Image
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200&auto=format&fit=crop"
              alt="Beautiful Scenic View"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-transparent mix-blend-multiply"></div>

            <div className="relative z-10 p-14 h-full flex flex-col">
              <Link
                href="/"
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md text-white hover:bg-white/40 transition-colors self-end"
              >
                <IoChevronBack size={24} className="rotate-180" />
              </Link>
              <div className="mt-auto">
                <div className="w-12 h-1 bg-white mb-6 rounded-full"></div>
                <h1 className="text-4xl xl:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                  Une nouvelle façon de voyager.
                </h1>
                <p className="text-white/90 font-medium text-lg max-w-md">
                  Rejoignez des milliers de conducteurs et passagers dans un
                  environnement de confiance.
                </p>
              </div>
            </div>
          </div>

          {/* Left Column - Form */}
          <div
            ref={formRef}
            className="w-full lg:w-1/2 p-8 sm:p-14 flex flex-col justify-center relative"
          >
            <Link
              href="/"
              className="lg:hidden absolute top-8 left-8 w-12 h-12 bg-light-300 rounded-full flex items-center justify-center text-dark hover:bg-light-400 transition-colors"
            >
              <IoChevronBack size={24} />
            </Link>

            <div className="max-w-md w-full mx-auto mt-14 md:mt-0">
              <h2 className="text-3xl lg:text-4xl font-black text-dark mb-2">
                Créer un compte
              </h2>
              <p className="text-neutral-500 font-medium mb-10">
                Rejoignez la communauté Wigo Express en quelques clics.
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || loading}
                className="w-full bg-white border border-neutral-200 text-dark font-bold rounded-lg py-4 px-6 flex items-center justify-center gap-3 hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-70 h-14"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <Image
                    src="/images/google-icon-logo.svg"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                )}
                S'inscrire avec Google
              </button>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-neutral-100"></div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  ou par e-mail
                </span>
                <div className="flex-1 h-px bg-neutral-100"></div>
              </div>

              {alertInfo.isOpen && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Alert
                    type={alertInfo.type}
                    title={alertInfo.title}
                    description={alertInfo.desc}
                    onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
                  />
                </div>
              )}

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="relative group">
                  <IoPersonOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors"
                    size={22}
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom complet"
                    className="w-full bg-light-300 border border-neutral-300 focus:border-primary rounded-lg py-4 pl-12 pr-4 font-bold text-dark focus:ring-2 focus:ring-primary/30 outline-hidden transition-all placeholder:text-neutral-500 placeholder:font-medium"
                  />
                </div>
                <div className="relative group">
                  <IoMailOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors"
                    size={22}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
                    className="w-full bg-light-300 border border-neutral-300 focus:border-primary rounded-lg py-4 pl-12 pr-4 font-bold text-dark focus:ring-2 focus:ring-primary/30 outline-hidden transition-all placeholder:text-neutral-500 placeholder:font-medium"
                  />
                </div>
                <div className="relative group">
                  <IoLockClosedOutline
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors"
                    size={22}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full bg-light-300 border border-neutral-300 focus:border-primary rounded-lg py-4 pl-12 pr-12 font-bold text-dark focus:ring-2 focus:ring-primary/30 outline-hidden transition-all placeholder:text-neutral-500 placeholder:font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors focus:outline-hidden"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={22} />
                    ) : (
                      <IoEyeOutline size={22} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-dark text-white rounded-lg py-4 font-bold mt-4 shadow-xl shadow-dark/20 hover:bg-primary hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center h-14"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Continuer"
                  )}
                </button>
              </form>

              <p className="text-center font-medium text-neutral-500 mt-10">
                Déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:text-dark transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
