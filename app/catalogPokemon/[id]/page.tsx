"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PokemonCard } from "@/types/pokemon.types";
import { useCard } from "@/context/cardContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function PokemonPage() {
  const { id } = useParams();
  const { addToCard, card } = useCard();
  const [pokemon, setPokemon] = useState<PokemonCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getPokemon();
    }
  }, [id]);

  const handleAddToCard = () => {
    if (!pokemon) return;

    // Vérifie si la carte est déjà dans le panier
    const isAlreadyInCard = card.some((p) => p.id === pokemon.id);

    if (isAlreadyInCard) {
      console.log("⚠️ Cette carte est déjà dans le panier !");
      return;
    }

    addToCard(pokemon);
    console.log("✅ Carte ajoutée :", pokemon);
  };

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <section className="flex flex-col md:flex-row gap-10 p-10 min-h-screen w-full justify-center items-center bg-gray-100 pt-28">
      {/* Image du Pokémon */}
      {pokemon && (
        <div className="relative flex flex-col items-center">
          <Image
            src={pokemon.images.large}
            alt={pokemon.name}
            width={300}
            height={400}
            className="rounded-lg shadow-lg"
          />
          <span className="absolute top-2 left-2 bg-yellow-300 text-black px-3 py-1 rounded-lg font-bold">
            {pokemon.rarity}
          </span>
        </div>
      )}

      {/* Informations sur le Pokémon */}
      {pokemon && (
        <div className="min-w-72 bg-white p-6 rounded-lg shadow-lg flex flex-col gap-5">
          <h1 className="text-4xl font-extrabold text-blue-950">
            {pokemon.name}
            <span className="title-underline"></span>
          </h1>
          <p className="text-gray-600 text-lg">
            <strong>PV :</strong> {pokemon.hp}
          </p>

          {/* Types */}
          <div className="flex gap-3">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Attaques */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Attaques :</h3>
            <ul className="list-disc list-inside text-gray-600">
              {pokemon.attacks.map((attack) => (
                <li key={attack.name} className="mt-2">
                  <span className="font-semibold">{attack.name}</span> -{" "}
                  {attack.damage}
                </li>
              ))}
            </ul>
          </div>

          {/* Faiblesses */}
          {pokemon.weaknesses && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Faiblesses :
              </h3>
              <ul className="list-disc list-inside text-red-500">
                {pokemon.weaknesses.map((weakness) => (
                  <li key={weakness.type}>
                    {weakness.type} ({weakness.value})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prix & Achat */}
          <div className="flex flex-col gap-2">
            {pokemon.tcgplayer?.prices?.holofoil?.market && (
              <p className="text-xl font-semibold text-green-600">
                💰 Prix : {pokemon.tcgplayer.prices.holofoil.market.toFixed(2)}{" "}
                €
              </p>
            )}
            {pokemon.tcgplayer?.url && (
              <a
                href={pokemon.tcgplayer.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                Voir sur TCGPlayer
              </a>
            )}
          </div>

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCard}
            className="btn-slanted-violet !text-sm"
          >
            🛒 Ajouter au panier
          </button>
        </div>
      )}
    </section>
  );
}
