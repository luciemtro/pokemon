"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCard } from "@/context/cardContext";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const { card } = useCard();
  const [loading, setLoading] = useState(false);

  // Calcul du total
  const totalPrice = card.reduce((total, pokemon) => {
    return total + (pokemon.price || 0) * pokemon.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (card.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-10">
      {/* 🏆 Background avec un effet immersif */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/cyberpunk-bg.jpg')" }}
      ></div>

      {/* 💳 Conteneur de paiement */}
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-4">
          Paiement 🛒
        </h1>

        {/* 💰 Affichage du total */}
        <p className="text-xl text-green-400 font-bold">
          💳 Total : {totalPrice.toFixed(2)} €
        </p>

        {/* 🛑 Message si le panier est vide */}
        {card.length === 0 && (
          <p className="text-red-400 mt-2">Votre panier est vide !</p>
        )}
        <div className="flex flex-col items-center gap-4">
          {/* 🎉 Bouton de paiement */}
          <button
            onClick={handleCheckout}
            disabled={loading || card.length === 0}
            className={`mt-5 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-transform 
            ${
              loading || card.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 transform hover:scale-105 shadow-blue-500/50"
            }`}
          >
            {loading ? "⏳ Redirection..." : "💳 Payer avec Stripe"}
          </button>

          {/* 🔙 Retour à la boutique */}
          <Link href="/catalogPokemon">
            <button className="mt-4 text-blue-400 underline hover:text-blue-300 transition">
              ← Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
