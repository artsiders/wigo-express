"use client";

import { useState } from "react";
import { useVerifyId, KycVerification } from "@/hooks/useProfile";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

interface Props {
  kycVerifications: KycVerification[];
}

export function IdVerificationForm({ kycVerifications }: Props) {
  const { mutate: verifyId, isPending } = useVerifyId();
  const [documentUrl, setDocumentUrl] = useState("");

  const kycStatus = kycVerifications.find(k => k.type === "ID")?.status;

  if (kycStatus === "PENDING") {
    return (
      <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col justify-center h-full">
        <h3 className="text-2xl font-black mb-4 text-dark">Vérification de profil</h3>
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl text-amber-800">
          <p className="font-bold text-lg">Pièce d'identité en cours d'analyse</p>
          <p className="mt-2 text-[15px] text-amber-700/90 font-medium">Ceci peut prendre jusqu'à 48 heures. Dès validation, vous obtiendrez le badge 'Vérifié'.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentUrl) return;
    verifyId({ documentUrl });
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4D80C4]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-10 h-10 rounded-full bg-light-300 text-dark flex items-center justify-center shrink-0">
          <IoShieldCheckmarkOutline className="text-xl" />
        </div>
        <h3 className="text-2xl font-black text-dark">Vérifier mon Profil</h3>
      </div>
      
      <p className="text-neutral-500 text-[15px] mb-8 font-medium leading-relaxed relative z-10">
        Obtenez le badge <span className="text-dark font-bold">« Passager Vérifié »</span> en soumettant une copie de votre carte d'identité ou passeport. Cela rassure la communauté.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 relative z-10">
        <div>
          <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Photo de pièce d'identité (URL test)</label>
          <input 
            type="text" 
            required
            className="w-full bg-light-300 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-dark font-bold transition-all text-base placeholder:text-neutral-400 placeholder:font-medium"
            placeholder="https://example.com/id.jpg"
            value={documentUrl}
            onChange={e => setDocumentUrl(e.target.value)}
          />
          <p className="text-[13px] text-neutral-400 font-medium mt-3">
            Vos données sont sécurisées et chiffrées selon la norme bancaire.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={isPending || !documentUrl}
          className="mt-6 w-full bg-dark text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-dark/20 hover:bg-primary hover:shadow-primary/30 h-14"
        >
          {isPending ? "Transmission..." : "Vérifier mon identité"}
        </button>
      </form>
    </div>
  );
}
