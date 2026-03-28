import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
  ) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-light-300 text-dark-900 flex transition-colors duration-300 font-sans">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1 pt-32 px-8 py-10">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-forwards">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
