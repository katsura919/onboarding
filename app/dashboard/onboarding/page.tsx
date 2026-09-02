"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Phase1Connection } from "@/components/onboarding/phases/Phase1Connection"
import { Phase2Awareness } from "@/components/onboarding/phases/Phase2Awareness"
import { Phase3Stabilization } from "@/components/onboarding/phases/Phase3Stabilization"
import { Phase4Activation } from "@/components/onboarding/phases/Phase4Activation"
const LOCKED_STEPS = ["1G", "2C", "3E"]

export default function OnboardingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<any>(null)
    const [userData, setUserData] = useState<any>(null)
    const [formData, setFormData] = useState<any>({})
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/onboarding/progress")
                if (res.ok) {
                    const data = await res.json()
                    setUserData(data)
                    setStatus(data.onboardingStatus)

                    // Flatten data for easy form binding
                    setFormData({
                        // Phase 1
                        snapshot_1: data.connection?.snapshot?.role || "",
                        snapshot_2: data.connection?.snapshot?.challenges || "",
                        snapshot_3: data.connection?.snapshot?.goals || "",
                        triage_pdl:
                            data.connection?.triage?.pdlLeaderScore || "",
                        triage_neuro:
                            data.connection?.triage?.neurodiversity || "",
                        triage_wiring:
                            data.connection?.triage?.internalWiring || "",
                        triage_disc: data.connection?.triage?.disc || "",
                        open_share: data.connection?.openShare || "",
                        culture_takeaways:
                            data.connection?.cultureTakeaways || "",
                        homeAudit_chaos:
                            data.connection?.homeAudit?.chaos || "",
                        homeAudit_overwhelmTime:
                            data.connection?.homeAudit?.overwhelmTime || "",
                        homeAudit_invisibleLabor:
                            data.connection?.homeAudit?.invisibleLabor || "",
                        homeAudit_90DayCost:
                            data.connection?.homeAudit?.ninetyDayCost || "",
                        homeAudit_routines:
                            data.connection?.homeAudit?.routines || "",
                        homeAudit_breakdownAreas:
                            data.connection?.homeAudit?.breakdownAreas || "",
                        homeAudit_assumedResponsibilities:
                            data.connection?.homeAudit
                                ?.assumedResponsibilities || "",
                        homeAudit_familyWord:
                            data.connection?.homeAudit?.familyWord || "",
                        homeAudit_ownVsDirect:
                            data.connection?.homeAudit?.ownVsDirect || "",
                        homeAudit_overFunctioning:
                            data.connection?.homeAudit?.overFunctioning || "",
                        homeAudit_peacefulVision:
                            data.connection?.homeAudit?.peacefulVision || "",
                        homeAudit_oneSystemFix:
                            data.connection?.homeAudit?.oneSystemFix || "",
                        homeAudit_commitment:
                            data.connection?.homeAudit?.commitment || "",
                        // Phase 2
                        awareness_360: data.awareness?.evaluation360 || [
                            { name: "", email: "" },
                        ],
                        growth_takeaways:
                            data.awareness?.growthInputs?.takeaways || "",
                        pulse_good:
                            data.awareness?.eveningPulse?.goodToday || "",
                        pulse_heavy:
                            data.awareness?.eveningPulse?.heavyToday || "",
                        pulse_level:
                            data.awareness?.eveningPulse?.peaceLevel || 5,
                        // Phase 3
                        stabilization_activation:
                            data.stabilization?.visionActivation || {},
                        stabilization_statements:
                            data.stabilization?.visionStatements || {},
                        stabilization_story:
                            data.stabilization?.idealDayStory || "",
                        stabilization_word:
                            data.stabilization?.wordOfYear || "",
                        stabilization_values: data.stabilization?.familyMission
                            ?.values || ["", "", ""],
                        stabilization_mission:
                            data.stabilization?.familyMission?.statement || "",
                    })
                }
            } catch (error) {
                toast.error("Failed to sync progress")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    async function handleContinue() {
        setIsUpdating(true)
        try {
            let nextPhase = status?.currentPhase || 1
            let nextStep = status?.currentStep || "1A"
            let dataToSave: any = {}

            if (nextStep === "1B") {
                dataToSave["connection.snapshot.role"] = formData.snapshot_1
                dataToSave["connection.snapshot.challenges"] =
                    formData.snapshot_2
                dataToSave["connection.snapshot.goals"] = formData.snapshot_3
            } else if (nextStep === "1C") {
                dataToSave["connection.triage.pdlLeaderScore"] =
                    formData.triage_pdl
                dataToSave["connection.triage.neurodiversity"] =
                    formData.triage_neuro
                dataToSave["connection.triage.internalWiring"] =
                    formData.triage_wiring
                dataToSave["connection.triage.disc"] = formData.triage_disc
            } else if (nextStep === "1D") {
                dataToSave["connection.openShare"] = formData.open_share
            } else if (nextStep === "1E") {
                dataToSave["connection.cultureTakeaways"] =
                    formData.culture_takeaways
            } else if (nextStep === "1F") {
                dataToSave["connection.homeAudit.chaos"] =
                    formData.homeAudit_chaos
                dataToSave["connection.homeAudit.overwhelmTime"] =
                    formData.homeAudit_overwhelmTime
                dataToSave["connection.homeAudit.invisibleLabor"] =
                    formData.homeAudit_invisibleLabor
                dataToSave["connection.homeAudit.ninetyDayCost"] =
                    formData.homeAudit_90DayCost
                dataToSave["connection.homeAudit.routines"] =
                    formData.homeAudit_routines
                dataToSave["connection.homeAudit.breakdownAreas"] =
                    formData.homeAudit_breakdownAreas
                dataToSave["connection.homeAudit.assumedResponsibilities"] =
                    formData.homeAudit_assumedResponsibilities
                dataToSave["connection.homeAudit.familyWord"] =
                    formData.homeAudit_familyWord
                dataToSave["connection.homeAudit.ownVsDirect"] =
                    formData.homeAudit_ownVsDirect
                dataToSave["connection.homeAudit.overFunctioning"] =
                    formData.homeAudit_overFunctioning
                dataToSave["connection.homeAudit.peacefulVision"] =
                    formData.homeAudit_peacefulVision
                dataToSave["connection.homeAudit.oneSystemFix"] =
                    formData.homeAudit_oneSystemFix
                dataToSave["connection.homeAudit.commitment"] =
                    formData.homeAudit_commitment
            } else if (nextStep === "2A") {
                dataToSave["awareness.evaluation360"] = formData.awareness_360
            } else if (nextStep === "2B") {
                dataToSave["awareness.growthInputs.takeaways"] =
                    formData.growth_takeaways
            } else if (nextStep === "2C") {
                dataToSave["awareness.eveningPulse.goodToday"] =
                    formData.pulse_good
                dataToSave["awareness.eveningPulse.heavyToday"] =
                    formData.pulse_heavy
                dataToSave["awareness.eveningPulse.peaceLevel"] =
                    formData.pulse_level
            } else if (nextStep === "3A") {
                dataToSave["stabilization.visionActivation"] =
                    formData.stabilization_activation
            } else if (nextStep === "3B") {
                dataToSave["stabilization.visionStatements"] =
                    formData.stabilization_statements
            } else if (nextStep === "3C") {
                dataToSave["stabilization.idealDayStory"] =
                    formData.stabilization_story
            } else if (nextStep === "3D") {
                dataToSave["stabilization.wordOfYear"] =
                    formData.stabilization_word
            } else if (nextStep === "3E") {
                dataToSave["stabilization.familyMission.values"] =
                    formData.stabilization_values
                dataToSave["stabilization.familyMission.statement"] =
                    formData.stabilization_mission
            }

            // Logic to advance steps/phases
            if (nextStep === "1A") nextStep = "1B"
            else if (nextStep === "1B") nextStep = "1C"
            else if (nextStep === "1C") nextStep = "1D"
            else if (nextStep === "1D") nextStep = "1E"
            else if (nextStep === "1E") nextStep = "1F"
            else if (nextStep === "1F") nextStep = "1G"
            else if (nextStep === "1G") {
                nextPhase = 2
                nextStep = "2A"
            } else if (nextStep === "2A") nextStep = "2B"
            else if (nextStep === "2B") nextStep = "2C"
            else if (nextStep === "2C") {
                nextPhase = 3
                nextStep = "3A"
            } else if (nextStep === "3A") nextStep = "3B"
            else if (nextStep === "3B") nextStep = "3C"
            else if (nextStep === "3C") nextStep = "3D"
            else if (nextStep === "3D") nextStep = "3E"
            else if (nextStep === "3E") {
                nextPhase = 4
                nextStep = "4A"
            } else if (nextStep === "4A") nextStep = "4B"
            else if (nextStep === "4B") nextStep = "4C"
            else if (nextStep === "4C") {
                // Completion
                dataToSave["onboardingStatus.isCompleted"] = true
            }

            if (LOCKED_STEPS.includes(nextStep)) {
                toast.info("This phase is locked for now.")
                setIsUpdating(false)
                return
            }

            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: nextPhase,
                    currentStep: nextStep,
                    data: dataToSave,
                }),
            })

            if (res.ok) {
                const newStatus = await res.json()
                setStatus(newStatus)
                toast.success("Pathway Activated!")
                router.refresh() // Sync the server-side sidebar

                if (dataToSave["onboardingStatus.isCompleted"]) {
                    router.push("/dashboard")
                    return
                }

                if (nextStep === `${(status?.currentPhase || 1) + 1}A`) {
                    window.location.reload()
                }
            }
        } catch (error) {
            toast.error("Failed to update progress")
        } finally {
            setIsUpdating(false)
        }
    }

    // Debounced auto-save
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const currentStep = status?.currentStep
            if (!currentStep) return

            let dataToSave: any = {}
            if (currentStep === "1B") {
                dataToSave["connection.snapshot.role"] = formData.snapshot_1
                dataToSave["connection.snapshot.challenges"] =
                    formData.snapshot_2
                dataToSave["connection.snapshot.goals"] = formData.snapshot_3
            } else if (currentStep === "1C") {
                dataToSave["connection.triage.pdlLeaderScore"] =
                    formData.triage_pdl
                dataToSave["connection.triage.neurodiversity"] =
                    formData.triage_neuro
                dataToSave["connection.triage.internalWiring"] =
                    formData.triage_wiring
                dataToSave["connection.triage.disc"] = formData.triage_disc
            } else if (currentStep === "1D") {
                dataToSave["connection.openShare"] = formData.open_share
            } else if (currentStep === "1E") {
                dataToSave["connection.cultureTakeaways"] =
                    formData.culture_takeaways
            } else if (currentStep === "1F") {
                dataToSave["connection.homeAudit.chaos"] =
                    formData.homeAudit_chaos
                dataToSave["connection.homeAudit.overwhelmTime"] =
                    formData.homeAudit_overwhelmTime
                dataToSave["connection.homeAudit.invisibleLabor"] =
                    formData.homeAudit_invisibleLabor
                dataToSave["connection.homeAudit.ninetyDayCost"] =
                    formData.homeAudit_90DayCost
                dataToSave["connection.homeAudit.routines"] =
                    formData.homeAudit_routines
                dataToSave["connection.homeAudit.breakdownAreas"] =
                    formData.homeAudit_breakdownAreas
                dataToSave["connection.homeAudit.assumedResponsibilities"] =
                    formData.homeAudit_assumedResponsibilities
                dataToSave["connection.homeAudit.familyWord"] =
                    formData.homeAudit_familyWord
                dataToSave["connection.homeAudit.ownVsDirect"] =
                    formData.homeAudit_ownVsDirect
                dataToSave["connection.homeAudit.overFunctioning"] =
                    formData.homeAudit_overFunctioning
                dataToSave["connection.homeAudit.peacefulVision"] =
                    formData.homeAudit_peacefulVision
                dataToSave["connection.homeAudit.oneSystemFix"] =
                    formData.homeAudit_oneSystemFix
                dataToSave["connection.homeAudit.commitment"] =
                    formData.homeAudit_commitment
            } else if (currentStep === "2A") {
                dataToSave["awareness.evaluation360"] = formData.awareness_360
            } else if (currentStep === "2B") {
                dataToSave["awareness.growthInputs.takeaways"] =
                    formData.growth_takeaways
            } else if (currentStep === "2C") {
                dataToSave["awareness.eveningPulse.goodToday"] =
                    formData.pulse_good
                dataToSave["awareness.eveningPulse.heavyToday"] =
                    formData.pulse_heavy
                dataToSave["awareness.eveningPulse.peaceLevel"] =
                    formData.pulse_level
            } else if (currentStep === "3A") {
                dataToSave["stabilization.visionActivation"] =
                    formData.stabilization_activation
            } else if (currentStep === "3B") {
                dataToSave["stabilization.visionStatements"] =
                    formData.stabilization_statements
            } else if (currentStep === "3C") {
                dataToSave["stabilization.idealDayStory"] =
                    formData.stabilization_story
            } else if (currentStep === "3D") {
                dataToSave["stabilization.wordOfYear"] =
                    formData.stabilization_word
            } else if (currentStep === "3E") {
                dataToSave["stabilization.familyMission.values"] =
                    formData.stabilization_values
                dataToSave["stabilization.familyMission.statement"] =
                    formData.stabilization_mission
            }

            if (Object.keys(dataToSave).length > 0) {
                await fetch("/api/onboarding/progress", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: dataToSave }),
                })
            }
        }, 2000)

        return () => clearTimeout(timeoutId)
    }, [formData, status?.currentStep])

    async function handleBack() {
        setIsUpdating(true)
        try {
            let prevPhase = status?.currentPhase || 1
            let prevStep = status?.currentStep || "1A"

            if (prevStep === "1B") prevStep = "1A"
            else if (prevStep === "1C") prevStep = "1B"
            else if (prevStep === "1D") prevStep = "1C"
            else if (prevStep === "1E") prevStep = "1D"
            else if (prevStep === "1F") prevStep = "1E"
            else if (prevStep === "1G") prevStep = "1F"
            else if (prevStep === "2A") {
                prevPhase = 1
                prevStep = "1G"
            } else if (prevStep === "2B") prevStep = "2A"
            else if (prevStep === "2C") prevStep = "2B"
            else if (prevStep === "3A") {
                prevPhase = 2
                prevStep = "2C"
            } else if (prevStep === "3B") prevStep = "3A"
            else if (prevStep === "3C") prevStep = "3B"
            else if (prevStep === "3D") prevStep = "3C"
            else if (prevStep === "3E") prevStep = "3D"
            else if (prevStep === "4A") {
                prevPhase = 3
                prevStep = "3E"
            } else if (prevStep === "4B") prevStep = "4A"
            else if (prevStep === "4C") prevStep = "4B"

            const res = await fetch("/api/onboarding/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPhase: prevPhase,
                    currentStep: prevStep,
                }),
            })

            if (res.ok) {
                const newStatus = await res.json()
                setStatus(newStatus)
                toast.success("Moving back...")
                router.refresh() // Sync the server-side sidebar

                // If it was a phase jump, reload
                if (prevPhase < (status?.currentPhase || 1)) {
                    window.location.reload()
                }
            }
        } catch (error) {
            toast.error("Failed to go back")
        } finally {
            setIsUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="animate-pulse text-muted-foreground">
                    Syncing your journey...
                </p>
            </div>
        )
    }

    const currentStep = status?.currentStep || "1A"
    const isLocked = LOCKED_STEPS.includes(currentStep)

    return (
        <div className="animate-in space-y-10 duration-1000 fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    <span className="h-px w-5 bg-border" />
                    Phase {status?.currentPhase || 1} · Step {currentStep}
                </div>

                {currentStep === "1A" && (
                    <>
                        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
                            The First Step: Connection
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Establishing the foundation of your journey."
                        </p>
                    </>
                )}

                {currentStep === "1B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Getting to Know You
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Insight to support you well—without the need to
                            repeat yourself."
                        </p>
                    </>
                )}

                {currentStep === "1C" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Your Leadership Triage
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Mapping your Mind, Body, and Divine Identity."
                        </p>
                    </>
                )}

                {currentStep === "1D" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Open Share
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Nothing is too big or too small for us to hold."
                        </p>
                    </>
                )}

                {currentStep === "1E" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Getting to Know Us
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Understanding the heartbeat and rhythm of Minesha."
                        </p>
                    </>
                )}

                {currentStep === "1F" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Your Peace-Driven Home Audit
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            &ldquo;An honest look at where things stand—not the
                            highlight reel.&rdquo;
                        </p>
                    </>
                )}

                {currentStep === "1G" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Book Your Call
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Now that I have a glimpse into your world... let's
                            connect."
                        </p>
                    </>
                )}

                {currentStep === "2A" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            360° Evaluation
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Seeing your leadership through the eyes of those
                            you value."
                        </p>
                    </>
                )}

                {currentStep === "2B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Growth Inputs
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Consolidating your breakthroughs and historical
                            insights."
                        </p>
                    </>
                )}

                {currentStep === "2C" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Evening Pulse
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Release. Reflect. Realign."
                        </p>
                    </>
                )}

                {currentStep === "3A" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Vision Activation
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Envisioning peace across every domain of your
                            life."
                        </p>
                    </>
                )}

                {currentStep === "3B" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Vision Statements
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Aligning with outcomes: 'I am thankful that I...'"
                        </p>
                    </>
                )}

                {currentStep === "3C" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Ideal Day Narrative
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Walking through the life you desire."
                        </p>
                    </>
                )}

                {currentStep === "3D" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Word of the Year
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "A single word to anchor your path."
                        </p>
                    </>
                )}

                {currentStep === "3E" && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Family Mission
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Establishing peace and purpose in your home."
                        </p>
                    </>
                )}

                {currentStep.startsWith("2") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Awareness Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Gaining clarity on your current reality."
                        </p>
                    </>
                )}

                {currentStep.startsWith("3") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Stabilization Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Embodying the vision of your desired future."
                        </p>
                    </>
                )}

                {currentStep.startsWith("4") && (
                    <>
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Activation Phase
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground italic">
                            "Fully activated. Fully supported."
                        </p>
                    </>
                )}
            </div>
            {status?.currentPhase === 1 && (
                <Phase1Connection
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {status?.currentPhase === 2 && (
                <Phase2Awareness
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {status?.currentPhase === 3 && (
                <Phase3Stabilization
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {status?.currentPhase === 4 && (
                <Phase4Activation
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {status?.currentPhase > 4 && (
                <div className="flex flex-col items-center justify-center space-y-4 p-20 text-center">
                    <span className="font-serif text-5xl text-primary italic">
                        ✦
                    </span>
                    <h2 className="font-serif text-2xl font-medium">
                        Path Activation Complete
                    </h2>
                    <p className="max-w-sm text-muted-foreground">
                        You have completed the Peace-Driven Leader Activation
                        Pathway. Your ProTeam will reach out shortly.
                    </p>
                </div>
            )}

            {/* CTA Area */}
            <div className="flex flex-col items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                        {currentStep === "1C"
                            ? "Final Step of Phase 1"
                            : "Ready to proceed?"}
                    </p>
                    <p className="font-serif text-base">
                        {isLocked && "Next Phase Coming Soon..."}
                        {!isLocked && (
                            <>
                                {currentStep === "1A" &&
                                    "Next: Getting to Know You"}
                                {currentStep === "1B" && "Next: Your Triage"}
                                {currentStep === "1C" && "Next: Open Share"}
                                {currentStep === "1D" &&
                                    "Next: Getting to Know Us"}
                                {currentStep === "1E" && "Next: Home Audit"}
                                {currentStep === "1F" &&
                                    "Next: Schedule Orientation"}
                                {currentStep === "1G" &&
                                    "Next: 360° Evaluation"}
                                {currentStep === "2A" && "Next: Growth Inputs"}
                                {currentStep === "2B" && "Next: Evening Pulse"}
                                {currentStep === "2C" &&
                                    "Next: Phase 3 Stabilization"}
                                {currentStep === "3A" &&
                                    "Next: Vision Statements"}
                                {currentStep === "3B" &&
                                    "Next: Ideal Day Narrative"}
                                {currentStep === "3C" &&
                                    "Next: Word of the Year"}
                                {currentStep === "3D" && "Next: Family Mission"}
                                {currentStep === "3E" &&
                                    "Next: Final Kickoff Phase"}
                                {currentStep === "4A" &&
                                    "Next: Community Access"}
                                {currentStep === "4B" &&
                                    "Next: Wealth Strategy"}
                                {currentStep === "4C" && "Finish Onboarding"}
                            </>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {currentStep !== "1A" && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={isUpdating}
                            className="h-11 rounded-xl border-2 px-6"
                        >
                            Back
                        </Button>
                    )}

                    <InteractiveHoverButton
                        onClick={handleContinue}
                        disabled={isUpdating || isLocked}
                        className="h-11 px-8"
                    >
                        {isUpdating
                            ? "Saving..."
                            : isLocked
                              ? "Phase Locked"
                              : currentStep === "4C"
                                ? status?.onboardingStatus?.isCompleted
                                    ? "Return to Dashboard"
                                    : "Complete Pathway"
                                : "Continue"}
                    </InteractiveHoverButton>
                </div>
            </div>
        </div>
    )
}
