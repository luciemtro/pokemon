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
  const [showNotification, setShowNotification] = useState(false); // ✅ Notification state
  const [showAlreadyInCart, setShowAlreadyInCart] = useState(false); // 🔴 Pour "Déjà dans le panier"

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
      console.log("🛑 Cette carte est déjà dans le panier !");

      // ✅ Affiche la notification en rouge
      setShowAlreadyInCart(true);

      // ⏳ Cache la notification après 3 secondes
      setTimeout(() => {
        setShowAlreadyInCart(false);
      }, 3000);

      return; // ❌ Stop ici pour ne pas ajouter la carte
    }

    addToCard(pokemon);
    console.log("✅ Carte ajoutée :", pokemon);

    // ✅ Affiche la notification en vert
    setShowNotification(true);

    // ⏳ Cache la notification après 3 secondes
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <section className="relative flex flex-col md:flex-row gap-10 pt-28 pb-28 min-h-screen justify-center items-center bg-gray-900 text-white">
      {/* 🔥 Background Image Fullscreen */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/cyberpunk-bg.jpg')" }}
      ></div>

      {/* 🏆 Notifications */}
      {showNotification && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity animate-fade-in">
          ✅ Carte ajoutée au panier !
        </div>
      )}

      {showAlreadyInCart && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity animate-fade-in">
          🛑 Cette carte est déjà dans le panier !
        </div>
      )}

      {/* Image Pokémon avec effet Glow */}
      {pokemon && (
        <div className="relative flex flex-col items-center z-10">
          <Image
            src={pokemon.images.large}
            alt={pokemon.name}
            width={320}
            height={420}
            className="rounded-lg shadow-2xl border-4 border-blue-500 transition-transform transform hover:scale-105"
          />
          <span className="absolute top-2 left-2 bg-yellow-300 text-black px-3 py-1 rounded-lg font-bold">
            {pokemon.rarity}
          </span>
        </div>
      )}

      {/* 🏆 Informations Pokémon */}
      {pokemon && (
        <div className="max-w-lg bg-opacity-80 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-5 z-10">
          <h1 className="text-4xl font-extrabold text-blue-400">
            {pokemon.name}
          </h1>
          <p className="text-gray-300 text-lg">
            <strong>PV :</strong> {pokemon.hp}
          </p>

          {/* 🌟 Types */}
          <div className="flex gap-3">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm shadow-lg"
              >
                {type}
              </span>
            ))}
          </div>

          {/* ⚡ Attaques */}
          <div>
            <h3 className="text-xl font-semibold text-blue-300">Attaques :</h3>
            <ul className="list-disc list-inside text-gray-400">
              {pokemon.attacks.map((attack) => (
                <li key={attack.name} className="mt-2">
                  <span className="font-semibold text-white">
                    {attack.name}
                  </span>{" "}
                  - {attack.damage}
                </li>
              ))}
            </ul>
          </div>

          {/* 🔥 Faiblesses */}
          {pokemon.weaknesses && (
            <div>
              <h3 className="text-xl font-semibold text-red-400">
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

          {/* 💰 Prix & Achat */}
          <div className="flex flex-col gap-2">
            {pokemon.tcgplayer?.prices?.holofoil?.market && (
              <p className="text-xl font-semibold text-green-400">
                💰 Prix : {pokemon.tcgplayer.prices.holofoil.market.toFixed(2)}{" "}
                €
              </p>
            )}
            {pokemon.tcgplayer?.url && (
              <a
                href={pokemon.tcgplayer.url}
                target="_blank"
                className="text-blue-400 underline"
              >
                Voir sur TCGPlayer
              </a>
            )}
          </div>

          {/* ⚡ Bouton Ajouter au panier stylisé */}
          <button
            onClick={handleAddToCard}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/50 transform hover:scale-105"
          >
            🛒 Ajouter au panier
          </button>
        </div>
      )}
    </section>
  );
}
