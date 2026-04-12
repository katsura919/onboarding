import { NextResponse } from "next/server"

export async function POST() {
    return logout()
}

export async function GET() {
    return logout()
}

function logout() {
    const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
    
    response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    })

    return response
}
