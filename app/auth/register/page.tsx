"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user"); // Optionnel: définir un rôle par défaut
  const [message, setMessage] = useState<string>("");
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
        setMessage("User created successfully!");
        router.push("auth/login"); // Redirection vers la page de login après inscription
      } else {
        const data = await res.json();
        setMessage(data.message || "Registration failed!");
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <section
      id="registration"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <h2 className="">Inscription</h2>

      {message && <p className="mb-4 text-center text-red-500">{message}</p>}

      <form onSubmit={handleRegister}>
        <div className=" ">
          <label className="">Email</label>
          <input
            type="email"
            className=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="">Mot de passe</label>
          <input
            type="password"
            className=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="">Role (optional)</label>
          <select
            className="w-full px-4 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="">
          <button type="submit" className="w-full ">
            S'inscrire
          </button>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;
