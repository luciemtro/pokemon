import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { PokemonCard } from "@/app/types/pokemon.types";

// Récupérer une carte Pokémon par son ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID de la carte requis" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const [card] = await connection.query<PokemonCard[] & RowDataPacket[]>(
      `SELECT id, name, type, hp, rarity, image_url FROM pokemon_cards WHERE id = ?`,
      [id]
    );

    if (card.length === 0) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ card: card[0] });
  } catch (error) {
    console.error("Erreur récupération carte Pokémon :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
