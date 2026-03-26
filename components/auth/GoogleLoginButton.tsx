"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface GoogleLoginButtonProps {
  text?: string;
  disabled?: boolean;
}

export default function GoogleLoginButton({
  text = "Continuer avec Google",
  disabled = false,
}: GoogleLoginButtonProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isGoogleLoading || disabled}
      className="w-full bg-white border border-neutral-300 text-dark font-bold rounded-lg py-4 px-6 flex items-center justify-center gap-3 hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-70 h-14"
      type="button"
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
      {text}
    </button>
  );
}
