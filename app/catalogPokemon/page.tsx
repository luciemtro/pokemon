"use client";
import { useEffect, useState } from "react";
import { PokemonCard } from "@/types/pokemon.types";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { pokemonTypes, typeColors } from "@/utils/pokemonColors";
import ReactPaginate from "react-paginate";

export default function CatalogPokemon() {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 16;

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

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedType, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesType = selectedType
      ? pokemon.types?.includes(selectedType)
      : true;
    const matchesName = searchTerm
      ? pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesType && matchesName;
  });

  const offset = currentPage * itemsPerPage;
  const currentPokemons = filteredPokemons.slice(offset, offset + itemsPerPage);
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <section className="relative min-h-screen pt-20 flex flex-col items-center gap-10 bg-white text-gray-900">
      <h1 className="text-4xl amethyst-text font-extrabold text-center uppercase">
        Catalogue des cartes Pokémon
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-center p-4 rounded-lg shadow-lg z-10">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-purple-500 rounded px-4 py-2 w-64 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <select
          id="typeSelect"
          className="border border-purple-500 rounded px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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

      {filteredPokemons.length === 0 ? (
        <p className="text-gray-500">Aucun Pokémon trouvé.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10 p-14 card-list">
          {currentPokemons.map((pokemon) => {
            const [color1, color2, color3] = typeColors[pokemon.types?.[0]] || [
              "#CCCCCC",
              "#AAAAAA",
              "#888888",
            ];
            return (
              <li
                key={pokemon.id}
                className="relative p-4 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105 hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(180deg, #1d083c, #4e0085, #1d083c)",
                }}
              >
                {pokemon.images?.small && (
                  <Link href={`/catalogPokemon/${pokemon.id}`}>
                    <div
                      className="card"
                      style={
                        {
                          "--color1": color1,
                          "--color2": color2,
                          "--color3": color3,
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={pokemon.images.small}
                        alt={pokemon.name}
                        className="mx-auto mb-2 rounded-lg w-72 "
                      />
                    </div>
                  </Link>
                )}
                {pokemon.types && (
                  <div className="flex gap-3 mt-4 justify-center">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`pokemon-text ${type.toLowerCase()}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                {pokemon.tcgplayer?.prices?.holofoil?.market ? (
                  <p className="text-white font-semibold">
                    💰 {pokemon.tcgplayer.prices.holofoil.market.toFixed(2)} €
                  </p>
                ) : (
                  <p className="text-gray-300">💰 Prix non disponible</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <ReactPaginate
        previousLabel={"← Précédent"}
        nextLabel={"Suivant →"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredPokemons.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
      />
    </section>
  );
}
