"use client";
import { useCard } from "@/context/cardContext";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { FaSackDollar } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";

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
    <section className="min-h-screen flex flex-col items-center justify-center  pt-24 pb-16">
      <h1 className="text-3xl font-extrabold amethyst-text uppercase">
        🛒 Votre Panier
        <span className="title-underline"></span>
      </h1>
      <div className=" w-full  flex justify-center items-center">
        {card.length === 0 ? (
          <p className="text-lg text-gray-300">Le panier est vide.</p>
        ) : (
          <div className=" w-3/4 bg-white p-6 rounded-lg shadow-xl shadow-gray-500">
            <ul className="flex flex-wrap gap-6">
              {card.map((pokemon) => (
                <li
                  key={pokemon.id}
                  className="flex items-center gap-4 p-4 w-1/3 background-card-violet rounded-lg shadow-xl shadow-gray-500"
                >
                  {/* Image Pokémon */}
                  <Image
                    src={pokemon.images.small}
                    alt={pokemon.name}
                    width={110}
                    height={130}
                    className="rounded-lg shadow-md"
                  />

                  {/* Infos Pokémon */}
                  <div className="flex-1 relative min-h-44">
                    <p className="text-xl font-bold text-white">
                      {pokemon.name}
                    </p>
                    <p className="text-fuchsia-600 font-semibold">
                      {pokemon.rarity}
                    </p>
                    <p className=" font-semibold text-yellow-200 flex gap-2 items-center">
                      <FaSackDollar className="text-yellow-200 text-xl" />{" "}
                      {pokemon.price?.toFixed(2) || 0} €
                    </p>

                    {/* Gestion quantité */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(pokemon.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-700 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white text-black rounded-lg">
                        {pokemon.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(pokemon.id)}
                        className="bg-green-400 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCard(pokemon.id)}
                      className="bg-white text-black px-3 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition absolute bottom-1 right-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total & Boutons */}
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-violet-950">
                Total : {totalPrice.toFixed(2)} €
              </p>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={clearCard}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-md"
                >
                  🗑️ Vider le panier
                </button>
                <Link href="/payment">
                  <button className="bg-blue-500 flex item-center gap-2 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-500/50">
                    <FaCreditCard className="white text-2xl" />
                    Passer au paiement
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
