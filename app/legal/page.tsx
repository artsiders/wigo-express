import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Légal & CGU - SnapToAd",
  description: "Mentions légales et Conditions Générales d'Utilisation de SnapToAd.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f9f9f9]/80 backdrop-blur-md border-b border-black/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <ArrowLeft className="w-4 h-4 text-black" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-black">Retour</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Informations Légales</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6">
            Légal & CGU.
          </h1>
          <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Consultez les mentions légales et nos conditions générales d'utilisation. Dernière mise à jour le {new Date().toLocaleDateString('fr-FR')}.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-8 md:p-12 border border-black/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] space-y-12">
          
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
              01. Mentions Légales
            </h2>
            <div className="prose prose-neutral max-w-none text-black">
              <p className="font-medium">
                L'application <strong>SnapToAd</strong> est édité par la société <strong>Altplus</strong>.
              </p>
              <p className="text-neutral-600 mt-4 leading-relaxed">
                Directeur de la publication : Équipe Altplus.<br/>
                Hébergement : Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789.<br/>
                Pour toute question ou réclamation, vous pouvez nous contacter via le bouton de support disponible sur notre plateforme.
              </p>
            </div>
          </section>

          <div className="w-full h-px bg-neutral-100"></div>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
              02. Conditions Générales d'Utilisation
            </h2>
            <div className="prose prose-neutral max-w-none text-black space-y-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2">Acceptation des conditions</h3>
                <p className="text-neutral-600 leading-relaxed">
                  L'utilisation du service SnapToAd implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation. Celles-ci peuvent être modifiées ou complétées à tout moment, les utilisateurs sont donc invités à les consulter de manière régulière.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2">Description des services</h3>
                <p className="text-neutral-600 leading-relaxed">
                  SnapToAd fournit un outil propulsé par l'intelligence artificielle permettant de générer des vidéos promotionnelles à partir d'images statiques. Les résultats générés par l'IA peuvent varier et l'éditeur ne garantit pas la perfection absolue de chaque rendu.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2">Propriété intellectuelle</h3>
                <p className="text-neutral-600 leading-relaxed">
                  L'utilisateur garantit détenir l'ensemble des droits sur les images (photos, logos, illustrations) qu'il soumet à SnapToAd. Altplus décline toute responsabilité en cas de violation de droits d'auteur par un utilisateur.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight mb-2">Données personnelles</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion de votre compte (authentification Google/Email) et à l'historique de vos générations de vidéos. Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
