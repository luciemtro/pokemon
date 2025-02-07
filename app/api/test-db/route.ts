import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";

export async function GET() {
  let connection;
  try {
    console.log("🚀 Tentative de connexion à la base de données...");
    connection = await getConnection();
    console.log("✅ Connexion réussie !");

    // Tester une requête simple
    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    console.log("🔍 Résultat de la requête :", rows);

    return NextResponse.json({ message: "Connexion réussie", data: rows });
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    return NextResponse.json(
      { error: "Échec de connexion à la base de données" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
      console.log("🔌 Connexion libérée !");
    }
  }
}
