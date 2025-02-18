"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCard } from "@/context/cardContext";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import CreditCard from "@/utils/cardStripe";

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
    <section className="flex flex-wrap justify-center min-h-screen text-white py-24 px-5 gap-10">
      {/* 💳 Conteneur de paiement */}
      <div className="relative z-10 background-card-violet p-8 rounded-lg shadow-xl shadow-gray-500 max-w-md text-center h-[280px]">
        <h1 className="text-3xl font-extrabold amethyst-text-log mb-4">
          Paiement 🛒
        </h1>

        {/* 💰 Affichage du total */}
        <p className="text-xl text-green-400 font-bold">
          Total : {totalPrice.toFixed(2)} €
        </p>

        {/* 🛑 Message si le panier est vide */}
        {card.length === 0 && (
          <p className="text-red-400 mt-2">Votre panier est vide !</p>
        )}
        <div className="flex flex-col items-center gap-4 ">
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
            {loading ? (
              "⏳ Redirection..."
            ) : (
              <span className="flex items-center gap-2">
                <FaCreditCard className="text-white text-2xl" /> Payer avec
                Stripe
              </span>
            )}
          </button>

          {/* 🔙 Retour à la boutique */}
          <Link href="/catalogPokemon">
            <button className="mt-4 text-blue-400 underline hover:text-blue-300 transition">
              ← Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
      <div className=" flex flex-col gap-2   text-center md:text-left lg:text-left shadow-xl shadow-gray-500 rounded-md p-5 md:pt-5 lg:pt-5 pt-10 ">
        <h3 className="text-blue-950">Carte de test - Aucun débit réel</h3>
        <p className="text-gray-800 text-sm">
          Utilisez cette carte pour tester le paiement. Il ne s’agit pas d’une
          vraie transaction.
        </p>

        <CreditCard />

        {/* ℹ️ Informations supplémentaires */}
        <a
          href="https://docs.stripe.com/testing?locale=fr-FR"
          className="text-blue-800 underline hover:text-blue-700 text-lg transition mt-6"
        >
          Toutes les cartes bancaire fictive pour simuler un paiement stripe
        </a>
        <p className="text-blue-950 text-center lg:text-left md:text-left mt-4 max-w-4xl">
          Vous pouvez également régler votre achat via Apple Pay ou d'autres
          méthodes de paiement disponibles. Rassurez-vous, aucun montant ne sera
          réellement débité. De plus, l'icône "Test" en haut à droite de la page
          de paiement Stripe confirme qu'il s'agit d'un environnement de
          développement et non d'une transaction en production.
        </p>
      </div>
    </section>
  );
}
