"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { MdNotificationsNone } from "react-icons/md";
import { useAdminStore } from "@/store/useAdminStore";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const AdminHeader = () => {
  const { data: session } = useSession();
  const { breadcrumbs } = useAdminStore();

  return (
    <header className="fixed top-0 right-0 left-64 h-20 glass-panel flex items-center justify-between px-8 z-40">
      <div className="flex-1 flex items-center">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-neutral-500 hover:text-dark-900 hover:bg-neutral-100 rounded-xl transition-all">
          <MdNotificationsNone size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-neutral-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-dark-900 uppercase tracking-tight">
              {session?.user?.name || "Administrateur"}
            </span>
            <span className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">
              {session?.user?.role}
            </span>
          </div>
          <div className="relative w-11 h-11 ring-2 ring-primary-500/10 rounded-xl overflow-hidden shadow-lg shadow-primary-500/5 transition-transform">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                {session?.user?.name?.[0] || "A"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
