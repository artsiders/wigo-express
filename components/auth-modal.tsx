"use client";

import { useEffect, useState } from "react";
import { X, Lock, Play, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/create" });
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 font-sans tracking-tight">
            Sauvegarder & Générer
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm leading-relaxed">
            Créez un compte gratuitement pour lancer la génération de votre
            vidéo haute définition et la sauvegarder.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle}
              className="w-full relative flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-100 rounded-full text-sm font-bold text-gray-900 hover:border-black/20 hover:bg-gray-50 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoadingGoogle ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="w-5 h-5 relative shrink-0 transition-transform">
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                </div>
              )}
              Continuer avec Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-gray-100"></div>
              <span className="shrink-0 mx-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                OU
              </span>
              <div className="grow border-t border-gray-100"></div>
            </div>

            <Link
              href="/login?callbackUrl=/create"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-full text-sm font-bold active:scale-95 transition-all font-sans"
            >
              Continuer avec un Email
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            En continuant, vous acceptez nos{" "}
            <Link href="/legal" className="underline hover:text-gray-600">
              Conditions et notre Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
