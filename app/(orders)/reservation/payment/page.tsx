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
  const [stripe, setStripe] = useState<any>(null);

  // Charger l'instance Stripe
  useEffect(() => {
    async function load() {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    load();
  }, []);

  const handlePayment = async (formData: any) => {
    if (!stripe) return;

    // Désérialiser les cartes Pokémon sélectionnées
    let selectedCards = [];
    try {
      selectedCards = formData.selectedCards
        ? JSON.parse(formData.selectedCards)
        : [];
    } catch (error) {
      console.error(
        "Erreur lors de la conversion des cartes sélectionnées :",
        error
      );
      return;
    }

    // Créer une session de paiement sur ton serveur
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalFee: formData.totalFee,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        postalCode: formData.postalCode || "",
        country: formData.country || "",
        selectedCards: selectedCards,
      }),
    });

    const { sessionId } = await res.json();

    // Rediriger l'utilisateur vers Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <Suspense fallback={<div>Chargement des informations de paiement...</div>}>
      <PaymentContent onPayment={handlePayment} />
    </Suspense>
  );
}

// Contenu de la page de paiement encapsulé dans Suspense
function PaymentContent({ onPayment }: { onPayment: (formData: any) => void }) {
  const searchParams = useSearchParams();
  const formData = Object.fromEntries(searchParams.entries());

  return (
    <div className="">
      <p className="">Montant total à payer: {formData.totalFee} €</p>
      <button onClick={() => onPayment(formData)}>Passer au paiement</button>
    </div>
  );
}
