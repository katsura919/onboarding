import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, setUserAvatar } from "@/lib/db/users"
import { getSupabase } from "@/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
])

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

export async function POST(req: Request) {
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

        const formData = await req.formData()
        const file = formData.get("file")

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            )
        }
        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: "Please upload a JPG, PNG, WEBP, or GIF image" },
                { status: 400 }
            )
        }
        if (file.size > MAX_FILE_BYTES) {
            return NextResponse.json(
                { error: "Image must be under 5MB" },
                { status: 400 }
            )
        }

        const extension = file.type.split("/")[1] || "jpg"
        const path = `${userId}/${Date.now()}.${extension}`

        const supabase = getSupabase()
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, await file.arrayBuffer(), {
                contentType: file.type,
                upsert: true,
            })

        if (uploadError) throw uploadError

        const {
            data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(path)

        await setUserAvatar(userId, publicUrl)

        return NextResponse.json({ avatarUrl: publicUrl })
    } catch (error) {
        console.error("Avatar upload error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
