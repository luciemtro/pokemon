"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PokemonCard } from "@/app/types/pokemon.types";

export const dynamic = "force-dynamic";

export default function SummaryPage() {
  return (
    <Suspense fallback={<div>Chargement du récapitulatif...</div>}>
      <SummaryContent />
    </Suspense>
  );
}

function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCards, setSelectedCards] = useState<PokemonCard[]>([]);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      setEmail(params.email || "");

      if (params.selectedCards) {
        const parsedCards = JSON.parse(params.selectedCards);
        setSelectedCards(parsedCards);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }, [searchParams]);

  const handlePayment = () => {
    try {
      const queryParams = new URLSearchParams({
        email,
        selectedCards: JSON.stringify(selectedCards),
      }).toString();

      // 🔥 Redirection vers la page de paiement
      router.push(`/reservation/payment?${queryParams}`);
    } catch (error) {
      console.error("Erreur lors de la redirection vers le paiement :", error);
    }
  };

  return (
    <div className="">
      <h1 className="">📝 Récapitulatif de la réservation</h1>

      <div className="">
        <p className="">Email :</p>
        <p>{email}</p>
      </div>

      <h2 className="">📌 Cartes sélectionnées :</h2>
      {selectedCards.length === 0 ? (
        <p>Aucune carte sélectionnée.</p>
      ) : (
        <ul className="">
          {selectedCards.map((card) => (
            <li key={card.id} className="">
              <img src={card.images.large} alt={card.name} className="" />
              <p className="">{card.name}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handlePayment} className="">
        🔥 Passer au paiement
      </button>
    </div>
  );
}
