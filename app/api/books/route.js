import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // 1. Wajib Import ini

// Ambil semua buku dari Neon DB
export async function GET() {
  const books = await prisma.book.findMany();
  return NextResponse.json(books);
}

// Tambah buku ke Neon DB
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, year } = body; // userId tidak perlu diambil dari body lagi

    // Ambil token dari Header Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token dan definisikan variabel 'decoded'
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: parseInt(year),
        userId: decoded.id, 
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}