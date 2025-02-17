"use client";
import { useCard } from "@/context/cardContext";
import Link from "next/link";

export default function CardPage() {
  const {
    card,
    removeFromCard,
    clearCard,
    increaseQuantity,
    decreaseQuantity,
  } = useCard();

  return (
    <section
      id="panier"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <h1>Votre Panier 🛒</h1>
      {card.length === 0 ? (
        <p>Le panier est vide.</p>
      ) : (
        <ul>
          {card.map((pokemon) => (
            <li key={pokemon.id}>
              <img src={pokemon.images.small} alt={pokemon.name} />
              <p>
                {pokemon.name} - {pokemon.rarity}
              </p>
              <p>Quantité : {pokemon.quantity}</p>
              <button onClick={() => decreaseQuantity(pokemon.id)}>-</button>
              <button onClick={() => increaseQuantity(pokemon.id)}>+</button>
              <button onClick={() => removeFromCard(pokemon.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      {card.length > 0 && (
        <>
          <button onClick={clearCard}>Vider le panier</button>
          <Link href="/payment">
            <button>Passer au paiement</button>
          </Link>
        </>
      )}
    </section>
  );
}
