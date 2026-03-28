"use client";

import { useAdminDrivers, useUpdateDriverStatus } from "@/hooks/useAdmin";
import Image from "next/image";
import {
  MdCheck,
  MdClose,
  MdLaunch,
  MdArrowBack,
  MdDirectionsCar,
} from "react-icons/md";
import { Link } from "@/i18n/routing";
import { useState } from "react";


export default function AdminDriversPage() {
  const { data: driverRequests, isLoading } = useAdminDrivers();
  const { mutate: updateStatus, isPending } = useUpdateDriverStatus();
  const [filter, setFilter] = useState<string>("ALL");

  const filteredRequests = driverRequests?.filter((req: any) =>
    filter === "ALL"
      ? true
      : filter === "PENDING"
        ? !req.user.isDriver
        : req.user.isDriver,
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm tracking-tight hover:gap-3 transition-all mb-4"
          >
            <MdArrowBack /> Retour au tableau de bord
          </Link>
          <h1 className="text-4xl font-black text-dark-900 tracking-tight flex items-center gap-4">
            Devenir Conducteur
            <span className="px-3 py-1 bg-secondary-50 text-secondary-600 text-xs font-black rounded-lg border border-secondary-100 uppercase tracking-widest">
              {driverRequests?.length || 0} total
            </span>
          </h1>
          <p className="text-neutral-500 font-medium">
            Examinez les permis de conduire pour valider les nouveaux
            conducteurs sur Wigo.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-sm">
          {["ALL", "PENDING", "APPROVED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                  : "text-neutral-400 hover:bg-neutral-50 hover:text-dark-900"
              }`}
            >
              {f === "ALL"
                ? "Tout"
                : f === "PENDING"
                  ? "En attente"
                  : "Validés"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-neutral-100 animate-pulse rounded-[32px]"
              />
            ))}
          </div>
        ) : filteredRequests?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-neutral-200 shadow-sm">
            <div className="p-6 bg-secondary-50 rounded-full mb-6">
              <MdDirectionsCar size={48} className="text-secondary-600" />
            </div>
            <h3 className="text-2xl font-black text-dark-900">
              Aucune demande trouvée
            </h3>
            <p className="text-neutral-500 font-medium mt-2">
              Aucun permis en attente de validation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
            {filteredRequests?.map((request: any) => (
              <div
                key={request.id}
                className="group relative bg-white rounded-[40px] border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500 overflow-hidden"
              >
                <div className="relative h-64 w-full bg-neutral-100 group-hover:h-72 transition-all duration-500">
                  <Image
                    src={request.documentUrl}
                    alt="Permis de conduire"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                    Permis: {request.number}
                  </div>
                  <a
                    href={request.documentUrl}
                    target="_blank"
                    className="absolute bottom-6 left-6 p-3 bg-white/90 backdrop-blur-md text-dark-900 rounded-2xl hover:scale-110 transition-transform shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-500"
                  >
                    <MdLaunch size={20} />
                  </a>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-primary-500/5 shadow-lg">
                      {request.user.image ? (
                        <Image
                          src={request.user.image}
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
                          {request.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-dark-900 tracking-tight leading-none mb-1">
                        {request.user.name}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {request.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col p-4 rounded-2xl bg-light-300 border border-transparent group-hover:border-neutral-100 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                        Pays
                      </span>
                      <span className="text-sm font-bold text-dark-900">
                        {request.country}
                      </span>
                    </div>
                    <div className="flex flex-col p-4 rounded-2xl bg-light-300 border border-transparent group-hover:border-neutral-100 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                        Expiration
                      </span>
                      <span
                        className={`text-sm font-bold ${new Date(request.expiryDate) < new Date() ? "text-red-500" : "text-dark-800"}`}
                      >
                        {new Date(request.expiryDate).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-light-300 border border-transparent group-hover:border-neutral-100 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Statut actuel
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        request.user.isDriver
                          ? "bg-secondary-100 text-secondary-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {request.user.isDriver ? "Validé" : "En attente"}
                    </span>
                  </div>

                  {!request.user.isDriver && (
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-100">
                      <button
                        onClick={() =>
                          updateStatus({ id: request.id, isApproved: false })
                        }
                        disabled={isPending}
                        className="btn-white text-red-500 hover:text-red-600 hover:bg-red-50 border-neutral-200"
                      >
                        <MdClose size={20} /> Rejeter
                      </button>
                      <button
                        onClick={() =>
                          updateStatus({ id: request.id, isApproved: true })
                        }
                        disabled={isPending}
                        className="btn-primary"
                      >
                        <MdCheck size={20} /> Approuver
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
