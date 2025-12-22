import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {z} from "zod";

//!bikin schema untuk zod
const UserSchema = z.object({
    name: z.string().min(3, {message: "Nama minimal harus 3 karakter"}),
    email: z.string().email({message: "Format email tidak vailid"}),
    password: z.string().min(8, {message: "Password minimal 8 karakter"}),
});

// GET: Ambil semua data user
export async function GET() {
  try{
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
  }catch(error){
    console.error("Error get Data: ", error);
    NextResponse.json({message: "Server Error"}, {status: 500});
  }
}

//! POST: Tambah user baru tanpa try-catch dan ZOD
// export async function POST(request) {
//   const data = await request.json();
//   const userBaru = await prisma.user.create({
//     data: {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     },
//   });

//   return NextResponse.json(userBaru);
// }

//!POST dengan try-catch dilengkapi ZOD
export async function POST(request){
  try{
    const body = await request.json();
    const validation = UserSchema.safeParse(body);
    if(!validation.success){
      return NextResponse.json({
        message: "Input Tidak Valid",
        error: validation.error.flatten().fieldErrors
      },
      {status: 400}
    );
    }

    const newUser = await prisma.user.create({
      data: body
    });
    return NextResponse.json(newUser, {status: 200});

  }catch(error){
    console.error("Error POST User: ", error);
    NextResponse.json({message: "Server Error"}, {status: 500});
  }
}