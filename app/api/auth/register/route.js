import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // 1. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Simpan ke DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "User",
      },
    });

    // --- RESPONSE SUKSES SESUAI KETENTUAN ---
    return NextResponse.json({
      success: true,
      message: "User berhasil didaftarkan",
      data: newUser
    }, { status: 201 });

  } catch (error) {
    console.error("Error Register: ", error);
    
    // --- RESPONSE ERROR SESUAI KETENTUAN ---
    return NextResponse.json({
      success: false,
      error: "Unauthorized",
      code: 401
    }, { status: 401 });
  }
}