"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { PokemonCard } from "@/types/pokemon.types";

interface CardItem extends PokemonCard {
  quantity: number; // ✅ Ajout de la quantité
}

interface CardContextType {
  card: CardItem[];
  addToCard: (pokemon: PokemonCard) => void;
  removeFromCard: (id: string) => void;
  clearCard: () => void;
  increaseQuantity: (id: string) => void; // ✅ Augmenter la quantité
  decreaseQuantity: (id: string) => void; // ✅ Diminuer la quantité
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: React.ReactNode }) => {
  const [card, setCard] = useState<CardItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("card");
    if (storedCart) {
      try {
        setCard(JSON.parse(storedCart));
      } catch (error) {
        console.error("❌ Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("card", JSON.stringify(card));
    }
  }, [card, isMounted]);

  // ✅ Ajouter un produit ou augmenter sa quantité
  const addToCard = (pokemon: PokemonCard) => {
    setCard((prev) => {
      const existingItem = prev.find((item) => item.id === pokemon.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === pokemon.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...pokemon, quantity: 1 }];
    });
  };

  // ✅ Supprimer un produit complètement
  const removeFromCard = (id: string) => {
    setCard((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Vider le panier
  const clearCard = () => {
    setCard([]);
    localStorage.removeItem("card");
  };

  // ✅ Augmenter la quantité d'un produit
  const increaseQuantity = (id: string) => {
    setCard((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // ✅ Diminuer la quantité (et supprimer si 0)
  const decreaseQuantity = (id: string) => {
    setCard(
      (prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0) // Supprime si quantité = 0
    );
  };

  return (
    <CardContext.Provider
      value={{
        card,
        addToCard,
        removeFromCard,
        clearCard,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {isMounted ? children : null}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};
