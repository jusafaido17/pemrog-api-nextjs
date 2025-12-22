// export async function GET(request, {params}) {

//   const {id} = await params;
//   return Response.json({
//     info: `Anda mengakses  ID: ${id}`
//   });
// }

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// //GET
// export async function GET(request, {params}){
    
//     const resolvedParams = await params;
//     const id = parseInt(resolvedParams.id);

//     const user = await prisma.user.findUnique({
//         where :{
//             id: id
//         }
//     });

//     return NextResponse.json(
//       user, 
//       {status: 200}
//     );
// }

//!PUT
// export async function PUT(request, {params}){
//     const resolvedParams = await params;
//     const id = parseInt(resolvedParams.id);

//     const data = await request.json();
//     const updateUser = await prisma.user.update({
//         where :{id: id},
//         data: {
//             name: data.name,
//             email: data.email,
//             password: data.password
//         }
//     });

//     return NextResponse.json({
//         message: "User berhasil diupdate", 
//         data: updateUser}, 
//         {status: 200}
//     );
// }

// //!DELETE
// export async function DELETE(request, {params}){
//     const resolvedParams = await params;
//     const id = parseInt(resolvedParams.id);

//     const deleteUser = await prisma.user.delete({
//         where: {id, id}
//     });

//     return NextResponse.json({
//         message: "User berhasil dihapus", 
//         data: deleteUser}, 
//         {status: 200}
//     );
// }

// ======================= dengan try-catch =======================================

export async function GET(request, {params}){
      try{
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if(isNaN(id)){
            return NextResponse.json({message: "ID tidak valid"}, {staus:400});
        }

        const user = await prisma.user.findUnique({
            where :{id: id}
        });

        if(!user){
            return NextResponse.json(
                {message: "User tidak ditemukan"},
                {status: 404}
            );
        }

        return NextResponse.json(user, {status: 200});
        
    }catch(error){
        console.error("Error GET User: ", error);
        return NextResponse.json(
            {message: "Error Server"}, {staus: 500});
    }
}

export async function PUT(request, {params}){
    try{
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if(isNaN(id)){
            return NextResponse.json(
                {message: "ID tidak valid"},
                {status:400}
            );
        }

        const existingUser = await prisma.user.findUnique({
            where:{id: id}
        });

        if(!existingUser){
            return NextResponse.json(
                {message: `User dengan ID ${id} tidak ditemukan`},
                {status: 404}
            );
        }

        const data = await request.json();
        const updateUser = await prisma.user.update({
            where :{id: id},
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        });

        return NextResponse.json({
            message: "User berhasil diupdate", 
            data: updateUser}, 
            {status: 200}
        );
    }catch(error){
        console.error("Error PUT User: ", error);

        if(error.code == 'P2025'){
            return NextResponse.json(
                {message: "User tidak ditemukan"},
                {status: 404}
            );
        }

        return NextResponse.json(
            {message: "Terjadi kesalahan pada server"},
            {status: 500}
        );
    }
}

export async function DELETE(request, {params}){
    try{
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if(isNaN(id)){
            return NextResponse.json(
                {message: "ID tidak valid"},
                {status:400}
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: `User dengan ID ${id} tidak ditemukan` },
                { status: 404 }
            );
        }

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "User berhasil dihapus", data: deletedUser},
            { status: 200 }
        );

    }catch(error){
        console.error("Error DELETE User: ", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus User",
                erorr: error.message
            },
            {status: 500}
        );
    }
}
