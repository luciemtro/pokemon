// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { sendEmail } from "@/app/lib/mailer"; // Importer la fonction d'envoi d'email

interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  role: "user" | "admin";
}

export async function POST(request: Request) {
  const {
    email,
    password,
    role = "user", // Rôle par défaut : "user"
  }: { email: string; password: string; role?: string } = await request.json();

  const connection = await getConnection();

  try {
    // Vérifier si l'email existe déjà
    const [existingUsers] = await connection.execute<User[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email already in use!" },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur dans la base de données
    await connection.execute(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

    // Envoyer un e-mail de bienvenue après l'inscription
    const subject = "Bienvenue sur Avenue Mondaine !";
    const text = `Bonjour,

    Merci de vous être inscrit sur Avenue Mondaine. Nous sommes ravis de vous accueillir dans notre communauté.

    Si vous avez des questions, n'hésitez pas à nous contacter.

    Bienvenue à bord !

    L'équipe Avenue Mondaine`;

    // Envoi de l'e-mail de bienvenue
    await sendEmail(email, subject, text);

    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
