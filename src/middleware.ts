import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = req.nextUrl

    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))) {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/login",
        "/auth/signup",
    ],
}
