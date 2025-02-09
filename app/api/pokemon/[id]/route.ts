import { NextResponse } from "next/server";

// Fonction GET pour récupérer un Pokémon par ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Extraire l'ID du paramètre dynamique

  // Vérifier si l'ID est présent
  if (!id) {
    return NextResponse.json(
      { error: "ID de la carte requis" },
      { status: 400 }
    );
  }

  try {
    // Vérification de la clé API
    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    // Requête pour récupérer les informations de la carte
    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    const data = await response.json();
    const card = data.data;

    // Extraction du prix
    const price =
      card.tcgplayer?.prices?.holofoil?.market ??
      card.tcgplayer?.prices?.normal?.market ??
      1; // Par défaut à 1 si le prix n'est pas disponible

    // Retourner les données de la carte avec le prix
    return NextResponse.json({
      card: {
        ...card,
        price, // Injection du prix dans l'objet
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
