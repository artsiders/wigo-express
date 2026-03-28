"use client";

import { useState } from "react";
import { useBecomeDriver, KycVerification, License } from "@/hooks/useProfile";
import { useSession } from "next-auth/react";

interface Props {
  kycVerifications: KycVerification[];
  license: License | null;
}

export function DriverRegistrationForm({ kycVerifications, license }: Props) {
  const { update } = useSession();
  const { mutate: becomeDriver, isPending } = useBecomeDriver();
  const [formData, setFormData] = useState({
    number: "",
    expiryDate: "",
    country: "France",
    documentUrl: "",
  });

  const kycStatus = kycVerifications.find((k) => k.type === "LICENSE")?.status;

  if (kycStatus === "PENDING") {
    return (
      <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col justify-center h-full">
        <h3 className="text-2xl font-black mb-4 text-dark">
          Devenir Conducteur·rice
        </h3>
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl text-amber-800">
          <p className="font-bold text-lg">Vérification en cours</p>
          <p className="mt-2 text-[15px] text-amber-700/90 font-medium">
            Votre permis de conduire est en cours d'examen par notre équipe.
            Nous vous tiendrons informé sous 24h.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    becomeDriver(formData, {
      onSuccess: () => {
        update({ isDriver: true });
      },
    });
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <h3 className="text-2xl font-black mb-2 text-dark">
        Devenir Conducteur·rice
      </h3>
      <p className="text-neutral-500 text-[15px] mb-8 font-medium leading-relaxed">
        Ajoutez les informations de votre permis de conduire pour pouvoir
        proposer vos propres trajets en toute sécurité.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <div>
          <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Numéro de permis
          </label>
          <input
            type="text"
            required
            className="w-full bg-light-300 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-dark font-bold transition-all text-base placeholder:text-neutral-400 placeholder:font-medium"
            placeholder="Ex: 123456789"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Expiration
            </label>
            <input
              type="date"
              required
              className="w-full bg-light-300 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-dark font-bold transition-all text-base"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Pays
            </label>
            <select
              className="w-full bg-light-300 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-dark font-bold transition-all appearance-none text-base bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjMjYyNjI2Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-position-[right_1.2rem_center] bg-size-[1.2rem]"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            >
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Canada">Canada</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Photo de permis (URL test)
          </label>
          <input
            type="text"
            className="w-full bg-light-300 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-dark font-bold transition-all text-base placeholder:text-neutral-400 placeholder:font-medium"
            placeholder="https://example.com/permis.jpg"
            value={formData.documentUrl}
            onChange={(e) =>
              setFormData({ ...formData, documentUrl: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full bg-dark text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 text-base shadow-xl shadow-dark/20 hover:bg-primary hover:shadow-primary/30 active:scale-[0.98] h-14"
        >
          {isPending ? "Transmission..." : "Soumettre la candidature"}
        </button>
      </form>
    </div>
  );
}
