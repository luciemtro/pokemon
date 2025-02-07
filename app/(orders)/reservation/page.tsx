"use client";

import { useEffect, useState } from "react";
import { PokemonCard } from "@/app/types/pokemon.types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ReservationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  const userEmail = session?.user?.email || "";

  return session && session.user ? <ReservationForm email={userEmail} /> : null;
};

interface ReservationFormProps {
  email?: string;
}

const ReservationForm = ({ email = "" }: ReservationFormProps) => {
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<PokemonCard[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPokemonCards() {
      try {
        const response = await fetch("/api/pokemon");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des cartes Pokémon.");
        }
        const data = await response.json();
        setPokemonCards(data.pokemons as PokemonCard[]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPokemonCards();
  }, []);

  const handleCardSelection = (card: PokemonCard) => {
    setSelectedCards((prevSelected) =>
      prevSelected.some((c) => c.id === card.id)
        ? prevSelected.filter((c) => c.id !== card.id)
        : [...prevSelected, card]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construire les paramètres d'URL avec les cartes sélectionnées
    const queryParams = new URLSearchParams({
      email,
      selectedCards: JSON.stringify(
        selectedCards.map((card) => ({
          id: card.id,
          name: card.name,
          image: card.images.large,
        }))
      ),
    }).toString();

    // 🔥 Redirection vers reservation/summary/page.tsx avec les cartes sélectionnées
    router.push(`/reservation/summary?${queryParams}`);
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <h3 className="">Sélectionnez vos cartes Pokémon</h3>

      <div className="">
        {pokemonCards.map((card) => (
          <div
            key={card.id}
            className={`${
              selectedCards.some((c) => c.id === card.id)
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => handleCardSelection(card)}
          >
            <img src={card.images.small} alt={card.name} className="" />
            <p className="">{card.name}</p>
          </div>
        ))}
      </div>

      <h3 className="">Total cartes sélectionnées : {selectedCards.length}</h3>

      <div className="">
        <button type="submit" className="bg-blue-800">
          Réserver
        </button>
      </div>
    </form>
  );
};

export default ReservationPage;
