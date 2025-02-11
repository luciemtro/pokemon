"use client";
import { useEffect } from "react";
import { useCard } from "@/app/context/cardContext";

export default function Success() {
  const { clearCard } = useCard();

  useEffect(() => {
    clearCard();
  }, []);

  return (
    <div className="">
      <h1 className="">Paiement réussi !</h1>
      <p>Merci pour votre achat. Un email de confirmation vous a été envoyé.</p>
    </div>
  );
}
