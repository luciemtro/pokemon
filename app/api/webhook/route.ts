import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";

// 🔥 Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  let connection;
  try {
    const rawBody = await req.text(); // ✅ Remplace `buffer(req as any);`
    const sig = req.headers.get("stripe-signature")!;

    if (!sig) {
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

      const customerEmail = session.customer_email!;
      const totalFee = session.amount_total! / 100; // Convertir centimes en €
      const products = session.metadata?.cart
        ? JSON.parse(session.metadata.cart)
        : [];

      if (!customerEmail || !totalFee || !products.length) {
        console.error("⚠️ Erreur : Données de paiement invalides :", session);
        return NextResponse.json(
          { error: "Données de paiement invalides" },
          { status: 400 }
        );
      }

      // 🔥 Insérer la commande en base de données
      connection = await getConnection();
      await connection.beginTransaction();

      // Insertion dans `orders`
      const insertOrderSql = `
        INSERT INTO orders (email, total_fee, payment_status, stripe_session_id)
        VALUES (?, ?, ?, ?)
      `;
      const [orderResult] = await connection.execute<ResultSetHeader>(
        insertOrderSql,
        [customerEmail, totalFee, "paid", session.id]
      );

      const orderId = orderResult.insertId;

      // Insertion des cartes Pokémon achetées
      const insertOrderProductSql = `
        INSERT INTO order_products (order_id, product_id, product_name, product_image, price)
        VALUES (?, ?, ?, ?, ?)
      `;
      for (const product of products) {
        await connection.execute(insertOrderProductSql, [
          orderId,
          product.id,
          product.name,
          product.image,
          product.price,
        ]);
      }

      await connection.commit();
      console.log("✅ Commande enregistrée en BDD, ID :", orderId);
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
