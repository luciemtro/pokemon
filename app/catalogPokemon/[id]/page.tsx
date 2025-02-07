"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PokemonCard } from "@/app/types/pokemon.types";
import { useCard } from "@/app/context/cardContext";

export default function PokemonPage() {
  const { id } = useParams();
  const { addToCard, card } = useCard(); // Panier context
  const [pokemon, setPokemon] = useState<PokemonCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getPokemon() {
      try {
        const response = await fetch(`/api/pokemon/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du Pokémon.");
        }
        const data = await response.json();
        setPokemon(data.card);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }

    if (id) {
      getPokemon();
    }
  }, [id]);

  const handleAddToCard = () => {
    if (!pokemon) return;

    // Vérifier si la carte est déjà dans le panier
    const isAlreadyInCard = card.some((p) => p.id === pokemon.id);

    if (isAlreadyInCard) {
      console.log("⚠️ Cette carte est déjà dans le panier !");
      return; // On empêche l'ajout du doublon
    }

    addToCard(pokemon);
    console.log("✅ Carte ajoutée :", pokemon);
  };

  // 🔥 Log à chaque mise à jour du panier
  useEffect(() => {
    console.log("🛒 Nouveau contenu du panier mis à jour :", card);
  }, [card]);

  if (error) return <div>{error}</div>;
  if (!pokemon) return <div>Chargement...</div>;

  return (
    <section>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.images.small} alt={pokemon.name} />
      <button onClick={handleAddToCard}>Ajouter au panier</button>
    </section>
  );
}
