export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// Récupérer une carte Pokémon par son ID depuis l'API Pokémon TCG
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID de la carte requis" },
        { status: 400 }
      );
    }

    // Vérifier si la clé API est bien définie
    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante. Vérifiez votre .env.local" },
        { status: 500 }
      );
    }

    // Requête vers l'API Pokémon TCG
    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      headers: {
        "X-Api-Key": apiKey,
      },
      cache: "no-store", // Empêcher la mise en cache des résultats
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur API: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ card: data.data });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la carte Pokémon :",
      error
    );
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
