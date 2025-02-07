"use client";
import { useState } from "react";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
        setMessage(`Erreur: ${errorData}`);
        return;
      }

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className="accountContainer pt-28">
      <div className="containerFormAccount p-8 pink-border ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-5"
        >
          <h1>Entrez votre mail pour récupérer votre mot de passe</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            className="w-full px-4 py-2"
          />
          <button type="submit">Envoyer</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}
