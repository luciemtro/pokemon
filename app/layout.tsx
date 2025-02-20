import { CardProvider } from "@/context/cardContext";
import type { Metadata } from "next";
import "@/styles/globals.scss";
import "@/styles/typography.scss";
import "@/styles/animations.scss";
import "@/styles/buttons.scss";
import SessionProviderClient from "@/SessionProviderClient";
import Navbar from "@/navbar/navbar";
import Footer from "@/footer/page";
import Home from "@/page"; // 🔥 Importe Home comme page par défaut

export const metadata: Metadata = {
  title: "Pokémon Store",
  description: "Pokémon Store, la boutique en ligne de cartes Pokémon.",
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode; // 🔹 Rend `children` optionnel
}) {
  return (
    <html lang="fr">
      <body>
        {/* Pour la session utilisateur */}
        <SessionProviderClient>
          <CardProvider>
            <Navbar />
            {children || <Home />}
            <Footer />
          </CardProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}
