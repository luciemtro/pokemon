"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PokemonCard } from "@/types/pokemon.types";
import { useCard } from "@/context/cardContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { typeColors } from "@/utils/pokemonColors";
import { FaSackDollar } from "react-icons/fa6";

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
    <section className="relative flex flex-col md:flex-row gap-10 pt-20 pb-28 min-h-screen justify-center items-center  text-white">
      {/* 🏆 Notifications */}
      {showNotification && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl shadow-gray-500 transition-opacity animate-fade-in">
          ✅ Carte ajoutée au panier !
        </div>
      )}

      {showAlreadyInCart && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity animate-fade-in">
          🛑 Cette carte est déjà dans le panier !
        </div>
      )}

      {/* Image Pokémon avec effet Glow */}
      {pokemon && (
        <div className="relative flex flex-col items-center z-10">
          <div
            className="card"
            style={
              {
                "--color1": typeColors[pokemon.types?.[0]]?.[0] || "#CCCCCC",
                "--color2": typeColors[pokemon.types?.[0]]?.[1] || "#AAAAAA",
                "--color3": typeColors[pokemon.types?.[0]]?.[2] || "#888888",
              } as React.CSSProperties
            }
          >
            <Image
              src={pokemon.images.large}
              alt={pokemon.name}
              width={320}
              height={420}
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* 🏆 Informations Pokémon */}
      {pokemon && (
        <div className="w-80 bg-opacity-90 background-card-violet p-6 rounded-lg shadow-2xl shadow-gray-700 flex flex-col items-start text-left gap-5 z-10">
          {/* Badge de rareté stylisé */}
          <span className="text-fuchsia-500 font-semibold">
            {pokemon.rarity}
          </span>

          {/* 🌟 Types avec icônes */}
          {pokemon.types && (
            <div className="flex gap-3 items-center mt-2">
              {pokemon.types.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg"
                >
                  <span className={`pokemon-text ${type.toLowerCase()}`}>
                    {type}
                  </span>
                  <Image
                    src={`/images/icon-element-pokemon/${type.toLowerCase()}.png`}
                    alt={type}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 🌟 PV */}
          <p className="text-gray-300 text-lg">
            <strong>PV :</strong> {pokemon.hp}
          </p>

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
              <p className="text-xl font-semibold text-green-400 flex item-center gap-2">
                <FaSackDollar className="text-green-500 text-2xl" />
                Prix : {pokemon.tcgplayer.prices.holofoil.market.toFixed(2)} €
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
