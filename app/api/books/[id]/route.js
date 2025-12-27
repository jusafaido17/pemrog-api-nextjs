import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE: Menghapus buku
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const bookId = parseInt(id);

        await prisma.book.delete({
            where: { id: bookId }
        });

        return NextResponse.json({ message: "Buku berhasil dihapus" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Buku tidak ditemukan atau gagal dihapus" }, { status: 404 });
    }
}

// PUT: Mengupdate data buku
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title: body.title,
                author: body.author,
                year: parseInt(body.year)
            }
        });

        return NextResponse.json({ message: "Data buku berhasil diubah", data: updatedBook });
    } catch (error) {
        return NextResponse.json({ message: "Gagal update buku" }, { status: 404 });
    }
}