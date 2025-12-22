import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//! UPDATE dengan tabel produk dan category berelasi
// export async function PUT(request, {params}){
//     try{
//         //wajib diisi utk versi NEXT.js 15 keatas
//         const resolvedParams = await params;
//         const idProduct = parseInt(resolvedParams.id);

//         if (isNaN(idProduct)){
//             return NextResponse.json(
//                 { error: "ID tidak Valid"},
//                 { status: 400}
//             );
//         }

//         //ambil data dari body request
//         const data = await request.json();

//         const productUpdate = await prisma.product.update({
//             where: {id: idProduct},
//             data: {
//                 name: data.name,
//                 price: data.price,
//                 stock: data.stock
//             }
//         });
//         return NextResponse.json({
//             message: "product berhasil di update",
//             data: productUpdate},
//             {status: 200}
//         );
//     }catch(error){
//         console.error("Server error", error);
//         return NextResponse.json({error: "Internal Server Error"}, {status:500});
//     }
// }

//!update dengan memutuskan relasi product dan category
export async function PUT(request, {params}){
    try{
        const resolvedParams = await params;
        const idProduct = parseInt(resolvedParams.id);

        const data = await request.json();

        //1. siapkan objek data untuk update
        let updateData = {
            name: data.name,
            price: data.price,
            stock: data.stock
        };
        
        //2. logika disconnect
        if (data.hapusKategori==true){
            updateData.category = {
                disconnect: true
            };
        }
        else if(data.categoryId){
            updateData.category = {
                connect: {
                    id: data.categoryId
                }
            };
        }

        //3. update
        const updateProduct = await prisma.product.update({
            where: {id: idProduct},
            data: updateData,
            include: {
                category: true
            }
        });

        return NextResponse.json(
            { message: "Produk berhasil diupdate",
              data: updateProduct
            },
            {status: 200}
        );

    }catch(error){
        console.error("Server Error", error);
        return NextResponse.json({error: "Internal Server Error"}, {status:500})
    }
}