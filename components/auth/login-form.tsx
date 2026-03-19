"use client";

import { useState } from "react";
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";
import Link from "next/link";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsPending(true);

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      setError("Veuillez remplir correctement tous les champs.");
      setIsPending(false);
      return;
    }

    // Try to get callbackUrl from query params
    const callbackUrl = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get("callbackUrl")
      : null;

    try {
      const resp = await login(result.data, callbackUrl);
      if (resp?.error) {
        setError(resp.error);
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    const callbackUrl = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get("callbackUrl") || "/my-account"
      : "/my-account";
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-black/5 mx-auto relative overflow-hidden">
      <Link href="/create" className="absolute top-6 left-6 w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-black hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
      </Link>

      <div className="mb-10 mt-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black mb-2 tracking-tighter uppercase">Bon retour.</h1>
        <p className="text-neutral-500 text-sm font-medium">Connectez-vous pour continuer</p>
      </div>

      <div className="space-y-4 mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isPending}
          className="w-full relative flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-100 rounded-full text-sm font-bold text-gray-900 hover:border-black/20 hover:bg-gray-50 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="w-5 h-5 relative shrink-0 group-hover:scale-110 transition-transform">
              <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
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
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black/20 transition-colors text-black font-medium"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
           <label className="flex text-xs font-bold uppercase tracking-widest mb-2 text-gray-600 justify-between">
            <span>Mot de passe</span>
            <Link href="#" className="font-medium text-gray-400 hover:text-black normal-case tracking-normal">Oublié ?</Link>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black/20 transition-colors text-black font-medium"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-black/90 transition-all font-sans disabled:opacity-50 mt-6 active:scale-95"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-gray-500">
        Vous n'avez pas de compte ?{" "}
        <Link href="/register" className="text-black font-bold hover:underline">
          Inscrivez-vous
        </Link>
      </div>
    </div>
  );
}
