import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { isAdminEmail } from "@/lib/admin"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function proxy(request: NextRequest) {
    return await proxyHandler(request)
}

export async function proxyHandler(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const { pathname } = request.nextUrl

    // 1. Identify public vs protected paths. /admin/login is its own public
    // entry point, distinct from the member /login.
    const isAdminLoginPath = pathname === "/admin/login"
    const isPublicPath =
        pathname === "/login" || pathname === "/signup" || isAdminLoginPath
    const isAdminPath = pathname.startsWith("/admin") && !isAdminLoginPath
    const isProtectedPath = pathname.startsWith("/dashboard") || isAdminPath

    // 2. Validate token if present, and pull the email off it (it's part of
    // the JWT payload already) so we can route by admin-ness without a DB call.
    let isValid = false
    let email: string | undefined
    if (token) {
        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            )
            isValid = true
            email = (payload as { email?: string }).email
        } catch (error) {
            isValid = false
        }
    }

    // 3. Redirect logic
    if (isProtectedPath && !isValid) {
        const loginPath = isAdminPath ? "/admin/login" : "/login"
        const response = NextResponse.redirect(new URL(loginPath, request.url))
        response.cookies.delete("auth_token") // Cleanup stale token
        return response
    }

    // A signed-in but non-admin visitor has no business under /admin.
    if (isAdminPath && isValid && !isAdminEmail(email)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (isPublicPath && isValid) {
        const destination = isAdminEmail(email) ? "/admin" : "/dashboard"
        return NextResponse.redirect(new URL(destination, request.url))
    }

    // 4. Manual 404 handling for specific non-existent paths if needed
    // (Next.js handles most via filesystem routing)

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
}
