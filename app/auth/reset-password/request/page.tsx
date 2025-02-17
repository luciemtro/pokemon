"use client";
import { useState } from "react";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Erreur reçue :", errorData);
        setIsSuccess(false);
        setMessage(`❌ Erreur : ${errorData}`);
        return;
      }

      const data = await res.json();
      setIsSuccess(true);
      setMessage(`✅ ${data.message}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
      setIsSuccess(false);
      setMessage("❌ Une erreur est survenue.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-10">
      {/* 📩 Conteneur du formulaire */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-6">
          📩 Mot de passe oublié ?
        </h1>
        <p className="text-gray-300 text-center mb-4">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>

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

        {/* 📜 Formulaire de demande de réinitialisation */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 📩 Champ Email */}
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🟢 Bouton Envoyer */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105"
          >
            📤 Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
