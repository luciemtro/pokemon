import { NextResponse } from "next/server";

// Fonction GET pour récupérer un Pokémon par ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Accéder au paramètre dynamique 'id' dans l'URL

  // Vérifier si l'ID est présent
  if (!id) {
    return NextResponse.json(
      { error: "ID de la carte requis" },
      { status: 400 }
    );
  }

  try {
    // Récupération de la clé API
    const apiKey = process.env.POKEMON_TCG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    // Appel à l'API pour récupérer les informations de la carte
    const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    // Vérification de la réponse de l'API
    if (!response.ok) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    // Extraction des données JSON de la réponse
    const data = await response.json();
    const card = data.data;

    // Extraction correcte du prix
    const price =
      card.tcgplayer?.prices?.holofoil?.market ??
      card.tcgplayer?.prices?.normal?.market ??
      1; // Prix par défaut à 1 si aucun prix n'est disponible

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
