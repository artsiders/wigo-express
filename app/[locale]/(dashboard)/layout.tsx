import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <Navbar />
      
      {/* 
        Container Global du Dashboard:
        - padding-top élevé pour compenser la Navbar fixe.
      */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex-1 flex flex-col">
        {/* Contenu de la sous-page (Mon Profil, Mes Véhicules, etc.) */}
        <main className="w-full mx-auto animate-fade-in relative z-0">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
