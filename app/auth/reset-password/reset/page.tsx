"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// On garde le rendu dynamique si nécessaire
export const dynamic = "force-dynamic";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fonction qui gère le formulaire et l'envoi de la requête
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const res = await fetch("/api/auth/reset-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok && data.email) {
      router.push(`/auth/login?email=${encodeURIComponent(data.email)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-11">
      <h1>Réinitialiser le mot de passe</h1>

      {/* Utilisation du Suspense pour encapsuler la partie qui utilise useSearchParams */}
      <Suspense fallback={<div>Chargement...</div>}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          required
        />
      </Suspense>

      <button type="submit">Réinitialiser</button>
      {message && <p>{message}</p>}
    </form>
  );
}
