"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { PokemonCard } from "@/app/types/pokemon.types";

interface CardContextType {
  card: PokemonCard[];
  addToCard: (pokemon: PokemonCard) => void;
  removeFromCard: (id: string) => void;
  clearCard: () => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: React.ReactNode }) => {
  const [card, setCard] = useState<PokemonCard[]>([]);
  const [isMounted, setIsMounted] = useState(false); // Fix hydration issue

  // ✅ Ensure the cart is retrieved properly
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

  const addToCard = (pokemon: PokemonCard) => {
    const price = pokemon.price ?? 1; // Ensure price exists
    setCard((prev) => {
      const updatedCart = [...prev, { ...pokemon, price }];
      localStorage.setItem("card", JSON.stringify(updatedCart)); // ✅ Save immediately
      return updatedCart;
    });
  };

  const removeFromCard = (id: string) => {
    setCard((prev) => {
      const updatedCart = prev.filter((pokemon) => pokemon.id !== id);
      localStorage.setItem("card", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCard = () => {
    setCard([]);
    localStorage.removeItem("card");
  };

  return (
    <CardContext.Provider
      value={{ card, addToCard, removeFromCard, clearCard }}
    >
      {isMounted ? children : null} {/* Prevent hydration errors */}
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
