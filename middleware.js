// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  //tambahkan ini sementara untuk bypass middleware di pertemuan 08. CRUD API Lanjutan
  if (process.env.DISABLE_AUTH_MIDDLEWARE === "true") {
    console.log("Middleware dinonaktifkan sementara");
    return NextResponse.next();
  }

  // 1. Ambil token dari Header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return NextResponse.json({
    success: false,
    error: "Unauthorized: Token Missing",
    code: 401
  }, { status: 401 });
}

  const token = authHeader.split(" ")[1]; // Ambil string setelah "Bearer"

  try {
    // 2. Verifikasi Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // 3. Jika sukses, lanjut
    return NextResponse.next();

  } catch (error) {
    // 4. Jika token salah/expired
    console.error("Token salah/expired", error);
  return NextResponse.json({
    success: false,
    error: "Unauthorized: Invalid Token",
    code: 401
  }, { status: 401 });
  }
}

export const config = {
  // Tentukan route mana yang difilter middleware ini
  matcher: [
    "/api/books/:path*", 
    "/api/users/:path*"
  ],
};