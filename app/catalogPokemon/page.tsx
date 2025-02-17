"use client";
import { useEffect, useState } from "react";
import { PokemonCard } from "@/types/pokemon.types";
import Link from "next/link";

export default function CatalogPokemon() {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    async function getPokemons() {
      try {
        const response = await fetch("/api/pokemon");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des cartes Pokémon.");
        }

        const data = await response.json();
        setPokemons(data.pokemons);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false); // Arrêter le chargement après la requête
      }
    }

    getPokemons();
  }, []);

  if (loading) {
    return <div>Chargement des cartes...</div>; // Afficher tant que ça charge
  }

  if (error) {
    return <div>Erreur : {error}</div>; // Afficher l'erreur si besoin
  }

  return (
    <section className="min-h-screen">
      <h1>Catalogue des cartes Pokémon</h1>
      {pokemons.length === 0 ? (
        <p>Aucune carte trouvée.</p>
      ) : (
        <ul>
          {pokemons.map((pokemon) => (
            <li key={pokemon.id}>
              <Link href={`/catalogPokemon/${pokemon.id}`}>
                <button>Voir la carte</button>
              </Link>
              {pokemon.images?.small && (
                <img src={pokemon.images.small} alt={pokemon.name} />
              )}
              <h2>{pokemon.name}</h2>
              <p>{pokemon.types?.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
