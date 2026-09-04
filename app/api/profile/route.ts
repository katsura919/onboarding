import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, updateUserFields } from "@/lib/db/users"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        return (payload as any).userId
    } catch {
        return null
    }
}

export async function GET() {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await findUserById(userId)
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }
        if (!user.isActive) {
            return NextResponse.json(
                { error: "This account has been paused." },
                { status: 403 }
            )
        }

        return NextResponse.json({
            profile: user.profile,
            avatarUrl: user.avatarUrl,
        })
    } catch (error) {
        console.error("Profile fetch error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const viewer = await findUserById(userId)
        if (!viewer) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }
        if (!viewer.isActive) {
            return NextResponse.json(
                { error: "This account has been paused." },
                { status: 403 }
            )
        }

        const { data } = await req.json()
        if (!data || typeof data !== "object") {
            return NextResponse.json(
                { error: "Missing profile data" },
                { status: 400 }
            )
        }

        // Self-service: only ever allow writing under "profile.*" - never
        // let this route touch payment/admin/onboarding fields.
        const update: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(data)) {
            if (key === "profile" || key.startsWith("profile.")) {
                update[key] = value
            }
        }

        if (Object.keys(update).length === 0) {
            return NextResponse.json(
                { error: "No valid profile fields to update" },
                { status: 400 }
            )
        }

        const updated = await updateUserFields(userId, update)

        return NextResponse.json({
            profile: updated?.profile,
            avatarUrl: updated?.avatarUrl,
        })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
