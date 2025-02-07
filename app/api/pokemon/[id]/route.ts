import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID de la carte requis" },
        { status: 400 }
      );
    }

    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante. Vérifiez votre .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      headers: {
        "X-Api-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Carte non trouvée" },
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
