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
    <section className="relative min-h-screen pt-20 flex flex-col items-center gap-10 background-marbre text-gray-900">
      <h1 className="lg:text-4xl md:text-3xl text-2xl amethyst-text font-extrabold text-center uppercase px-5">
        Catalogue des cartes Pokémon
        <span className="title-underline"></span>
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-lg z-10">
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
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 z-10 lg:p-14 md:p-10 p-5 background-violet">
          {currentPokemons.map((pokemon) => {
            const [color1, color2, color3] = typeColors[pokemon.types?.[0]] || [
              "#CCCCCC",
              "#AAAAAA",
              "#888888",
            ];
            return (
              <li
                key={pokemon.id}
                className="background-card-violet relative lg:p-4 md:p-3 p-1 rounded-lg shadow-xl shadow-gray-500 text-center transform transition-transform hover:scale-105 hover:shadow-lg"
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
                        className="mx-auto mb-2 rounded-lg w-72"
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
      <div className="mb-6">
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredPokemons.length / itemsPerPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination flex flex-wrap justify-center items-center gap-2 mt-8"
          pageClassName="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
          activeClassName="bg-indigo-600 text-white font-bold"
          disabledClassName="opacity-50 cursor-not-allowed"
          previousClassName="px-3 py-2 rounded-md bg-white text-white hover:bg-violet-200"
          nextClassName="px-3 py-2 rounded-md bg-white text-white hover:bg-violet-200"
          breakClassName="px-3 py-2 text-gray-400"
        />
      </div>
    </section>
  );
}
