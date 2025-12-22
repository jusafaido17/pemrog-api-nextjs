import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// !dengan include
// export async function GET(){
//     try{
//         const products = await prisma.product.findMany({
//             include: {
//                 category: true //mengambil semua kolom yang ada di table category
//             }
//         });
//         return NextResponse.json(products, {status: 201});
//     }catch(error){
//         console.error("Server error", error);
//         return NextResponse.json({error: "Internal Server Errror"}, {status:500});
//     }
// }

//!dengan select
// export async function GET(){
//     try{
//         const products = await prisma.product.findMany({
//             select: {
//                 name: true,
//                 price: true,
//                 category: {
//                     select : {
//                         name : true,
//                     }
//                 }
//             }
//         });
//         return NextResponse.json(products, {status: 201});
//     }catch(error){
//         console.error("Server error", error);
//         return NextResponse.json({error: "Internal Server Errror"}, {status:500});
//     }
// }

// !dengan reverse query
export async function GET(){
    try{
        const kategori = await prisma.category.findMany({
            where: {name: "Gaming Gear"},
            include: {
                product: true //menampilkan array dari tabel product
            }
        });
        return NextResponse.json(kategori, {status: 201});
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error: "Internal Server Errror"}, {status:500});
    }
}


export async function POST(request){
    try{
        const data = await request.json();
        const newProduct = await prisma.product.create({
            data:{
                name: data.name,
                price: data.price,
                stock: data.stock,
                category: {
                    connect: {
                         id: data.categoryId // id dari ketegori yang sudah dibuat
                    }
                }
                
            },
        });
        return NextResponse.json(newProduct, {status:201});
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error: "Internal Server Errro"}, {status: 500});
    }
}

