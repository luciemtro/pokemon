import Head from "next/head";
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
  title: "Pokémon",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode; // 🔹 Rend `children` optionnel
}) {
  return (
    <html lang="fr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
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
