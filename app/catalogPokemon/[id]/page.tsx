"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PokemonCard } from "@/app/types/pokemon.types";
import Link from "next/link";

export default function PokemonPage() {
  const { id } = useParams();
  const router = useRouter(); // Pour rediriger
  const [pokemon, setPokemon] = useState<PokemonCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    async function getPokemon() {
      try {
        const response = await fetch(`/api/pokemon/${id}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du Pokémon.");
        }

        const data = await response.json();
        setPokemon(data.card);
        setCurrentImage(data.card.images.large);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }

    if (id) {
      getPokemon();
    }
  }, [id]);

  const handleImageClick = (image: string) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentImage(image);
      setIsFading(false);
    }, 300);
  };

  const handleReservation = () => {
    if (!pokemon) return;

    // Construire l'URL avec les infos du Pokémon
    const queryParams = new URLSearchParams({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.images.large,
      rarity: pokemon.rarity || "Inconnue",
      price: pokemon.tcgplayer?.prices?.holofoil?.market?.toString() || "0", // Prix du marché si dispo
    }).toString();

    router.push(`/reservation?${queryParams}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemon) {
    return <div>Chargement...</div>;
  }

  return (
    <section>
      <Link href="/catalogPokemon">
        <button>Retour</button>
      </Link>

      <div>
        <div>
          <h1>{pokemon.name}</h1>
          <p>{pokemon.types?.join(", ")}</p>
        </div>

        <div>
          <h2>HP</h2>
          <p>{pokemon.hp}</p>
        </div>

        <div>
          <h2>Faiblesses</h2>
          <p>
            {pokemon.weaknesses
              ? pokemon.weaknesses
                  .map((w) => `${w.type} (${w.value})`)
                  .join(", ")
              : "Aucune"}
          </p>
        </div>

        <div>
          <h2>Attaques</h2>
          <ul>
            {pokemon.attacks.map((attack) => (
              <li key={attack.name}>
                <strong>{attack.name}</strong> : {attack.damage} - {attack.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <img src={currentImage || ""} alt={pokemon.name} />
      </div>

      <div>
        <button onClick={handleReservation}>Réserver cette carte</button>
        <img
          src={pokemon.images.small}
          alt={`${pokemon.name} (mini)`}
          onClick={() => handleImageClick(pokemon.images.large)}
        />
      </div>

      <div>
        <h2>Artiste</h2>
        <p>{pokemon.artist}</p>
      </div>

      <div>
        <h2>Rareté</h2>
        <p>{pokemon.rarity}</p>
      </div>
    </section>
  );
}
