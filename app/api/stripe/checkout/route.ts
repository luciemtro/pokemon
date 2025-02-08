import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { card } = await req.json();

    if (!card || card.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    const hasPriceError = card.some(
      (p: { price?: number }) => p.price === undefined || isNaN(p.price)
    );
    if (hasPriceError) {
      console.error("⚠️ ERREUR: Certaines cartes n'ont pas de prix valide !");
      return NextResponse.json(
        { error: "Une ou plusieurs cartes n'ont pas de prix valide" },
        { status: 400 }
      );
    }

    const compactCard = card.map(
      (p: {
        id: string;
        name: string;
        price: number;
        images: { small: string };
      }) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images.small,
      })
    );

    // 🔥 Transformation en `line_items` pour Stripe
    const lineItems = card.map(
      (p: { name: string; price: number; images: { small: string } }) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: p.name,
            images: [p.images.small],
          },
          unit_amount: Math.round(p.price * 100),
        },
        quantity: 1,
      })
    );

    console.log("📦 Items envoyés à Stripe :", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        card: JSON.stringify(compactCard),
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/card`,
    });

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
