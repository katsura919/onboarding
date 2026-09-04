import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById } from "@/lib/db/users"
import { isAdminEmail } from "@/lib/admin"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

const PAYMENT_LABELS: Record<string, string> = {
    trial: "Trial",
    paid: "Paid",
    renewal_due: "Renewal Due",
    expired: "Expired",
}

const DOMAINS = [
    "Spiritual",
    "Health/Physical",
    "Family/Marriage",
    "Business/Career",
    "Financial",
    "Social/Community",
    "Intellectual/Personal Growth",
    "Recreational/Fun",
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
        if (!viewer || !isAdminEmail(viewer.email)) return null
        return viewer
    } catch {
        return null
    }
}

function formatField(label: string, value: unknown): string {
    const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim())
    return `${label}\n${isEmpty ? "No response yet" : String(value)}\n`
}

function formatSection(
    title: string,
    subtitle: string,
    fields: string[]
): string {
    const divider = "─".repeat(60)
    return `${divider}\n${title} (${subtitle})\n${divider}\n\n${fields.join("\n")}`
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const user = await findUserById(id)
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const connection = user.connection || {}
    const awareness = user.awareness || {}
    const stabilization = user.stabilization || {}
    const snapshot = connection.snapshot || {}
    const triage = connection.triage || {}
    const homeAudit = connection.homeAudit || {}
    const evaluation360: { name?: string; email?: string }[] =
        awareness.evaluation360 || []
    const growthInputs = awareness.growthInputs || {}
    const eveningPulse = awareness.eveningPulse || {}
    const visionActivation = stabilization.visionActivation || {}
    const visionStatements = stabilization.visionStatements || {}
    const familyMission = stabilization.familyMission || {}

    const evaluation360Text =
        evaluation360.filter((p) => p?.name || p?.email).length === 0
            ? "No response yet"
            : evaluation360
                  .filter((p) => p?.name || p?.email)
                  .map(
                      (p) => `${p.name || "—"}${p.email ? ` · ${p.email}` : ""}`
                  )
                  .join("\n")

    const sections = [
        formatSection("Getting to Know You", "Phase 1 · Step 1B", [
            formatField("Primary Role & Responsibility", snapshot.role),
            formatField("Current Challenges", snapshot.challenges),
            formatField("Desired Outcomes", snapshot.goals),
        ]),
        formatSection("Leadership Triage", "Phase 1 · Step 1C", [
            formatField("PDL Leader Score", triage.pdlLeaderScore),
            formatField(
                "High Functioning Neurodiversity",
                triage.neurodiversity
            ),
            formatField(
                "Internal Wiring (CliftonStrengths / Human Design)",
                triage.internalWiring
            ),
            formatField("DiSC Assessment", triage.disc),
        ]),
        formatSection("Open Share", "Phase 1 · Step 1D", [
            formatField(
                "Is there anything on your heart, mind, or plate?",
                connection.openShare
            ),
        ]),
        formatSection("Getting to Know Us", "Phase 1 · Step 1E", [
            formatField(
                "What resonated most with you?",
                connection.cultureTakeaways
            ),
        ]),
        formatSection("Peace-Driven Home Audit", "Phase 1 · Step 1F", [
            formatField(
                "What currently feels the most out of control in your home right now?",
                homeAudit.chaos
            ),
            formatField(
                "When during the day do you feel the most overwhelmed—and what is happening at that time?",
                homeAudit.overwhelmTime
            ),
            formatField(
                "What are the 3–5 things you're mentally tracking every day that no one else is helping with?",
                homeAudit.invisibleLabor
            ),
            formatField(
                "If nothing changed, what would your home feel like 90 days from now?",
                homeAudit.ninetyDayCost
            ),
            formatField(
                "What routines currently exist in your home—and are they actually followed?",
                homeAudit.routines
            ),
            formatField(
                "Where do things tend to pile up or break down the most?",
                homeAudit.breakdownAreas
            ),
            formatField(
                'What responsibilities are clearly assigned—and what is just "assumed" you will handle?',
                homeAudit.assumedResponsibilities
            ),
            formatField(
                "If your family had to describe how the home runs right now in one word, what would it be?",
                homeAudit.familyWord
            ),
            formatField(
                "What do your kids (and/or partner) currently own vs. what do they wait for you to direct?",
                homeAudit.ownVsDirect
            ),
            formatField(
                "Where are you over-functioning—and where should you actually be leading instead of doing?",
                homeAudit.overFunctioning
            ),
            formatField(
                'What would a "peaceful and well-run home" actually look like for YOU?',
                homeAudit.peacefulVision
            ),
            formatField(
                "If you could fix just ONE system this week, what would it be?",
                homeAudit.oneSystemFix
            ),
            formatField(
                "What's one small change you are willing to commit to this week?",
                homeAudit.commitment
            ),
        ]),
        formatSection("360° Feedback Circle", "Phase 2 · Step 2A", [
            evaluation360Text,
        ]),
        formatSection("Growth Inputs", "Phase 2 · Step 2B", [
            formatField(
                "Key Takeaways & Breakthroughs",
                growthInputs.takeaways
            ),
        ]),
        formatSection("Evening Pulse", "Phase 2 · Step 2C", [
            formatField("Current Peace Level (1–10)", eveningPulse.peaceLevel),
            formatField("What went well today?", eveningPulse.goodToday),
            formatField("What felt heavy today?", eveningPulse.heavyToday),
        ]),
        formatSection(
            "Vision Activation",
            "Phase 3 · Step 3A",
            DOMAINS.map((domain) =>
                formatField(domain, visionActivation[domain])
            )
        ),
        formatSection(
            "Vision Statements",
            "Phase 3 · Step 3B",
            [1, 2, 3, 4, 5].map((num) =>
                formatField(
                    `Outcome Statement ${num}`,
                    visionStatements[`s${num}`]
                )
            )
        ),
        formatSection("Ideal Day Narrative", "Phase 3 · Step 3C", [
            formatField(
                "Walk through your perfect day",
                stabilization.idealDayStory
            ),
        ]),
        formatSection("Word of the Year", "Phase 3 · Step 3D", [
            formatField("Anchor Word", stabilization.wordOfYear),
        ]),
        formatSection("Family Mission", "Phase 3 · Step 3E", [
            formatField(
                "Core Family Values",
                Array.isArray(familyMission.values) &&
                    familyMission.values.filter(Boolean).length > 0
                    ? familyMission.values.filter(Boolean).join(", ")
                    : undefined
            ),
            formatField("Mission Statement", familyMission.statement),
        ]),
    ]

    const header = [
        "THE PEACE-DRIVEN LEADER — ONBOARDING RESPONSES",
        "",
        `Name: ${user.firstName} ${user.lastName}`,
        `Email: ${user.email}`,
        `Phase: ${user.onboardingStatus?.currentPhase || 1} · Step ${user.onboardingStatus?.currentStep || "1A"}`,
        `Payment: ${PAYMENT_LABELS[user.paymentStatus] || user.paymentStatus}`,
        `Account: ${user.isActive ? "Active" : "Paused"}`,
        `Exported: ${new Date().toISOString().slice(0, 10)}`,
        "",
    ].join("\n")

    const body = `${header}\n${sections.join("\n\n")}\n`

    const fileSlug = `${user.firstName}-${user.lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    return new NextResponse(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${fileSlug || "responses"}-responses.txt"`,
        },
    })
}
