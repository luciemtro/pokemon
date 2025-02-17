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
    setError(""); // Reset error message

    const res = await signIn("credentials", {
      redirect: false, // Désactiver la redirection automatique
      email,
      password,
    });

    console.log("SignIn response:", res); // Debugging: Log the full response

    if (res?.error) {
      setError(res.error); // Display error if login fails
    } else {
      // Optionally, fetch session directly (if needed)
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      console.log("User Role:", session?.user?.role); // Debugging: Check user role

      // Redirect based on user role
      if (session?.user?.role === "admin") {
        router.push("/");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="p-8 w-full max-w-md">
        <h2 className="text-center uppercase">Connexion</h2>
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
    </section>
  );
};

export default LoginPage;
