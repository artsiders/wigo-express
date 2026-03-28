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
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminDashboard() {
  const { data: kycRequests, isLoading: kycLoading } = useAdminKyc();
  const { data: driverRequests, isLoading: driverLoading } = useAdminDrivers();
  const { setBreadcrumbs } = useAdminStore();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard" }]);
  }, [setBreadcrumbs]);

  const pendingKyc = kycRequests?.filter((r: any) => r.status === "PENDING")?.length || 0;
  const pendingDrivers = driverRequests?.filter((r: any) => !r.user.isDriver)?.length || 0;

  const stats = [
    {
      label: "KYC en attente",
      value: pendingKyc,
      icon: MdVerifiedUser,
      color: "bg-secondary-500", 
      link: "/admin/kyc",
    },
    {
      label: "Conducteurs à valider",
      value: pendingDrivers,
      icon: MdDirectionsCar,
      color: "bg-primary-500",
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
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-dark-900 tracking-tight">
          Vue d'ensemble
        </h1>
        <p className="text-neutral-500 text-sm font-medium">
          Gérez les demandes de validation et gardez un œil sur la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-white p-6 rounded-xl border border-neutral-100 shadow-sm transition-all duration-200 hover:border-primary-100 hover:shadow-md"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <div className="space-y-0.5">
              <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="text-4xl font-black text-dark-900">
                {kycLoading || driverLoading ? (
                  <div className="h-9 w-16 bg-neutral-100 animate-pulse rounded-md" />
                ) : (
                  stat.value
                )}
              </div>
            </div>
            
            <Link 
              href={stat.link}
              className="mt-6 flex items-center gap-1.5 text-primary-500 font-bold text-xs hover:text-primary-600 transition-all uppercase tracking-widest"
            >
              Voir tout <MdArrowForward size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-dark-900">
            <MdAccessTime size={22} className="text-secondary-500" />
            Dernières demandes KYC
          </h3>
          <div className="space-y-3">
            {kycRequests?.slice(0, 5).map((request: any, i: number) => (
              <Link key={i} href={`/admin/kyc/${request.id}`} className="flex items-center justify-between p-3 rounded-lg bg-light-300 transition-all hover:bg-white border border-transparent hover:border-neutral-100 hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                    {request.user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900 text-sm">{request.user.name}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{request.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                  request.status === "PENDING" ? "bg-amber-50 text-amber-600" : 
                  request.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {request.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-dark-900">
            <MdDirectionsCar size={22} className="text-primary-500" />
            Nouveaux conducteurs
          </h3>
          <div className="space-y-3">
            {driverRequests?.slice(0, 5).map((request: any, i: number) => (
              <Link key={i} href={`/admin/drivers/${request.id}`} className="flex items-center justify-between p-3 rounded-lg bg-light-300 transition-all hover:bg-white border border-transparent hover:border-neutral-100 hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-secondary-50 text-secondary-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                    {request.user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-900 text-sm">{request.user.name}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{request.country}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                  request.user.isDriver ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {request.user.isDriver ? "Validé" : "Attente"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
