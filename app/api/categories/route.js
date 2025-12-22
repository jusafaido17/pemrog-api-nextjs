import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, {status:200});
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}

// export async function POST(request){
//     try{
//         const data = await request.json();
//         const newCategory = await prisma.category.create({
//             data:{
//                 name: data.name,
//             },
//         });
        
//         return NextResponse.json(newCategory);
//     }catch(error){
//         console.error("Server error", error);
//         return NextResponse.json({error:"Internal Server Error"}, {status:500});
//     }
// }

//! buat kategori baru dilengkapi nama produk
export async function POST(request){
    try{
        const data = await request.json();
        const newCategory = await prisma.category.create({
            data:{
                name: data.categoryName,
                product: {
                    create: [
                        {
                            name: data.name,
                            price: data.price,
                            stock: data.stock
                        }
                    ]
                }
            },
            include: {
                product: true //melihat hasil product yang ikut dibuat
            }
        });
        
        return NextResponse.json(newCategory);
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}
