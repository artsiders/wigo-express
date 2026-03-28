"use client";

import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useOfferStore } from "@/store/useOfferStore";
import { Link } from "@/i18n/routing";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useFormContext } from "react-hook-form";
import { OfferRideFormData } from "@/schemas/offer";
import axios from "axios";
import Alert from "@/components/ui/Alert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function StepSummary() {
  const { watch, getValues, reset } = useFormContext<OfferRideFormData>();
  const { departureCity, arrivalCity, date, time, seats, price } = watch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = getValues();
      await axios.post("/api/trips", data);
      setSuccess(true);
      reset(); // Clear form
      const { resetOffer } = useOfferStore.getState();
      resetOffer(); // Clear store if used
    } catch (err: any) {
      console.error("Publication Error:", err);
      setError(
        err.response?.data?.error ||
          "Une erreur est survenue lors de la publication.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-emerald-600/20 rounded-full blur-xl animate-pulse"></div>
          <IoCheckmarkCircle className="text-5xl text-emerald-600 relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-dark mb-4">Trajet Publié !</h2>
        <p className="text-neutral-500 font-medium mb-8">
          Votre trajet est maintenant en ligne. Les passagers peuvent commencer
          à réserver !
        </p>
        <Link
          href={"/my-trajets"}
          className="px-8 py-4 bg-dark text-white rounded-full font-bold hover:bg-primary transition-all"
        >
          Voir mes trajets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-3xl font-black text-dark mb-2">Résumé</h2>
        <p className="text-neutral-500 font-medium">
          Vérifiez les informations avant publication.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Erreur de publication"
          description={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="flex-1 flex flex-col gap-4">
        {/* Trip Preview */}
        <div className="bg-light-400 p-6 rounded-2xl border border-neutral-100 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10 font-bold text-dark">
            <div className="w-3 h-3 rounded-full border border-dark bg-white"></div>
            <div>{departureCity || "Lieu de départ"}</div>
          </div>
          <div className="ml-[5px] w-0.5 h-6 bg-neutral-200"></div>
          <div className="flex items-center gap-4 mt-4 relative z-10 font-bold text-dark">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div>{arrivalCity || "Lieu d'arrivée"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Départ prévu
            </span>
            <span className="font-bold text-dark">
              {date
                ? format(new Date(date), "EEEE d MMMM", { locale: fr })
                : "Non définie"}{" "}
              à <span className="text-primary">{time}</span>
            </span>
          </div>
          <div className="bg-white border border-neutral-100 p-5 rounded-2xl flex justify-between items-center group">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                Economie
              </span>
              <span className="font-bold text-dark">
                {seats} passager{seats > 1 ? "s" : ""}{" "}
                <span className="text-neutral-300 mx-1">/</span>{" "}
                <span className="text-primary">{price}$ CAD</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-light-400">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-dark transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex justify-center items-center disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <LuLoaderCircle size={22} className="animate-spin mr-2" />
              Publication...
            </>
          ) : (
            "Publier mon trajet"
          )}
        </button>
      </div>
    </div>
  );
}
