"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Lock } from "lucide-react"

interface SidebarItemProps {
    index: number
    phase: string
    title: string
    status: "complete" | "active" | "locked"
    steps: { id: string; label: string }[]
    currentStep: string
    onClick?: () => void
    onStepClick?: (stepId: string) => void
}

function SidebarItem({
    index,
    phase,
    title,
    status,
    steps,
    currentStep,
    onClick,
    onStepClick,
}: SidebarItemProps) {
    const isExpanded = status === "active" || status === "complete"

    return (
        <div className="flex flex-col">
            <div
                onClick={status !== "locked" ? onClick : undefined}
                className={cn(
                    "group relative flex items-start gap-4 rounded-2xl px-4 py-3 transition-colors duration-300",
                    status === "active"
                        ? "bg-primary/[0.05]"
                        : status !== "locked" &&
                              "cursor-pointer hover:bg-primary/[0.04]",
                    status === "locked" && "opacity-50"
                )}
            >
                <div
                    className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-serif text-xs transition-colors",
                        status === "complete" &&
                            "border-primary/40 bg-primary/10 text-primary",
                        status === "active" && "border-primary text-primary",
                        status === "locked" &&
                            "border-border/60 text-muted-foreground/60"
                    )}
                >
                    {status === "complete" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : status === "locked" ? (
                        <Lock className="h-3 w-3" />
                    ) : (
                        index
                    )}
                </div>

                <div className="flex flex-col">
                    <span
                        className={cn(
                            "text-[10px] font-semibold tracking-[0.15em] uppercase",
                            status === "active"
                                ? "text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {phase}
                    </span>
                    <span
                        className={cn(
                            "font-serif text-sm",
                            status === "active"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {title}
                    </span>
                </div>

                {status === "active" && (
                    <span className="absolute top-1/2 left-0 h-6 w-px -translate-y-1/2 bg-primary" />
                )}
            </div>

            {/* Sub-steps */}
            {isExpanded && steps.length > 0 && (
                <div className="mt-1 mb-3 ml-8 flex flex-col gap-1 border-l border-border/60 py-1 pl-4">
                    {steps.map((step) => {
                        const isStepActive = currentStep === step.id
                        const isStepComplete =
                            status === "complete" ||
                            (status === "active" && currentStep > step.id)

                        return (
                            <button
                                key={step.id}
                                onClick={() => onStepClick?.(step.id)}
                                className={cn(
                                    "py-1 text-left text-xs transition-colors duration-200 hover:text-primary",
                                    isStepActive
                                        ? "font-medium text-primary"
                                        : isStepComplete
                                          ? "text-muted-foreground/80"
                                          : "text-muted-foreground/50"
                                )}
                            >
                                {step.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export function OnboardingSidebar({
    currentPhase = 1,
    currentStep = "1A",
}: {
    currentPhase?: number
    currentStep?: string
}) {
    const handlePhaseClick = async (phaseNum: number, status: string) => {
        if (status === "locked") return

        try {
            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: phaseNum,
                    currentStep: `${phaseNum}A`,
                }),
            })

            if (res.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to jump to phase:", error)
        }
    }

    const handleStepClick = async (stepId: string) => {
        const phaseNum = parseInt(stepId[0])

        try {
            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: phaseNum,
                    currentStep: stepId,
                }),
            })

            if (res.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.error("Failed to jump to step:", error)
        }
    }

    const phaseData = [
        {
            phase: "Phase 1",
            title: "Connection",
            steps: [
                { id: "1A", label: "Foundation Video" },
                { id: "1B", label: "Getting to Know You" },
                { id: "1C", label: "Your Triage" },
                { id: "1D", label: "Open Share" },
                { id: "1E", label: "Getting to Know Us" },
                { id: "1F", label: "Home Audit" },
                { id: "1G", label: "Schedule Orientation" },
            ],
        },
        {
            phase: "Phase 2",
            title: "Awareness",
            steps: [
                { id: "2A", label: "360° Evaluation" },
                { id: "2B", label: "Growth Inputs" },
                { id: "2C", label: "Evening Pulse" },
            ],
        },
        {
            phase: "Phase 3",
            title: "Stabilization",
            steps: [
                { id: "3A", label: "Vision Activation" },
                { id: "3B", label: "Vision Statements" },
                { id: "3C", label: "Ideal Day Narrative" },
                { id: "3D", label: "Word of the Year" },
                { id: "3E", label: "Family Mission" },
            ],
        },
        {
            phase: "Phase 4",
            title: "Activation",
            steps: [
                { id: "4A", label: "Book Kickstart Call" },
                { id: "4B", label: "Join Telegram" },
                { id: "4C", label: "Wealth Strategy" },
            ],
        },
    ]

    const phases = phaseData.map((p, i) => {
        const phaseNum = i + 1
        return {
            ...p,
            status:
                currentPhase > phaseNum
                    ? "complete"
                    : ((currentPhase === phaseNum
                          ? "active"
                          : "locked") as any),
        }
    })

    return (
        <aside className="sticky top-24 hidden w-80 flex-col gap-6 self-start lg:flex">
            <div className="space-y-1 px-4">
                <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    <span className="h-px w-5 bg-border" />
                    Offloading Cares
                </div>
                <h2 className="font-serif text-xl font-medium">The Journey</h2>
            </div>

            <nav className="space-y-1">
                {phases.map((item, i) => (
                    <SidebarItem
                        key={item.phase}
                        index={i + 1}
                        {...item}
                        currentStep={currentStep}
                        onClick={() => handlePhaseClick(i + 1, item.status)}
                        onStepClick={handleStepClick}
                    />
                ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-border/60 bg-card/40 p-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                    Need help? Your ProTeam is standing by.
                </p>
            </div>
        </aside>
    )
}
