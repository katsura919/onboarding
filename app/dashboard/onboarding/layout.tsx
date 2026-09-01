import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { findUserById } from "@/lib/db/users"
import { OnboardingSidebar } from "@/components/onboarding-sidebar"
import { Progress } from "@/components/ui/progress"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    let status = { currentPhase: 1, currentStep: "1A", isCompleted: false }

    if (token) {
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
            if (user) {
                status = user.onboardingStatus
            }
        } catch (error: any) {
            if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
            console.error("Layout progress fetch error:", error)
        }
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
    const currentStepIndex = allSteps.indexOf(status.currentStep)
    const progressValue = status.isCompleted
        ? 100
        : Math.max(0, (currentStepIndex / allSteps.length) * 100)

    return (
        <div className="container mx-auto animate-in px-4 py-8 duration-700 fade-in sm:px-6 lg:px-8 lg:py-12">
            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Sidebar */}
                <OnboardingSidebar
                    currentPhase={status.currentPhase}
                    currentStep={status.currentStep}
                />

                {/* Main Content Area */}
                <div className="max-w-4xl flex-1 space-y-8">
                    {/* Progress Overview (Mobile/Tablet Top Bar) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="tracking-[0.15em] text-muted-foreground uppercase">
                                Pathway Progress
                            </span>
                            <span className="text-muted-foreground">
                                {Math.round(progressValue)}%
                            </span>
                        </div>
                        <Progress
                            value={progressValue}
                            className="h-1.5 bg-primary/10"
                        />
                    </div>

                    <div className="min-h-[60vh] rounded-3xl border border-border/60 bg-card/30 p-6 sm:p-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
