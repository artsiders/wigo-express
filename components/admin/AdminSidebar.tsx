"use client";

import { Link, usePathname } from "@/i18n/routing";
import { 
  MdDashboard, 
  MdVerifiedUser, 
  MdDirectionsCar, 
  MdSettings, 
  MdLogout,
  MdMenuOpen
} from "react-icons/md";
import { signOut } from "next-auth/react";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: MdDashboard },
  { href: "/admin/kyc", label: "KYC Verifications", icon: MdVerifiedUser },
  { href: "/admin/drivers", label: "Driver Applications", icon: MdDirectionsCar },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <MdMenuOpen size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-dark-900">
          Wigo <span className="text-primary-500 text-primary-gradient">Admin</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-primary-50 text-primary-600 font-bold" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-dark-900"
              }`}
            >
              <Icon size={22} className={`${isActive ? "text-primary-600" : "text-neutral-400 group-hover:text-neutral-600"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group font-bold text-sm"
        >
          <MdLogout size={22} className="group-hover:text-red-500" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
};
