import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById } from "@/lib/db/users"
import { deleteLead, updateLead, type LeadStatus } from "@/lib/db/leads"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

const LEAD_STATUSES: LeadStatus[] = [
    "new",
    "contacted",
    "qualified",
    "won",
    "lost",
]

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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { name, email, phone, source, status, notes } = body

        if (status !== undefined && !LEAD_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: "Invalid lead status" },
                { status: 400 }
            )
        }
        if (name !== undefined && (typeof name !== "string" || !name.trim())) {
            return NextResponse.json(
                { error: "Name can't be empty" },
                { status: 400 }
            )
        }

        const lead = await updateLead(id, {
            name,
            email,
            phone,
            source,
            status,
            notes,
        })

        if (!lead) {
            return NextResponse.json(
                { error: "Lead not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ lead })
    } catch (error) {
        console.error("Lead update error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        await deleteLead(id)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Lead delete error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
