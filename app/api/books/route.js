import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET: Ambil semua buku dari Neon DB
export async function GET() {
  try {
    const books = await prisma.book.findMany();
    
    return NextResponse.json({
      success: true,
      message: "Data buku berhasil diambil",
      data: books
    }, { status: 200 }); // Status 200 untuk pengambilan data
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Unauthorized",
      code: 401
    }, { status: 401 }); // Error diseragamkan ke 401 sesuai ketentuan
  }
}

// POST: Tambah buku ke Neon DB
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, year } = body;

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized", 
        code: 401 
      }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: parseInt(year),
        userId: decoded.id, // Menyimpan ID user
      },
    });

    return NextResponse.json({
      success: true,
      message: "Buku berhasil ditambahkan",
      data: newBook
    }, { status: 201 }); // Status 201 karena berhasil membuat data baru

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      error: "Unauthorized", 
      code: 401 
    }, { status: 401 }); // Error diseragamkan ke 401 sesuai ketentuan
  }
}