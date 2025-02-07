export const dynamic = "force-dynamic";

import { getConnection } from "@/app/lib/db"; // Utilise le pool de connexions
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { Order } from "@/app/types/order.types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions"; // Import correct de authOptions

import { Session } from "next-auth"; // Import du type Session

// Fonction pour récupérer uniquement les commandes de l'utilisateur connecté
export async function GET() {
  let connection;
  try {
    // Récupérer la session de l'utilisateur connecté
    const session: Session | null = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Obtenir une connexion à la base de données
    connection = await getConnection();

    // Requête pour récupérer les commandes de l'utilisateur connecté avec les produits Pokémon associés
    const query = `
      SELECT 
        o.id, 
        o.first_name AS firstName, 
        o.last_name AS lastName, 
        o.email, 
        o.phone, 
        o.event_address AS street, 
        o.event_city AS city, 
        o.event_postal_code AS postalCode, 
        o.event_country AS country, 
        o.total_fee AS totalFee, 
        o.created_at AS createdAt,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'imageUrl', p.image_url,
            'quantity', op.quantity,
            'price', op.price
          )
        ) AS products
      FROM orders o
      LEFT JOIN order_products op ON o.id = op.order_id
      LEFT JOIN products p ON op.product_id = p.id
      WHERE o.email = ? -- Filtrer les commandes par l'email de l'utilisateur connecté
      GROUP BY o.id
      ORDER BY o.id DESC
    `;

    // Exécuter la requête en utilisant l'email de l'utilisateur connecté
    const [orders] = await connection.query<Order[] & RowDataPacket[]>(query, [
      userEmail,
    ]);

    // Retourner les commandes au format JSON
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes de l'utilisateur :",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
