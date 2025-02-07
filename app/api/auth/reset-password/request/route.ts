// app/api/auth/reset-password/request/route.ts
import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";
import { randomBytes } from "crypto";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Email reçu:", email);

    if (!email) {
      return NextResponse.json(
        { message: "L'adresse email est manquante." },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Vérifie si l'utilisateur existe
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Cet email n'existe pas." },
        { status: 400 }
      );
    }

    const userId = rows[0].id;
    const token = randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 3600000); // Expiration après 1 heure

    // Stocker le token et l'expiration dans la base de données
    await connection.execute(
      "UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE id = ?",
      [token, tokenExpiration, userId]
    );

    console.log("Token généré et stocké:", token);

    // Envoyer l'email avec le lien de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/reset?token=${token}`;
    console.log("Lien de réinitialisation:", resetUrl);

    const subject = "Réinitialisation de votre mot de passe";
    const text = `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetUrl}`;

    await sendEmail(email, subject, text);

    return NextResponse.json(
      { message: "Email de réinitialisation envoyé." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur dans le processus de réinitialisation:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}
