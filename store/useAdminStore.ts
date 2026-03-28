import { create } from "zustand";
import { BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface AdminState {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  breadcrumbs: [{ label: "Dashboard", href: "/admin" }],
  setBreadcrumbs: (items) => set({ breadcrumbs: items }),
}));
