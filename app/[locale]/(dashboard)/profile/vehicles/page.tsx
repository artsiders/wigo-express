"use client";

import { useProfile } from "@/hooks/useProfile";
import { useAddVehicle, useDeleteVehicle, CreateVehiclePayload } from "@/hooks/useVehicles";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/routing";
import {
  IoArrowBack,
  IoCarOutline,
  IoAddOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";
import { useState } from "react";

export default function VehiclesPage() {
  const { data: profile, isLoading } = useProfile();
  const addVehicle = useAddVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [form, setForm] = useState<CreateVehiclePayload>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    seatsCapacity: 4,
    features: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle.mutate(form, {
      onSuccess: () => {
        setShowAddForm(false);
        setForm({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          licensePlate: "",
          color: "",
          seatsCapacity: 4,
          features: []
        });
      }
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => {
      if (prev.features.includes(feature)) {
        return { ...prev, features: prev.features.filter(f => f !== feature) };
      }
      return { ...prev, features: [...prev.features, feature] };
    });
  };

  const AVAILABLE_FEATURES = [
    "Climatisation", "Bluetooth", "Sièges en cuir", "Wi-Fi", "Toit ouvrant", "Silencieux"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si pas connecté ou pas Driver
  if (!profile || !profile.isDriver) {
    if (typeof window !== "undefined") window.location.href = "/profile";
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mon Profil", href: "/profile" }, { label: "Mes Véhicules" }]} />
      
      <SectionHeader 
        title="Mes Véhicules" 
        description="Gérez les véhicules que vous utilisez pour vos trajets."
        action={
          !showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-dark text-white font-bold rounded-full hover:bg-primary transition-colors flex items-center gap-2 shadow-xl shadow-dark/10"
            >
              <IoAddOutline size={20} />
              Ajouter un véhicule
            </button>
          )
        }
      />

        {showAddForm ? (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-zinc-200 animate-fade-in relative">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <IoCarOutline className="text-primary" size={24} />
              Nouveau Véhicule
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Marque *</label>
                  <input required placeholder="ex: Toyota" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={form.make} onChange={e => setForm({...form, make: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Modèle *</label>
                  <input required placeholder="ex: Prius" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Année *</label>
                  <input required type="number" min="1900" max={new Date().getFullYear() + 1} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Couleur</label>
                  <input placeholder="ex: Rouge" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Immatriculation *</label>
                  <input required placeholder="ex: AB-123-CD" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none uppercase" value={form.licensePlate} onChange={e => setForm({...form, licensePlate: e.target.value.toUpperCase()})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Places passagers disponibles *</label>
                <select className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={form.seatsCapacity} onChange={e => setForm({...form, seatsCapacity: parseInt(e.target.value)})}>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num} place{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-700">Équipements</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_FEATURES.map(feat => {
                    const isSelected = form.features.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => handleFeatureToggle(feat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300"}`}
                      >
                        {isSelected && <IoCheckmarkCircleOutline />}
                        {feat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {addVehicle.error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                  {addVehicle.error instanceof Error ? "Erreur : ce véhicule existe peut-être déjà." : "Erreur inattendue."}
                </div>
              )}

              <div className="pt-4 flex gap-4 border-t border-zinc-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-4 flex-1 font-bold text-zinc-500 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={addVehicle.isPending}
                  className="px-6 py-4 flex-1 font-bold text-white bg-primary rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {addVehicle.isPending ? "Enregistrement..." : "Enregistrer le véhicule"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             {(!profile.vehicles || profile.vehicles.length === 0) ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                  <div className="w-20 h-20 bg-zinc-50 mx-auto rounded-full flex items-center justify-center text-zinc-300 mb-4">
                    <IoCarOutline size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">Aucun véhicule</h3>
                  <p className="text-zinc-500 max-w-sm mx-auto">Vous n'avez pas encore renseigné de véhicule. Ajoutez-en un pour pouvoir publier des trajets !</p>
                </div>
             ) : (
               profile.vehicles.map(v => (
                 <div key={v.id} className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-zinc-200 shadow-[0_20px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-primary border border-blue-100">
                        <IoCarOutline size={32} />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black text-dark">{v.make} {v.model}</h3>
                       <p className="text-zinc-500 font-medium">Couleur : {v.color || "Non précisé"} • {v.year}</p>
                       <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg uppercase tracking-wider">{v.licensePlate}</span>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">{v.seatsCapacity} Places passagers</span>
                       </div>
                       {v.features.length > 0 && (
                         <div className="flex gap-2 mt-3 flex-wrap">
                           {v.features.map(f => (
                             <span key={f} className="text-xs font-medium text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">{f}</span>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>

                   <button 
                     onClick={() => {
                        if(confirm("Confirmez-vous la suppression de ce véhicule ?")) {
                          deleteVehicle.mutate(v.id);
                        }
                     }}
                     disabled={deleteVehicle.isPending}
                     className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                   >
                     <IoTrashOutline size={20} />
                   </button>
                 </div>
               ))
             )}
          </div>
        )}

    </div>
  );
}
