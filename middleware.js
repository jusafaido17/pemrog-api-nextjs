// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. BYPASS CHECK (Hapus atau set ke false di .env saat UAS)
  if (process.env.DISABLE_AUTH_MIDDLEWARE === "true") {
    return NextResponse.next();
  }

  // 2. PUBLIC ROUTE: Izinkan akses ke /api/auth/ tanpa token
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // 3. AMBIL TOKEN DARI HEADER
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({
      success: false,
      error: "Unauthorized",
      code: 401
    }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 4. VERIFIKASI TOKEN
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 5. ROLE BASED ACCESS (Instruksi Poin 3)
    
    // Rute /api/users/ HANYA untuk Admin
    if (pathname.startsWith("/api/users")) {
      if (payload.admin !== "true") {
        return NextResponse.json({
          success: false,
          error: "Unauthorized",
          code: 401
        }, { status: 401 });
      }
    }

    // Rute /api/books/ (Items) sudah terproteksi karena butuh token valid di atas
    
    return NextResponse.next();

  } catch (error) {
    console.error("Auth Error:", error.message);
    return NextResponse.json({
      success: false,
      error: "Unauthorized",
      code: 401
    }, { status: 401 });
  }
}

// 6. MATCHER: Mengatur rute mana saja yang melewati middleware ini
export const config = {
  matcher: [
    "/api/books/:path*", 
    "/api/users/:path*"
  ],
};