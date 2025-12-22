import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Hash Password
    // Angka 10 adalah salt rounds (standar keamanan saat ini)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Simpan ke DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Simpan yang sudah di-hash!
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Error GET User: ", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
