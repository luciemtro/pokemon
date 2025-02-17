"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCard } from "@/context/cardContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const { card } = useCard();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      console.log("🔄 Envoi des données du panier à Stripe...");
      console.log("📦 Panier envoyé à Stripe :", card);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card }),
      });

      const data = await res.json();
      console.log("✅ Réponse Stripe :", data);

      if (!data.sessionId) {
        throw new Error("Erreur Stripe : sessionId manquant !");
      }

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("❌ Erreur de paiement :", error);
    }
  };

  return (
    <section className="p-10">
      <h1>Paiement 🛒</h1>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Redirection..." : "Payer avec Stripe"}
      </button>
    </section>
  );
}
