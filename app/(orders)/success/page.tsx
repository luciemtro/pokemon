"use client";
import { useEffect } from "react";
import { useCard } from "@/context/cardContext";
import Link from "next/link";

export default function Success() {
  const { clearCard } = useCard();

  useEffect(() => {
    clearCard();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-white p-10">
      {/* ✅ Conteneur de succès */}
      <div className="relative z-10 background-card-violet p-8 rounded-lg shadow-xl shadow-gray-500 max-w-md text-center">
        {/* ✅ Icône d'approbation */}
        <div className="text-green-400 text-6xl mb-4 animate-pulse">✅</div>

        <h1 className="text-3xl font-extrabold text-green-400 mb-4">
          Paiement Réussi !
        </h1>
        <p className="text-lg text-gray-300">
          Merci pour votre achat. 🎉 Un email de confirmation vous a été envoyé.
        </p>

        {/* 🔙 Retour à la boutique */}
        <Link href="/catalogPokemon">
          <button className="mt-6 px-6 py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105">
            ← Retour à la boutique
          </button>
        </Link>
      </div>
    </section>
  );
}
