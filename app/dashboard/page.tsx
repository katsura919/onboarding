import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import Link from "next/link"
import { findUserById } from "@/lib/db/users"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Button } from "@/components/ui/button"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        redirect("/login")
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        const userId = (payload as any).userId

        const user = await findUserById(userId)

        if (user && !user.isActive) {
            redirect("/api/auth/logout")
        }

        if (user && !user.onboardingStatus?.hasSeenCelebration) {
            redirect("/success")
        }

        // Granular progress calculation
        const status = user?.onboardingStatus || {
            currentPhase: 1,
            currentStep: "1A",
            isCompleted: false,
            hasSeenCelebration: false,
        }
        const allSteps = [
            "1A",
            "1B",
            "1C",
            "1D",
            "1E",
            "2A",
            "2B",
            "2C",
            "3A",
            "3B",
            "3C",
            "3D",
            "3E",
            "4A",
            "4B",
            "4C",
        ]
        const currentStep = status?.currentStep || "1A"
        const currentStepIndex = allSteps.indexOf(currentStep)
        const progressValue = status?.isCompleted
            ? 100
            : Math.max(
                  0,
                  Math.round((currentStepIndex / allSteps.length) * 100)
              )

        const phaseNames: Record<number, string> = {
            1: "Connection",
            2: "Awareness",
            3: "Stabilization",
            4: "Activation",
        }

        const phaseObjectives: Record<number, string> = {
            1: "I feel seen and welcomed.",
            2: "I see my life clearly now.",
            3: "I am stepping into the life I desire.",
            4: "I am fully activated and supported.",
        }

        const stepNames: Record<string, string> = {
            "1A": "Foundation Video",
            "1B": "SNAP Snapshot",
            "1C": "Leadership Triage",
            "1D": "Open Share",
            "1E": "Schedule Orientation",
            "2A": "360° Evaluation",
            "2B": "Growth Inputs",
            "2C": "Evening Pulse",
            "3A": "Vision Activation",
            "3B": "Vision Statements",
            "3C": "Ideal Day Narrative",
            "3D": "Word of the Year",
            "3E": "Family Mission",
            "4A": "Book Kickstart Call",
            "4B": "Join Telegram",
            "4C": "Wealth Strategy",
        }

        const currentPhaseName = phaseNames[status.currentPhase] || "Initiation"
        const nextStepName = stepNames[status.currentStep] || "Next Assessment"

        return (
            <div className="container mx-auto max-w-6xl animate-in p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:px-8 lg:py-12">
                <div className="flex flex-col space-y-12">
                    {/* Welcome Section */}
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                            <span className="h-px w-5 bg-border" />
                            Your Activation Pathway
                        </div>
                        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                            Welcome home,{" "}
                            <span className="text-primary italic">
                                {user?.firstName || "Leader"}
                            </span>
                        </h1>
                        <p className="font-serif text-lg text-muted-foreground italic">
                            &ldquo;You no longer have to carry everything
                            alone.&rdquo;
                        </p>
                    </div>

                    {/* Onboarding Overview */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 sm:p-10 lg:col-span-2">
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-6 right-2 font-serif text-[9rem] leading-none font-medium text-primary/[0.06] select-none"
                            >
                                0{status.currentPhase}
                            </span>

                            <div className="relative space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                                        Phase {status.currentPhase} ·{" "}
                                        {currentPhaseName}
                                    </span>
                                    <h2 className="font-serif text-2xl font-medium tracking-tight">
                                        &ldquo;
                                        {phaseObjectives[status.currentPhase] ||
                                            "Fully activated and supported."}
                                        &rdquo;
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Follow this guided pathway to activate
                                        your peace and stabilize your
                                        leadership.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                        <span>{progressValue}% complete</span>
                                        <span>16 steps total</span>
                                    </div>
                                    <Progress
                                        value={progressValue}
                                        className="h-1.5 bg-primary/10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-4">
                                        <CheckCircle2
                                            className="h-4 w-4 shrink-0 text-primary"
                                            strokeWidth={1.5}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                Completed
                                            </span>
                                            <span className="text-sm font-medium">
                                                Initiation Phase
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <div className="flex min-w-0 flex-col">
                                            <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                                                Current Action
                                            </span>
                                            <span className="truncate text-sm font-medium">
                                                {nextStepName}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/dashboard/onboarding"
                                    className="inline-block"
                                >
                                    <InteractiveHoverButton className="h-12 px-8">
                                        {status.isCompleted
                                            ? "View Journey"
                                            : "Resume Journey"}
                                    </InteractiveHoverButton>
                                </Link>
                            </div>
                        </div>

                        {/* Side Info / Support Card */}
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40">
                                <div className="border-b border-border/50 px-6 py-5">
                                    <h3 className="font-serif text-lg font-medium">
                                        Journey Roadmap
                                    </h3>
                                </div>
                                <div className="flex flex-col">
                                    {[1, 2, 3, 4].map((phaseNum) => {
                                        const isActive =
                                            status.currentPhase === phaseNum
                                        const isComplete =
                                            status.currentPhase > phaseNum ||
                                            (status.isCompleted &&
                                                phaseNum === 4)
                                        const isLocked =
                                            status.currentPhase < phaseNum

                                        return (
                                            <div
                                                key={phaseNum}
                                                className={cn(
                                                    "flex items-center gap-4 border-b border-border/40 px-6 py-4 last:border-0",
                                                    isActive &&
                                                        "bg-primary/[0.04]"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-serif text-xs",
                                                        isComplete &&
                                                            "border-primary/40 bg-primary/10 text-primary",
                                                        isActive &&
                                                            "border-primary text-primary",
                                                        isLocked &&
                                                            "border-border/60 text-muted-foreground/60"
                                                    )}
                                                >
                                                    {isComplete ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        phaseNum
                                                    )}
                                                </div>
                                                <div className="flex min-w-0 flex-col">
                                                    <span
                                                        className={cn(
                                                            "text-sm font-medium",
                                                            isLocked
                                                                ? "text-muted-foreground/60"
                                                                : "text-foreground"
                                                        )}
                                                    >
                                                        Phase {phaseNum}:{" "}
                                                        {phaseNames[phaseNum]}
                                                    </span>
                                                    {isActive && (
                                                        <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                                                            Currently active
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border/60 bg-card/40 p-6">
                                <h3 className="font-serif text-lg font-medium">
                                    Need Support?
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    Your ProTeam is here to help you every step
                                    of the way, whether it&rsquo;s a question
                                    about results or your rhythm.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4 w-full rounded-xl"
                                >
                                    Message ProTeam
                                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error: any) {
        if (error.digest?.startsWith("NEXT_REDIRECT")) throw error
        console.error("Dashboard auth check error:", error)
        redirect("/api/auth/logout")
    }
}
