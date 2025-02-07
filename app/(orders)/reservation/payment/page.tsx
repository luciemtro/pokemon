"use client";

import { useEffect, useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

// Charger Stripe avec ta clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Chargement des informations de paiement...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

// Contenu de la page de paiement encapsulé dans Suspense
function PaymentContent() {
  const searchParams = useSearchParams();
  const [stripe, setStripe] = useState<any>(null);
  const formData = Object.fromEntries(searchParams.entries());

  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [totalFee, setTotalFee] = useState<number>(0);

  useEffect(() => {
    async function loadStripeInstance() {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    loadStripeInstance();
  }, []);

  useEffect(() => {
    try {
      if (formData.selectedCards) {
        const parsedCards = JSON.parse(formData.selectedCards);
        setSelectedCards(parsedCards);
      }
      setTotalFee(parseFloat(formData.totalFee) || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes :", error);
    }
  }, [formData]);

  const handlePayment = async () => {
    if (!stripe) return;

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email || "",
          totalFee: totalFee,
          selectedCards: selectedCards,
        }),
      });

      const { sessionId } = await res.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement :",
        error
      );
    }
  };

  return (
    <div className="">
      <h1 className="">💳 Paiement</h1>

      <p className="">
        Montant total à payer : <strong>{totalFee} €</strong>
      </p>

      <h2 className="">🃏 Cartes sélectionnées :</h2>
      {selectedCards.length === 0 ? (
        <p>Aucune carte sélectionnée.</p>
      ) : (
        <ul className="">
          {selectedCards.map((card) => (
            <li key={card.id} className="">
              <img src={card.image} alt={card.name} className="" />
              <p className="">{card.name}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handlePayment} className="">
        🔥 Procéder au paiement
      </button>
    </div>
  );
}
