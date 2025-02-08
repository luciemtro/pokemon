import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
export async function POST(req: Request) {
  try {
    const { products, customerEmail } = await req.json();

    if (!products || products.length === 0 || !customerEmail) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Création de la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      customer_email: customerEmail,
      metadata: {
        products: JSON.stringify(products), // On stocke les produits en metadata pour les récupérer dans le webhook
      },
      line_items: products.map((product: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100), // Stripe prend les prix en centimes
        },
        quantity: product.quantity,
      })),
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("💥 Erreur Stripe :", error);
    return NextResponse.json(
      { error: "Stripe checkout error" },
      { status: 500 }
    );
  }
}
