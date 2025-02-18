"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("SignIn response:", res);

    if (res?.error) {
      setError("⚠️ Identifiants incorrects. Veuillez réessayer.");
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      console.log("User Role:", session?.user?.role);

      // Rediriger selon le rôle
      router.push("/");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* 🛡️ Conteneur du formulaire */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-6">
          🔐 Connexion
        </h1>

        {/* 🔴 Affichage des erreurs */}
        {error && (
          <p className="bg-red-500 text-white p-2 rounded text-center mb-4">
            {error}
          </p>
        )}

        {/* 📜 Formulaire de connexion */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* 📩 Champ Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 🔑 Champ Mot de passe */}
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🟢 Bouton Connexion */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105"
          >
            🚀 Se connecter
          </button>
        </form>

        {/* 🔗 Liens vers inscription & reset password */}
        <div className="flex flex-col gap-2 text-center mt-6">
          <Link
            href="/auth/register"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            ➕ Créer un Compte
          </Link>
          <Link
            href="/auth/reset-password/request"
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            🔄 Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
