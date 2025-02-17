"use client";
import { useCard } from "@/context/cardContext";
import Link from "next/link";
import Image from "next/image";

export default function CardPage() {
  const {
    card,
    removeFromCard,
    clearCard,
    increaseQuantity,
    decreaseQuantity,
  } = useCard();

  // Calcul du total du panier
  const totalPrice = card.reduce((total, pokemon) => {
    return total + (pokemon.price || 0) * pokemon.quantity;
  }, 0);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-6">
        🛒 Votre Panier
      </h1>

      {card.length === 0 ? (
        <p className="text-lg text-gray-300">Le panier est vide.</p>
      ) : (
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {card.map((pokemon) => (
              <li
                key={pokemon.id}
                className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg"
              >
                {/* Image Pokémon */}
                <Image
                  src={pokemon.images.small}
                  alt={pokemon.name}
                  width={80}
                  height={100}
                  className="rounded-lg shadow-md"
                />

                {/* Infos Pokémon */}
                <div className="flex-1">
                  <p className="text-xl font-bold">{pokemon.name}</p>
                  <p className="text-gray-400">{pokemon.rarity}</p>
                  <p className="text-green-400 font-semibold">
                    💰 {pokemon.price?.toFixed(2) || 0} €
                  </p>

                  {/* Gestion quantité */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(pokemon.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-700 rounded-lg">
                      {pokemon.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(pokemon.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={() => removeFromCard(pokemon.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
                >
                  ❌ Supprimer
                </button>
              </li>
            ))}
          </ul>

          {/* Total & Boutons */}
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-green-400">
              💳 Total : {totalPrice.toFixed(2)} €
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={clearCard}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-md"
              >
                🗑️ Vider le panier
              </button>
              <Link href="/payment">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-500/50">
                  💳 Passer au paiement
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
