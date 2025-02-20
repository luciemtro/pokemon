"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaKey, FaRedo } from "react-icons/fa";
import { useSession } from "next-auth/react";

// On garde le rendu dynamique si nécessaire
export const dynamic = "force-dynamic";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirige vers la page d'accueil
    }
  }, [session, router]);

  // ✅ Déplacement de `useSearchParams()` en haut du composant
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // On récupère le token ici

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Token invalide ou expiré.");
      return;
    }

    const res = await fetch("/api/auth/reset-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok && data.email) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/auth/login?email=${encodeURIComponent(data.email)}`);
      }, 3000);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen  text-white p-10">
      {/* 🔑 Conteneur du formulaire */}
      <div className="relative z-10 background-card-violet p-8 rounded-lg shadow-xl shadow-gray-500 max-w-md w-full">
        <h1 className="text-2xl font-extrabold amethyst-text-log text-center mb-6 flex gap-2 items-center">
          <FaKey className="text-purple-200 text-5xl" />
          <span className="amethyst-text-log">
            {" "}
            Réinitialiser le mot de passe
          </span>
        </h1>

        {/* 🔴 Message d'erreur ou de succès */}
        {message && (
          <p
            className={`p-2 rounded text-center mb-4 ${
              isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {message}
          </p>
        )}

        {/* 📜 Formulaire de réinitialisation */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 🔒 Champ Nouveau Mot de Passe */}
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            className="w-full px-4 py-2 bg-white  text-black border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {/* 🟢 Bouton Réinitialiser */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105 flex items-center gap-2"
          >
            <FaRedo /> Réinitialiser
          </button>
        </form>
      </div>
    </section>
  );
}
