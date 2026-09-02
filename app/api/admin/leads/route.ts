import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById } from "@/lib/db/users"
import { createLead, listLeads } from "@/lib/db/leads"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        const userId = (payload as any).userId
        const viewer = await findUserById(userId)
        if (!viewer?.isAdmin) return null
        return viewer
    } catch {
        return null
    }
}

export async function GET() {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const leads = await listLeads()
        return NextResponse.json({ leads })
    } catch (error) {
        console.error("Leads list error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { name, email, phone, source, notes } = body

        if (typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        const lead = await createLead({
            name: name.trim(),
            email: email || null,
            phone: phone || null,
            source: source || null,
            notes: notes || null,
        })

        return NextResponse.json({ lead }, { status: 201 })
    } catch (error) {
        console.error("Lead create error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
