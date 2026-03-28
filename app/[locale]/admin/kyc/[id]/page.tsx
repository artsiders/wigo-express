"use client";

import { useAdminKycDetail, useUpdateKycStatus } from "@/hooks/useAdmin";
import Image from "next/image";
import { 
  MdCheck, 
  MdClose, 
  MdVerifiedUser,
  MdEmail,
  MdCalendarToday,
  MdInfo
} from "react-icons/md";
import { Link, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export default function KycDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { setBreadcrumbs } = useAdminStore();
  
  const { data: request, isLoading } = useAdminKycDetail(id);
  const { mutate: updateStatus, isPending } = useUpdateKycStatus();

  // Set breadcrumbs immediately and update when data arrives
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin" },
      { label: "KYC Valider", href: "/admin/kyc" },
      { label: request?.user?.name ? `Détails - ${request.user.name}` : "Chargement..." }
    ]);
  }, [setBreadcrumbs, request]);

  if (!isLoading && !request) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-neutral-200">
        <MdInfo size={48} className="text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold text-dark-900">Demande introuvable</h2>
        <Link href="/admin/kyc" className="mt-4 text-primary-600 font-bold hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const handleAction = (status: "APPROVED" | "REJECTED") => {
    updateStatus({ id, status }, {
      onSuccess: () => {
        router.push("/admin/kyc");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Info - Always visible (or skeleton) */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-neutral-100 rounded-md animate-pulse hidden data-[visible=true]:block" data-visible={isLoading} />
        {!isLoading && request && (
          <h2 className="text-xl font-black text-dark-900 uppercase tracking-tight">Vérification Identity</h2>
        )}
        
        {isLoading ? (
          <div className="h-6 w-24 bg-neutral-100 rounded-full animate-pulse" />
        ) : (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            request?.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" : 
            request?.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
          }`}>
            {request?.status}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            {isLoading ? (
               <div className="space-y-4">
                 <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
                 <div className="relative aspect-[4/3] w-full bg-neutral-50 rounded-lg animate-pulse" />
               </div>
            ) : (
              <>
                <h3 className="text-sm font-black text-dark-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MdVerifiedUser className="text-primary-500" />
                  Document : {request?.type}
                </h3>
                <div className="relative aspect-[4/3] w-full bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100">
                  <Image 
                    src={request?.documentUrl || ""} 
                    alt="KYC Document" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <a 
                    href={request?.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 underline"
                  >
                    Ouvrir en plein écran
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-4 w-24 bg-neutral-100 rounded" />
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-neutral-100 rounded" />
                    <div className="h-3 w-40 bg-neutral-100 rounded" />
                  </div>
                </div>
                <div className="space-y-4 py-6 border-y border-neutral-50">
                   <div className="h-8 w-full bg-neutral-50 rounded" />
                   <div className="h-12 w-full bg-neutral-50 rounded" />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-black text-dark-900 uppercase tracking-widest mb-6">Utilisateur</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-neutral-100 font-sans">
                    {request?.user.image ? (
                      <Image src={request.user.image} alt="User" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                        {request?.user.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900">{request?.user.name}</h4>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold mt-0.5">
                      <MdEmail /> {request?.user.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 py-6 border-y border-neutral-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Membre depuis</span>
                    <div className="flex items-center gap-2 text-dark-800 text-sm font-bold">
                      <MdCalendarToday size={14} className="text-neutral-300" />
                      {request?.user.createdAt && new Date(request.user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  {request?.user.bio && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Bio</span>
                      <p className="text-xs text-neutral-600 leading-relaxed italic">"{request.user.bio}"</p>
                    </div>
                  )}
                </div>

                {request?.status === "PENDING" ? (
                  <div className="grid grid-cols-1 gap-3 mt-8">
                    <button
                      onClick={() => handleAction("APPROVED")}
                      disabled={isPending}
                      className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      <MdCheck size={18} /> Approuver l'identité
                    </button>
                    <button
                      onClick={() => handleAction("REJECTED")}
                      disabled={isPending}
                      className="btn-white w-full py-4 rounded-xl flex items-center justify-center gap-2 text-red-600 border-red-100 hover:bg-red-50 active:scale-[0.98] transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      <MdClose size={18} /> Rejeter la demande
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Demande déjà traitée</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
