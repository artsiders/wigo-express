"use client";

import { useAdminKyc, useAdminDrivers } from "@/hooks/useAdmin";
import { 
  MdVerifiedUser, 
  MdDirectionsCar, 
  MdAccessTime, 
  MdCheckCircle,
  MdArrowForward
} from "react-icons/md";
import { Link } from "@/i18n/routing";

export default function AdminDashboard() {
  const { data: kycRequests, isLoading: kycLoading } = useAdminKyc();
  const { data: driverRequests, isLoading: driverLoading } = useAdminDrivers();

  const pendingKyc = kycRequests?.filter((r: any) => r.status === "PENDING")?.length || 0;
  const pendingDrivers = driverRequests?.filter((r: any) => !r.user.isDriver)?.length || 0;

  const stats = [
    {
      label: "KYC en attente",
      value: pendingKyc,
      icon: MdVerifiedUser,
      color: "bg-secondary-500", // Vert (Secondary in globals.css)
      link: "/admin/kyc",
    },
    {
      label: "Conducteurs à valider",
      value: pendingDrivers,
      icon: MdDirectionsCar,
      color: "bg-primary-500", // Bleu (Primary in globals.css)
      link: "/admin/drivers",
    },
    {
      label: "Vérifications totales",
      value: (kycRequests?.length || 0) + (driverRequests?.length || 0),
      icon: MdCheckCircle,
      color: "bg-dark-900",
      link: "#",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-dark-900 tracking-tight">
          Vue d'ensemble
        </h1>
        <p className="text-neutral-500 font-medium">
          Gérez les demandes de validation et gardez un œil sur la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon size={32} />
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 font-black text-xs uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="text-5xl font-black text-dark-900">
                {kycLoading || driverLoading ? (
                  <div className="h-10 w-20 bg-neutral-100 animate-pulse rounded-lg" />
                ) : (
                  stat.value
                )}
              </div>
            </div>
            
            <Link 
              href={stat.link}
              className="mt-8 flex items-center gap-2 text-primary-500 font-bold text-sm hover:gap-3 transition-all"
            >
              Voir tout <MdArrowForward />
            </Link>
          </div>
        ))}
      </div>

      {/* Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-dark-900">
            <MdAccessTime size={28} className="text-secondary-500" />
            Dernières demandes KYC
          </h3>
          <div className="space-y-6">
            {kycRequests?.slice(0, 5).map((request: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-light-300 transition-colors hover:bg-white border border-transparent hover:border-neutral-100 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                    {request.user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900">{request.user.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{request.type}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  request.status === "PENDING" ? "bg-amber-100 text-amber-600" : 
                  request.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-dark-900">
            <MdDirectionsCar size={28} className="text-primary-500" />
            Nouveaux conducteurs
          </h3>
          <div className="space-y-6">
            {driverRequests?.slice(0, 5).map((request: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-light-300 transition-colors hover:bg-white border border-transparent hover:border-neutral-100 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-xl flex items-center justify-center font-bold">
                    {request.user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900">{request.user.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{request.country}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  request.user.isDriver ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {request.user.isDriver ? "Validé" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
