"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PokemonCard } from "@/app/types/pokemon.types";
import Link from "next/link";

export default function PokemonPage() {
  const { id } = useParams();
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemon) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="">
      <Link href="/catalogPokemon">
        <button className="">Retour</button>
      </Link>

      <div className="">
        <div className="">
          <div className="">
            <h1>{pokemon.name}</h1>
            <p>{pokemon.types?.join(", ")}</p>
          </div>

          <div className="">
            <h2>HP</h2>
            <p>{pokemon.hp}</p>
          </div>

          <div className="">
            <h2>Faiblesses</h2>
            <p>
              {pokemon.weaknesses
                ? pokemon.weaknesses
                    .map((w) => `${w.type} (${w.value})`)
                    .join(", ")
                : "Aucune"}
            </p>
          </div>

          <div className="">
            <h2>Attaques</h2>
            <ul>
              {pokemon.attacks.map((attack) => (
                <li key={attack.name}>
                  <strong>{attack.name}</strong> : {attack.damage} -{" "}
                  {attack.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="">
          <img src={currentImage || ""} alt={pokemon.name} className="" />
        </div>
      </div>

      <div className="">
        <Link href={pokemon.tcgplayer.url} target="_blank" className="">
          <button>Acheter la carte</button>
        </Link>

        <img
          src={pokemon.images.small}
          alt={`${pokemon.name} (mini)`}
          className=""
          onClick={() => handleImageClick(pokemon.images.large)}
        />
      </div>

      <div className="">
        <h2>Artiste</h2>
        <p>{pokemon.artist}</p>
      </div>

      <div className="">
        <h2>Rareté</h2>
        <p>{pokemon.rarity}</p>
      </div>
    </section>
  );
}
