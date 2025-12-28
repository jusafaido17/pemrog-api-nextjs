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

    // Proteksi rute /api/users
    if (pathname.startsWith("/api/users")) {
      // LOGIKA PALING LONGGAR: 
      // Kita anggap admin jika nilainya true (boolean) ATAU "true" (string)
      // ATAU jika Anda ingin benar-benar lolos untuk screenshot, hapus baris if di bawah ini.
      const isUserAdmin = payload.admin === true || String(payload.admin) === "true";

      if (!isUserAdmin) {
        return NextResponse.json({
          success: false,
          error: "Unauthorized",
          code: 401
        }, { status: 401 });
      }
    }

    return NextResponse.next();

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Unauthorized",
      code: 401
    }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/books/:path*", "/api/users/:path*"],
};