"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  // 🔒 Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (session) {
      router.push("/"); // Redirige vers la page d'accueil
    }
  }, [session, router]);

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
        setMessage("Utilisateur créé avec succès !");
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        const data = await res.json();
        setIsSuccess(false);
        setMessage(data.message || "Échec de l'inscription !");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Une erreur est survenue !");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen text-white p-10">
      {/* 📜 Conteneur du formulaire */}
      <div className="relative z-10 background-card-violet p-8 rounded-lg shadow-xl shadow-gray-500 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center mb-6 flex items-center justify-center gap-2">
          <FaUserPlus className="text-purple-200" />{" "}
          <span className="amethyst-text-log">Inscription</span>
        </h1>

        {/* 🔴 Message d'erreur ou de succès */}
        {message && (
          <p
            className={`p-2 rounded text-center mb-4 flex items-center justify-center gap-2 ${
              isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isSuccess ? <FaCheck /> : <FaTimes />} {message}
          </p>
        )}

        {/* 📜 Formulaire d'inscription */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* 📩 Champ Email */}
          <div className="flex items-center bg-white border border-gray-600 rounded px-4 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              className="w-full bg-transparent text-black focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 🔑 Champ Mot de passe */}
          <div className="flex items-center bg-white border border-gray-600 rounded px-4 py-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              className="w-full bg-transparent text-black focus:outline-none"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 🎭 Sélecteur de rôle */}
          <div className="flex flex-col">
            <div className="flex items-center bg-white border border-gray-600 rounded px-4 py-2">
              <FaUserTag className="text-gray-400 mr-2" />
              <select
                className="w-full bg-transparent text-black focus:outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            {/* ℹ️ Explication des rôles */}
            <div className="mt-2 p-3 bg-gray-800 text-white rounded-md text-sm flex items-start gap-2">
              <FaInfoCircle className="text-yellow-400 mt-1" />
              <p>
                <strong>Utilisateur :</strong> Accès au tableau de bord "Mes
                commandes" pour voir ses propres commandes.
                <br />
                <strong>Administrateur :</strong> Accès au tableau de bord
                "Toutes les commandes" pour voir les commandes de tous les
                utilisateurs.
              </p>
            </div>
          </div>

          {/* 🟢 Bouton S'inscrire */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaUserPlus /> S'inscrire
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
