"use client";
import Link from "next/link";

export default function Cancel() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-10">
      {/* ❌ Conteneur d'annulation */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        {/* ❌ Icône d'échec */}
        <div className="text-red-400 text-6xl mb-4 animate-pulse">❌</div>

        <h1 className="text-3xl font-extrabold text-red-400 mb-4">
          Paiement Annulé
        </h1>
        <p className="text-lg text-gray-300">
          Votre paiement a été annulé. Vous pouvez réessayer à tout moment.
        </p>

        {/* 🔄 Réessayer le paiement */}
        <Link href="/payment">
          <button className="mt-6 px-6 py-3 rounded-lg font-bold text-white bg-yellow-500 hover:bg-yellow-700 transition shadow-md shadow-yellow-500/50 transform hover:scale-105">
            🔄 Réessayer le paiement
          </button>
        </Link>

        {/* 🔙 Retour à la boutique */}
        <Link href="/catalogPokemon">
          <button className="mt-4 px-6 py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105">
            ← Retour à la boutique
          </button>
        </Link>
      </div>
    </section>
  );
}
