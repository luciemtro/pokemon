"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  FaLock,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaRedo,
} from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const router = useRouter();
  // 🔒 Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (session) {
      router.push("/"); // Redirige vers la page d'accueil
    }
  }, [session, router]);

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
    <section className="flex items-center justify-center min-h-screen text-white p-6">
      {/* 🛡️ Conteneur du formulaire */}
      <div className="relative z-10 background-card-violet p-8 rounded-lg shadow-xl shadow-gray-500 max-w-md w-full">
        <h1 className="text-3xl font-extrabold  text-center mb-6 flex items-center justify-center gap-2">
          <FaLock className="text-purple-200" />{" "}
          <span className="amethyst-text-log">Connexion</span>
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
          <div className="flex items-center bg-white border border-gray-600 rounded px-4 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="w-full bg-white text-black focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 🔑 Champ Mot de passe */}
          <div className="flex items-center bg-white border border-gray-600 rounded px-4 py-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              className="w-full bg-transparent text-black focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🟢 Bouton Connexion */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/50 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaSignInAlt /> Se connecter
          </button>
        </form>

        {/* 🔗 Liens vers inscription & reset password */}
        <div className="flex flex-col gap-2 text-center mt-6">
          <Link
            href="/auth/register"
            className="text-blue-400 hover:text-blue-300 transition flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Créer un Compte
          </Link>
          <Link
            href="/auth/reset-password/request"
            className="text-yellow-400 hover:text-yellow-300 transition flex items-center justify-center gap-2"
          >
            <FaRedo /> Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
