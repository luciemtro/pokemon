import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Type pour l'utilisateur
interface User extends RowDataPacket {
  id: number;
  password: string;
  role: "user" | "admin";
}

export async function POST(request: Request) {
  const { email, password }: { email: string; password: string } =
    await request.json();

  const connection = await getConnection();

  try {
    const [rows] = await connection.execute<User[]>(
      "SELECT id, password, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 }
      );
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user.id,
          role: user.role,
        },
      },
      { status: 200 }
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
