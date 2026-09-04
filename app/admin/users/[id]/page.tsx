import { redirect, notFound } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { findUserById } from "@/lib/db/users"
import { isAdminEmail } from "@/lib/admin"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

const PAYMENT_LABELS: Record<string, string> = {
    trial: "Trial",
    paid: "Paid",
    renewal_due: "Renewal Due",
    expired: "Expired",
}

const PAYMENT_BADGE_STYLES: Record<string, string> = {
    trial: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    paid: "border-green-500/20 bg-green-500/10 text-green-600",
    renewal_due: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    expired: "border-destructive/20 bg-destructive/10 text-destructive",
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

function Field({ label, value }: { label: string; value?: unknown }) {
    const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim())

    return (
        <div className="space-y-1.5">
            <p className="text-xs font-bold tracking-wider text-primary uppercase">
                {label}
            </p>
            <p
                className={cn(
                    "leading-relaxed whitespace-pre-wrap",
                    isEmpty
                        ? "text-sm text-muted-foreground/60 italic"
                        : "text-foreground"
                )}
            >
                {isEmpty ? "No response yet" : String(value)}
            </p>
        </div>
    )
}

function Section({
    title,
    subtitle,
    children,
}: {
    title: string
    subtitle: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-6 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <div className="border-b border-border/50 pb-4">
                <h3 className="font-serif text-lg font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="space-y-6">{children}</div>
        </div>
    )
}

export default async function AdminUserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        redirect("/admin/login")
    }

    let viewerId: string
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        viewerId = (payload as any).userId
    } catch {
        redirect("/admin/login")
    }

    const viewer = await findUserById(viewerId)
    if (!viewer) {
        redirect("/api/auth/logout")
    }
    if (!viewer.isActive) {
        redirect("/api/auth/logout")
    }
    if (!isAdminEmail(viewer.email)) {
        redirect("/dashboard")
    }

    const { id } = await params
    const user = await findUserById(id)
    if (!user) {
        notFound()
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

    return (
        <div className="container mx-auto max-w-4xl animate-in p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:p-8">
            <div className="flex min-w-0 flex-col space-y-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
                        </Link>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 rounded-xl px-3 text-xs"
                        >
                            <a href={`/api/admin/users/${user.id}/export`}>
                                <Download className="h-3.5 w-3.5" />
                                Export
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                <span className="h-px w-5 bg-border" />
                                Responses
                            </div>
                            <h1 className="font-serif text-3xl font-medium tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-muted-foreground">
                                {user.email}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                                    PAYMENT_BADGE_STYLES[user.paymentStatus]
                                )}
                            >
                                {PAYMENT_LABELS[user.paymentStatus]}
                            </span>
                            <span
                                className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                                    user.isActive
                                        ? "border-green-500/20 bg-green-500/10 text-green-600"
                                        : "border-destructive/20 bg-destructive/10 text-destructive"
                                )}
                            >
                                {user.isActive ? "Active" : "Paused"}
                            </span>
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                Phase {user.onboardingStatus?.currentPhase || 1}{" "}
                                · Step{" "}
                                {user.onboardingStatus?.currentStep || "1A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Phase 1: Connection */}
                <Section
                    title="Getting to Know You"
                    subtitle="Phase 1 · Step 1B"
                >
                    <Field
                        label="Primary Role & Responsibility"
                        value={snapshot.role}
                    />
                    <Field
                        label="Current Challenges"
                        value={snapshot.challenges}
                    />
                    <Field label="Desired Outcomes" value={snapshot.goals} />
                </Section>

                <Section title="Leadership Triage" subtitle="Phase 1 · Step 1C">
                    <Field
                        label="PDL Leader Score"
                        value={triage.pdlLeaderScore}
                    />
                    <Field
                        label="High Functioning Neurodiversity"
                        value={triage.neurodiversity}
                    />
                    <Field
                        label="Internal Wiring (CliftonStrengths / Human Design)"
                        value={triage.internalWiring}
                    />
                    <Field label="DiSC Assessment" value={triage.disc} />
                </Section>

                <Section title="Open Share" subtitle="Phase 1 · Step 1D">
                    <Field
                        label="Is there anything on your heart, mind, or plate?"
                        value={connection.openShare}
                    />
                </Section>

                <Section
                    title="Getting to Know Us"
                    subtitle="Phase 1 · Step 1E"
                >
                    <Field
                        label="What resonated most with you?"
                        value={connection.cultureTakeaways}
                    />
                </Section>

                <Section
                    title="Peace-Driven Home Audit"
                    subtitle="Phase 1 · Step 1F"
                >
                    <Field
                        label="What currently feels the most out of control in your home right now?"
                        value={homeAudit.chaos}
                    />
                    <Field
                        label="When during the day do you feel the most overwhelmed, and what is happening at that time?"
                        value={homeAudit.overwhelmTime}
                    />
                    <Field
                        label="What are the 3–5 things you're mentally tracking every day that no one else is helping with?"
                        value={homeAudit.invisibleLabor}
                    />
                    <Field
                        label="If nothing changed, what would your home feel like 90 days from now?"
                        value={homeAudit.ninetyDayCost}
                    />
                    <Field
                        label="What routines currently exist in your home, and are they actually followed?"
                        value={homeAudit.routines}
                    />
                    <Field
                        label="Where do things tend to pile up or break down the most?"
                        value={homeAudit.breakdownAreas}
                    />
                    <Field
                        label='What responsibilities are clearly assigned, and what is just "assumed" you will handle?'
                        value={homeAudit.assumedResponsibilities}
                    />
                    <Field
                        label="If your family had to describe how the home runs right now in one word, what would it be?"
                        value={homeAudit.familyWord}
                    />
                    <Field
                        label="What do your kids (and/or partner) currently own vs. what do they wait for you to direct?"
                        value={homeAudit.ownVsDirect}
                    />
                    <Field
                        label="Where are you over-functioning, and where should you actually be leading instead of doing?"
                        value={homeAudit.overFunctioning}
                    />
                    <Field
                        label='What would a "peaceful and well-run home" actually look like for YOU?'
                        value={homeAudit.peacefulVision}
                    />
                    <Field
                        label="If you could fix just ONE system this week, what would it be?"
                        value={homeAudit.oneSystemFix}
                    />
                    <Field
                        label="What's one small change you are willing to commit to this week?"
                        value={homeAudit.commitment}
                    />
                </Section>

                {/* Phase 2: Awareness */}
                <Section
                    title="360° Feedback Circle"
                    subtitle="Phase 2 · Step 2A"
                >
                    {evaluation360.length === 0 ||
                    evaluation360.every((p) => !p?.name && !p?.email) ? (
                        <p className="text-sm text-muted-foreground/60 italic">
                            No response yet
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {evaluation360
                                .filter((p) => p?.name || p?.email)
                                .map((person, i) => (
                                    <p key={i} className="text-foreground">
                                        {person.name || "-"}
                                        {person.email && (
                                            <span className="text-muted-foreground">
                                                {" "}
                                                · {person.email}
                                            </span>
                                        )}
                                    </p>
                                ))}
                        </div>
                    )}
                </Section>

                <Section title="Growth Inputs" subtitle="Phase 2 · Step 2B">
                    <Field
                        label="Key Takeaways & Breakthroughs"
                        value={growthInputs.takeaways}
                    />
                </Section>

                <Section title="Evening Pulse" subtitle="Phase 2 · Step 2C">
                    <Field
                        label="Current Peace Level (1–10)"
                        value={eveningPulse.peaceLevel}
                    />
                    <Field
                        label="What went well today?"
                        value={eveningPulse.goodToday}
                    />
                    <Field
                        label="What felt heavy today?"
                        value={eveningPulse.heavyToday}
                    />
                </Section>

                {/* Phase 3: Stabilization */}
                <Section title="Vision Activation" subtitle="Phase 3 · Step 3A">
                    {DOMAINS.map((domain) => (
                        <Field
                            key={domain}
                            label={domain}
                            value={visionActivation[domain]}
                        />
                    ))}
                </Section>

                <Section title="Vision Statements" subtitle="Phase 3 · Step 3B">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <Field
                            key={num}
                            label={`Outcome Statement ${num}`}
                            value={visionStatements[`s${num}`]}
                        />
                    ))}
                </Section>

                <Section
                    title="Ideal Day Narrative"
                    subtitle="Phase 3 · Step 3C"
                >
                    <Field
                        label="Walk through your perfect day"
                        value={stabilization.idealDayStory}
                    />
                </Section>

                <Section title="Word of the Year" subtitle="Phase 3 · Step 3D">
                    <Field
                        label="Anchor Word"
                        value={stabilization.wordOfYear}
                    />
                </Section>

                <Section title="Family Mission" subtitle="Phase 3 · Step 3E">
                    <Field
                        label="Core Family Values"
                        value={
                            Array.isArray(familyMission.values) &&
                            familyMission.values.filter(Boolean).length > 0
                                ? familyMission.values
                                      .filter(Boolean)
                                      .join(", ")
                                : undefined
                        }
                    />
                    <Field
                        label="Mission Statement"
                        value={familyMission.statement}
                    />
                </Section>
            </div>
        </div>
    )
}
