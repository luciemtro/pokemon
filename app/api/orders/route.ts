import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Order } from "@/app/types/order.types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { Session } from "next-auth";

// Fonction pour créer une commande
export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const { customer, totalFee, products } = body;

    if (!customer || !totalFee || !products || products.length === 0) {
      return NextResponse.json(
        {
          error: "Données obligatoires manquantes ou aucun produit sélectionné",
        },
        { status: 400 }
      );
    }

    connection = await getConnection();
    await connection.beginTransaction();

    const insertOrderSql = `
      INSERT INTO orders 
      (first_name, last_name, email, phone, address_street, address_city, address_postal_code, address_country, total_fee) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute<ResultSetHeader>(insertOrderSql, [
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.phone || "N/A",
      customer.address.street || "Non précisée",
      customer.address.city || "Ville non précisée",
      customer.address.postalCode || "00000",
      customer.address.country || "Pays non précisé",
      totalFee,
    ]);

    const orderId = result.insertId;

    const insertOrderProductSql = `
      INSERT INTO order_products (order_id, product_id, product_name, product_image, quantity, price) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const product of products) {
      await connection.execute(insertOrderProductSql, [
        orderId,
        product.id,
        product.name,
        product.imageUrl,
        product.quantity,
        product.price,
      ]);
    }

    await connection.commit();
    connection.release();

    return NextResponse.json({
      message: "Commande créée avec succès",
      orderId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}

// Fonction pour récupérer les commandes
export async function GET() {
  let connection;
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    const userEmail = session.user.email;
    connection = await getConnection();

    const query = `
      SELECT 
        o.id, 
        o.first_name, 
        o.last_name, 
        o.email, 
        o.phone, 
        o.address_street, 
        o.address_city, 
        o.address_postal_code, 
        o.address_country, 
        o.total_fee, 
        o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', p.product_id,
            'name', p.product_name,
            'imageUrl', p.product_image,
            'quantity', p.quantity,
            'price', p.price
          )
        ) AS products
      FROM orders o
      LEFT JOIN order_products p ON o.id = p.order_id
      GROUP BY o.id
      ORDER BY o.id DESC
    `;

    const [orders] = await connection.query<Order[] & RowDataPacket[]>(query);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
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
