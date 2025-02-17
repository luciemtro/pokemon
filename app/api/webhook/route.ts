import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import nodemailer from "nodemailer";

// 🔥 Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

// 📩 Fonction pour envoyer un email après paiement réussi
async function sendConfirmationEmail(
  to: string,
  orderId: number,
  products: any[]
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // `false` pour TLS (port 587), `true` pour SSL (port 465)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 🔥 Construire le contenu de l'email
    const productList = products
      .map((p) => `- ${p.name} (${p.price}€)`)
      .join("\n");

    const mailOptions = {
      from: `"Pokémon Store" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `🛒 Confirmation de votre commande #${orderId}`,
      text: `Bonjour,\n\nMerci pour votre achat ! 🎉\n\nDétails de votre commande :\n${productList}\n\nVotre commande sera traitée sous peu.\n\nMerci pour votre confiance !\n\nL'équipe Pokémon Store`,
    };

    // 📩 Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to} pour la commande #${orderId}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
  }
}

export async function POST(req: Request) {
  let connection;
  try {
    console.log("📩 Réception d'un webhook Stripe...");

    const rawBody = await req.text();
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

      // ✅ Vérifier que metadata.products existe et contient des produits
      if (!session.metadata || !session.metadata.products) {
        console.error("❌ `metadata.products` est vide ou absent !");
        return NextResponse.json(
          { error: "Aucun produit trouvé dans les metadata Stripe" },
          { status: 400 }
        );
      }

      const products: any[] = JSON.parse(session.metadata.products);
      console.log("📦 Produits reçus depuis metadata :", products);

      if (!products.length) {
        console.error("⚠️ Aucun produit trouvé après parsing !");
        return NextResponse.json(
          { error: "Aucun produit trouvé dans la commande !" },
          { status: 400 }
        );
      }

      // 🔥 Connexion à la base de données
      connection = await getConnection();
      await connection.beginTransaction();
      console.log("🔗 Connexion à la base de données établie.");

      // 📌 Vérifier si l'utilisateur existe
      console.log(
        "🔍 Recherche de l'utilisateur avec l'email :",
        customerEmail
      );
      const [userRows] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [customerEmail]
      );

      if (userRows.length === 0) {
        console.error("❌ Utilisateur non trouvé :", customerEmail);
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      const userId = userRows[0].id;
      console.log("👤 Utilisateur trouvé, ID :", userId);

      // 📌 Insertion de la commande dans `orders`
      const totalFee = session.amount_total ? session.amount_total / 100 : 0;
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

      // 📌 Insertion des cartes achetées dans `order_items`
      const insertOrderItemSql = `
        INSERT INTO order_items (order_id, pokemon_id, name, image_url, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      for (const product of products) {
        const productId = product.id || "unknown";
        const productName = product.name || "Nom inconnu";
        const productImage = product.image || "https://via.placeholder.com/150";
        const productPrice = product.price ?? 0;
        const productQuantity = 1;

        console.log(
          `🛒 Ajout du produit : ${productName} (ID: ${productId}, Prix: ${productPrice}, Image: ${productImage})`
        );

        try {
          await connection.execute(insertOrderItemSql, [
            orderId,
            productId,
            productName,
            productImage,
            productPrice,
            productQuantity,
          ]);
          console.log("✅ Produit inséré :", productName);
        } catch (error) {
          console.error(
            `❌ Erreur lors de l'insertion du produit ${productName} :`,
            error
          );
        }
      }

      await connection.commit();
      console.log("✅ Commande et items enregistrés en BDD !");

      // 📩 Envoi de l'email de confirmation
      await sendConfirmationEmail(customerEmail, orderId, products);

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
