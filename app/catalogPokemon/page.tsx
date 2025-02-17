"use client";
import { useEffect, useState } from "react";
import { PokemonCard } from "@/types/pokemon.types";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner"; // 👈 Import du composant

export default function CatalogPokemon() {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pokemonTypes = [
    "Colorless",
    "Darkness",
    "Dragon",
    "Fairy",
    "Fighting",
    "Fire",
    "Grass",
    "Lightning",
    "Metal",
    "Psychic",
    "Water",
  ];

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
        setLoading(false);
      }
    }

    getPokemons();
  }, []);

  if (loading) {
    return <LoadingSpinner />; // 👈 Utilisation du composant de chargement
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  // 🔎 Filtrage des Pokémon par type et nom
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesType = selectedType
      ? pokemon.types?.includes(selectedType)
      : true;
    const matchesName = searchTerm
      ? pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesType && matchesName;
  });

  return (
    <section className="min-h-screen pt-20 flex flex-col items-center gap-10">
      <h2 className="text-4xl font-extrabold text-blue-950 uppercase text-center">
        Catalogue des cartes Pokémon
        <span className="title-underline"></span>
      </h2>

      {/* Barre de recherche et filtre */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* 🔎 Champ de recherche */}
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-64"
        />

        {/* 📌 Sélecteur de type */}
        <select
          id="typeSelect"
          className="border rounded p-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Tous les types</option>
          {pokemonTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Résultat des filtres */}
      {filteredPokemons.length === 0 ? (
        <p>Aucun Pokémon trouvé.</p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-10">
          {filteredPokemons.map((pokemon) => (
            <li
              key={pokemon.id}
              className="border p-4 rounded shadow-md text-center"
            >
              {pokemon.images?.small && (
                <Link href={`/catalogPokemon/${pokemon.id}`}>
                  <img
                    src={pokemon.images.small}
                    alt={pokemon.name}
                    className="mt-2 w-45"
                  />
                </Link>
              )}
              <h2 className="font-bold">{pokemon.name}</h2>
              <p>{pokemon.types?.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
