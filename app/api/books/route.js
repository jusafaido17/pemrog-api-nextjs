import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Ambil semua buku dari Neon DB
export async function GET() {
  const books = await prisma.book.findMany();
  return NextResponse.json(books);
}

// Tambah buku ke Neon DB
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, year, userId } = body;

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: parseInt(year),
        userId: decoded.id, // Ambil ID langsung dari hasil decode token
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}