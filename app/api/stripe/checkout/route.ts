import { NextResponse } from "next/server.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { card } = await req.json();

    // 🚨 Vérifie que le panier contient des articles
    if (!card || card.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    // 🚨 Vérifie que chaque article a bien un prix valide
    const hasPriceError = card.some(
      (p: { price?: number }) => !p.price || isNaN(p.price)
    );
    if (hasPriceError) {
      console.error("⚠️ ERREUR: Certaines cartes n'ont pas de prix valide !");
      return NextResponse.json(
        { error: "Une ou plusieurs cartes n'ont pas de prix valide" },
        { status: 400 }
      );
    }

    // 🔥 Transformation en `line_items` pour Stripe
    const lineItems = card.map(
      (p: { name: string; price: number; images: { small: string } }) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: p.name,
            images: [p.images.small],
          },
          unit_amount: Math.round(p.price * 100), // Convertir en cents
        },
        quantity: 1,
      })
    );

    // 🛒 Calcul du montant total (Stripe exige un minimum de 50 cents)
    const totalAmount = lineItems.reduce(
      (acc: number, item: { price_data: { unit_amount: number } }) =>
        acc + item.price_data.unit_amount,
      0
    );
    if (totalAmount < 50) {
      console.error("❌ ERREUR: Montant total insuffisant !");
      return NextResponse.json(
        { error: "Le montant total doit être d'au moins 0.50 EUR !" },
        { status: 400 }
      );
    }

    console.log("📦 Items envoyés à Stripe :", lineItems);

    // 🏁 Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        total_items: card.length.toString(),
        total_price:
          lineItems.reduce(
            (acc: number, item: { price_data: { unit_amount: number } }) =>
              acc + item.price_data.unit_amount,
            0
          ) /
            100 +
          " EUR",
        products: JSON.stringify(
          card.map(
            (p: {
              id: string;
              name: string;
              price: number;
              images: { small: string };
            }) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.images?.small || "https://via.placeholder.com/150", // Valeur par défaut si l'image est absente
            })
          )
        ),
      },

      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/card`,
    });

    // 🚀 Vérifie si la session Stripe est bien créée
    if (!session || !session.id) {
      console.error("❌ ERREUR: `sessionId` manquant !");
      return NextResponse.json(
        { error: "Erreur Stripe : sessionId manquant !" },
        { status: 500 }
      );
    }

    console.log("🛒 Checkout Session ID :", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Erreur Stripe :", error);
    return NextResponse.json(
      {
        error: `Erreur Stripe: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
      },
      { status: 500 }
    );
  }
}
