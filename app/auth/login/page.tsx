// app/auth/login/page.tsx
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
    setError("");

    const res = await signIn("credentials", {
      redirect: false, // Désactiver la redirection automatique
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Récupérer la session après la connexion pour obtenir le rôle
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      // Debugging : Affiche le rôle dans la console
      console.log("User Role:", session?.user?.role);

      // Vérifier le rôle et rediriger vers le bon dashboard
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard"); // Rediriger vers le dashboard admin
      } else {
        router.push("/"); // Rediriger vers le dashboard utilisateur
      }
    }
  };

  return (
    <div className="pt-28 accountContainer">
      <div className="containerFormAccount p-8 pink-border w-full max-w-md">
        <h2 className="text-center uppercase pink-link ">Connexion</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-5 mb-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full px-4 py-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            className="w-full px-4 py-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
        <div className="flex flex-col gap-2 text-center ">
          <Link href="/auth/register">Créer un Compte</Link>
          <Link href="/auth/reset-password/request">Mot de passe oublié ?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
