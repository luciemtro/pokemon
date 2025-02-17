"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setMessage("✅ Utilisateur créé avec succès !");
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        const data = await res.json();
        setIsSuccess(false);
        setMessage(data.message || "❌ Échec de l'inscription !");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("❌ Une erreur est survenue !");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-10">
      {/* 🔥 Background Cyberpunk */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/cyberpunk-bg.jpg')" }}
      ></div>

      {/* 📝 Conteneur du formulaire */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-blue-400 text-center mb-6">
          📝 Inscription
        </h2>

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

        {/* 📜 Formulaire d'inscription */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* 📩 Champ Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 🔑 Champ Mot de passe */}
          <div>
            <label className="block mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 🎭 Sélecteur de rôle */}
          <div>
            <label className="block mb-1">Rôle (optionnel)</label>
            <select
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {/* 🟢 Bouton S'inscrire */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105"
          >
            🚀 S'inscrire
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
