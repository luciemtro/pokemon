import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authOptions } from "@/api/auth/authOptions";

// 📌 GET : Récupère les commandes + détails des cartes achetées
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  console.log("📦 API Orders - Session reçue :", session);

  if (!session || !session.user) {
    console.error("❌ Erreur : Utilisateur non connecté !");
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // ✅ Assurer que l'ID utilisateur est bien récupéré
  const userId = session.user.id;

  if (!userId) {
    console.error("❌ Erreur : `user_id` est undefined !");
    return NextResponse.json(
      { error: "ID utilisateur introuvable" },
      { status: 400 }
    );
  }

  console.log("🔗 user_id =", userId);

  const connection = await getConnection();

  try {
    let orders: RowDataPacket[] = [];

    if (session.user.role === "admin") {
      console.log("🛠️ ADMIN connecté, récupération de toutes les commandes...");
      [orders] = await connection.execute<RowDataPacket[]>(`
        SELECT o.*, u.email FROM orders o 
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
    } else {
      console.log("👤 UTILISATEUR connecté, récupération de SES commandes...");
      [orders] = await connection.execute<RowDataPacket[]>(
        `
        SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
      `,
        [userId]
      );
    }

    // 📌 Récupérer les produits achetés pour chaque commande
    for (const order of orders) {
      const [items] = await connection.execute<RowDataPacket[]>(
        `
        SELECT pokemon_id, name, image_url, price, quantity 
        FROM order_items 
        WHERE order_id = ?
      `,
        [order.id]
      );

      order.items = items;
    }

    console.log("📦 Commandes récupérées avec détails :", orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Erreur API commandes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    connection.release();
  }
}
