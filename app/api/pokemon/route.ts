//Pokemon route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.POKEMON_TCG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante. Vérifiez votre .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.pokemontcg.io/v2/cards", {
      headers: {
        "X-Api-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des cartes" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ pokemons: data.data });
  } catch (error) {
    console.error("Erreur API Pokémon :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des cartes" },
      { status: 500 }
    );
  }
}
