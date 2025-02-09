import { NextResponse } from "next/server";

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

    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    const data = await response.json();
    const card = data.data;

    // ✅ Extracting price properly
    const price =
      card.tcgplayer?.prices?.holofoil?.market ??
      card.tcgplayer?.prices?.normal?.market ??
      1; // Default to 1 if price is not available

    return NextResponse.json({
      card: {
        ...card,
        price, // ✅ Injecting price into the object
      },
    });
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
