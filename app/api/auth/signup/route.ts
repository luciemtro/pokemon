import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { sendEmail } from "@/lib/mailer";

interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  role: "user" | "admin";
}

export async function POST(request: Request) {
  console.log("🚀 Requête reçue pour inscription");

  let connection;
  try {
    const body = await request.json();
    console.log("📩 Données reçues :", body);

    const { email, password, role = "user" } = body;

    if (!email || !password) {
      console.error("❌ Email ou mot de passe manquant !");
      return NextResponse.json(
        { message: "Email et mot de passe sont requis." },
        { status: 400 }
      );
    }

    connection = await getConnection();
    console.log("🔌 Connexion à la DB réussie");

    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await connection.execute<User[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.warn("⚠️ Email déjà utilisé :", email);
      return NextResponse.json(
        { message: "Email already in use!" },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Mot de passe hashé avec succès");

    // Insérer l'utilisateur
    await connection.execute(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );
    console.log("✅ Utilisateur créé dans la base de données");

    // Envoyer un e-mail de bienvenue
    const subject = "Bienvenue sur mon site Pokémon !";
    const htmlContent = `Bonjour,\n\nMerci de vous être inscrit !\n\nBienvenue à bord !`;

    try {
      await sendEmail(email, subject, htmlContent);
      console.log("📩 Email de bienvenue envoyé avec succès");
    } catch (emailError) {
      console.warn("⚠️ Erreur lors de l'envoi de l'email :", emailError);
    }

    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur interne :", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
