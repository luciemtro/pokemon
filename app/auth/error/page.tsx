"use client";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-10">
      {/* 🔥 Background Cyberpunk */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/cyberpunk-bg.jpg')" }}
      ></div>

      {/* ❌ Conteneur de l'erreur */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        {/* ⚠️ Icône d'avertissement */}
        <div className="text-red-500 text-6xl mb-4 animate-pulse">⚠️</div>

        <p className="text-5xl font-extrabold text-red-400 mb-4">OUPS !</p>
        <h1 className="text-2xl font-bold mb-2">Erreur d'authentification</h1>
        <p className="text-gray-300 mb-6">
          Veuillez réessayer ou contacter l'administrateur.
        </p>

        {/* 🔄 Bouton Retour à la Connexion */}
        <Link href="/auth/login">
          <button className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-700 transition shadow-md shadow-red-500/50 transform hover:scale-105">
            🔄 Retour à la connexion
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
