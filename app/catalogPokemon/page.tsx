"use client";
import { useEffect, useState } from "react";
import { PokemonCard } from "@/types/pokemon.types";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner"; // 🔄 Import du composant de chargement

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
    return <LoadingSpinner />; // 🔄 Affichage du spinner pendant le chargement
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
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
    <section className="relative min-h-screen pt-20 flex flex-col items-center gap-10 bg-gray-900 text-white">
      <h2 className="text-4xl font-extrabold text-blue-400 uppercase text-center relative z-10">
        Catalogue des cartes Pokémon
        <span className="block w-20 h-1 bg-blue-500 mx-auto mt-2"></span>
      </h2>

      {/* 🎯 Barre de recherche et filtre */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-lg z-10">
        {/* 🔎 Champ de recherche */}
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-blue-500 rounded px-4 py-2 w-64 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* 📌 Sélecteur de type */}
        <select
          id="typeSelect"
          className="border border-blue-500 rounded px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

      {/* 🎴 Résultat des filtres */}
      {filteredPokemons.length === 0 ? (
        <p className="text-gray-400">Aucun Pokémon trouvé.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10">
          {filteredPokemons.map((pokemon) => (
            <li
              key={pokemon.id}
              className="relative bg-gray-800 p-4 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 hover:shadow-blue-500/50"
            >
              {/* 🌟 Image Pokémon */}
              {pokemon.images?.small && (
                <Link href={`/catalogPokemon/${pokemon.id}`}>
                  <img
                    src={pokemon.images.small}
                    alt={pokemon.name}
                    className="mx-auto mb-2 rounded-lg w-72 shadow-md border border-gray-700 hover:border-blue-500 transition"
                  />
                </Link>
              )}

              {/* 📌 Nom & Type */}
              <h2 className="font-bold text-white text-lg">{pokemon.name}</h2>
              <p className="text-gray-400">{pokemon.types?.join(", ")}</p>

              {/* 💰 Prix si disponible */}
              {pokemon.tcgplayer?.prices?.holofoil?.market ? (
                <p className="text-green-400 font-semibold">
                  💰 {pokemon.tcgplayer.prices.holofoil.market.toFixed(2)} €
                </p>
              ) : (
                <p className="text-gray-400">💰 Prix non disponible</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
