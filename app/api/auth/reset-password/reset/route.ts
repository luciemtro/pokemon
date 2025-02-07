// app/api/auth/reset-password/reset.ts
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  const connection = await getConnection();

  try {
    // Vérifier si le token est valide et non expiré
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

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await connection.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?",
      [hashedPassword, userId]
    );

    // Renvoyer l'email pour que le frontend puisse pré-remplir le champ dans la page de connexion
    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès.",
      email: userEmail, // Retourner l'email au frontend
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Une erreur est survenue." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
