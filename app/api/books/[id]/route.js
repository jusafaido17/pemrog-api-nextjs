import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET: Ambil detail satu buku berdasarkan ID (Protected)
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const bookId = parseInt(id);

        // 1. Verifikasi Token (Sesuai syarat Poin 4)
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);

        // 2. Cari data di Database
        const book = await prisma.book.findUnique({
            where: { id: bookId }
        });

        if (!book) {
            return NextResponse.json({ 
                success: false, 
                error: "Unauthorized", 
                code: 401 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Data buku ditemukan", 
            data: book 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: "Unauthorized", 
            code: 401 
        }, { status: 401 });
    }
}

// DELETE: Menghapus buku (Admin Only)
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const bookId = parseInt(id);

        // 1. Ambil & Verifikasi Token
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Role Based Authorization (Poin 4: Admin Only)
        if (decoded.role !== "Admin") {
            return NextResponse.json({ 
                success: false, 
                error: "Unauthorized", 
                code: 401 
            }, { status: 401 });
        }

        await prisma.book.delete({
            where: { id: bookId }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Buku berhasil dihapus", 
            data: {} 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: "Unauthorized", 
            code: 401 
        }, { status: 401 });
    }
}

// PUT: Mengupdate data buku (User atau Admin)
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // 1. Ambil & Verifikasi Token (Poin 4: Token Wajib)
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title: body.title,
                author: body.author,
                year: parseInt(body.year)
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Data buku berhasil diubah", 
            data: updatedBook 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: "Unauthorized", 
            code: 401 
        }, { status: 401 });
    }
}