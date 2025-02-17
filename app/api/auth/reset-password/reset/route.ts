import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  let connection;
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token ou nouveau mot de passe manquant." },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // 📌 Vérifier si le token est valide et non expiré
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id, email FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Token invalide ou expiré." },
        { status: 400 }
      );
    }

    const userId = rows[0].id;
    const userEmail = rows[0].email;

    // 📌 Vérifier la force du mot de passe (optionnel)
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    // 📌 Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 📌 Mettre à jour le mot de passe et supprimer le token
    await connection.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?",
      [hashedPassword, userId]
    );

    console.log(
      `✅ Mot de passe réinitialisé pour l'utilisateur : ${userEmail}`
    );

    return NextResponse.json({
      message:
        "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
      email: userEmail,
    });
  } catch (error) {
    console.error(
      "❌ Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    return NextResponse.json(
      { message: "Une erreur est survenue. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
