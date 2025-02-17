import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
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

    // 🔗 Générer le lien de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/reset?token=${token}`;
    console.log("Lien de réinitialisation:", resetUrl);

    // 📩 Envoi de l'email avec un bouton cliquable
    const subject = "🔑 Réinitialisation de votre mot de passe";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <a href="${resetUrl}" 
          style="display: inline-block; padding: 12px 20px; margin: 10px 0;
          font-size: 16px; color: #fff; background-color: #007bff; 
          text-decoration: none; border-radius: 5px;">
          🔑 Réinitialiser mon mot de passe
        </a>
        <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
        <p style="color: #777;">L'équipe Pokémon Store</p>
      </div>
    `;

    await sendEmail(email, subject, htmlContent);

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
