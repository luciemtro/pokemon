import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 🔥 Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  let connection;
  try {
    console.log("📩 Réception d'un webhook Stripe...");

    const rawBody = await req.text(); // ✅ Récupère le raw body
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      console.error("❌ Signature Stripe manquante !");
      return NextResponse.json(
        { error: "Signature Stripe manquante" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("✅ Signature Stripe vérifiée !");
    } catch (err) {
      console.error("❌ Erreur de vérification Stripe :", err);
      return NextResponse.json(
        { error: "Signature Webhook invalide" },
        { status: 400 }
      );
    }

    // 🔥 Cas où le paiement est validé
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ Paiement validé pour :", session.customer_email);

      const customerEmail =
        session.customer_email || session.customer_details?.email;

      if (!customerEmail) {
        console.error("⚠️ Aucun email client trouvé !");
        return NextResponse.json(
          { error: "Email client introuvable" },
          { status: 400 }
        );
      }

      const totalFee = session.amount_total! / 100; // Convertir centimes en €
      const products = session.metadata?.cart
        ? JSON.parse(session.metadata.cart)
        : [];

      console.log("🛒 Produits reçus :", products);

      if (!products.length) {
        console.error("⚠️ Aucun produit trouvé dans la commande !");
        return NextResponse.json(
          { error: "Aucun produit trouvé" },
          { status: 400 }
        );
      }

      // 🔥 Connexion à la base de données
      connection = await getConnection();
      await connection.beginTransaction();

      console.log("🔗 Connexion à la base de données établie.");

      // 📌 Récupérer `user_id` via l'email
      const [userRows] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [customerEmail]
      );

      if (userRows.length === 0) {
        console.error(
          "⚠️ Utilisateur non trouvé avec cet email :",
          customerEmail
        );
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      const userId = userRows[0].id;
      console.log("👤 Utilisateur trouvé, ID :", userId);

      // 📌 Insertion de la commande dans `orders`
      const insertOrderSql = `
        INSERT INTO orders (user_id, email, total, status, stripe_session_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [orderResult] = await connection.execute<ResultSetHeader>(
        insertOrderSql,
        [userId, customerEmail, totalFee, "paid", session.id]
      );

      const orderId = orderResult.insertId;
      console.log("📝 Commande enregistrée dans `orders`, ID :", orderId);

      // 📌 Insertion des cartes Pokémon achetées dans `order_items`
      const insertOrderItemSql = `
        INSERT INTO order_items (order_id, pokemon_id, name, image_url, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      for (const product of products) {
        console.log("📦 Insertion du produit :", {
          orderId,
          productId: product.id,
          name: product.name,
          imageUrl: product.image,
          price: product.price,
          quantity: product.quantity || 1,
        });

        try {
          await connection.execute(insertOrderItemSql, [
            orderId,
            product.id,
            product.name,
            product.image,
            product.price,
            product.quantity || 1,
          ]);
          console.log("✅ Produit inséré :", product.name);
        } catch (error) {
          console.error("❌ Erreur lors de l'insertion d'un produit :", error);
        }
      }

      await connection.commit();
      console.log("✅ Commande et items enregistrés en BDD !");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erreur Webhook Stripe :", error);
    if (connection) {
      await connection.rollback();
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  } finally {
    if (connection) connection.release();
  }
}
