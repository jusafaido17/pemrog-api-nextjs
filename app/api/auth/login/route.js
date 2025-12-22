import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // Import dari jose

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Cari User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 2. Cek Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Buat Token (Payload: id, email)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h") // Token berlaku 2 jam
      .sign(secret);

    // 4. Kirim Token
    return NextResponse.json({ 
        message: "Login Success", 
        token: token 
    });

  } catch (error) {
    console.error("Error GET User: ", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
