"use client";

import { useAdminKyc } from "@/hooks/useAdmin";
import Image from "next/image";
import { MdInfo, MdArrowBack, MdCalendarToday } from "react-icons/md";
import { Link } from "@/i18n/routing";
import { useState } from "react";

export default function AdminKycPage() {
  const { data: kycRequests, isLoading } = useAdminKyc();
  const [filter, setFilter] = useState<string>("ALL");

  const filteredRequests = kycRequests?.filter((req: any) =>
    filter === "ALL" ? true : req.status === filter,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-widest hover:text-primary-700 transition-colors mb-2"
          >
            <MdArrowBack /> Dashboard
          </Link>
          <h1 className="text-3xl font-black text-dark-900 tracking-tight flex items-center gap-3">
            Validations KYC
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-md border border-neutral-200 uppercase tracking-widest">
              {kycRequests?.length || 0}
            </span>
          </h1>
          <p className="text-neutral-500 text-sm font-medium">
            Vérifiez l'identité des utilisateurs pour assurer la sécurité.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-neutral-300">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-50 hover:text-dark-900"
              }`}
            >
              {f === "ALL"
                ? "Tout"
                : f === "PENDING"
                  ? "Attente"
                  : f === "APPROVED"
                    ? "Ok"
                    : "Refus"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-neutral-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : filteredRequests?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <MdInfo size={32} className="text-neutral-300 mb-4" />
            <h3 className="text-lg font-bold text-dark-900">Aucune demande</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRequests?.map((request: any) => (
              <Link
                key={request.id}
                href={`/admin/kyc/${request.id}`}
                className="group flex flex-col bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-primary-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="relative h-40 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={request.documentUrl}
                    alt="Document KYC"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-semibold text-white tracking-widest border border-white/10">
                    {request.type}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-neutral-100">
                      {request.user.image ? (
                        <Image
                          src={request.user.image}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold">
                          {request.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-bold text-dark-900 truncate group-hover:text-primary-600 transition-colors">
                        {request.user.name}
                      </h3>
                      <p className="text-[10px] font-medium text-neutral-400 truncate">
                        {request.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto space-y-2 pt-2 border-t border-neutral-50">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                        <MdCalendarToday size={12} />{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded uppercase tracking-widest text-[9px] ${
                          request.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : request.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-red-50 text-red-600 border border-red-100"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
