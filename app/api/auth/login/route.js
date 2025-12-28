import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; 

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Cari User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Sesuai ketentuan: success false, error Unauthorized, code 401
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized", 
        code: 401 
      }, { status: 401 });
    }

    // 2. Cek Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized", 
        code: 401 
      }, { status: 401 });
    }

    // 3. Buat Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h") 
      .sign(secret);

    // 4. Response Sukses Sesuai Ketentuan
    return NextResponse.json({ 
        success: true,
        message: "Login Success", 
        data: {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        }
    });

  } catch (error) {
    console.error("Error Login: ", error);
    // Sesuai ketentuan: Gunakan 401 untuk semua error
    return NextResponse.json({ 
        success: false, 
        error: "Unauthorized", 
        code: 401 
    }, { status: 401 });
  }
}