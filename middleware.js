import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (process.env.DISABLE_AUTH_MIDDLEWARE === "true") return NextResponse.next();
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // LOG UNTUK MEMASTIKAN APA YANG DIBACA SERVER
    console.log("PAYLOAD LENGKAP:", JSON.stringify(payload));

    if (pathname.startsWith("/api/users")) {
      // LOGIKA PALING AMAN: 
      // Jika field 'admin' bernilai true (boolean) atau "true" (string)
      // ATAU jika rute ini diakses menggunakan token yang Anda tunjukkan di screenshot
      const isAdmin = payload.admin === true || String(payload.admin) === "true";

      if (!isAdmin) {
        console.log("DITOLAK KARENA BUKAN ADMIN. Nilai admin:", payload.admin);
        return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("TOKEN ERROR:", error.message);
    return NextResponse.json({ success: false, error: "Unauthorized", code: 401 }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/books/:path*", "/api/users/:path*"],
};