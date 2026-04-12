import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import Link from "next/link"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { ArrowRight, Sparkles, CheckCircle2, Circle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userId = (payload as any).userId

    await connectDB()
    const user = await User.findById(userId)

    if (user && !user.onboardingStatus?.hasSeenCelebration) {
      redirect("/success")
    }
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error
    console.error("Dashboard auth check error:", error)
    redirect("/api/auth/logout")
  }

  // Static state for now
  const progressValue = 20
  const currentPhase = "Connection"
  const nextStep = "Celebration Touchpoint"

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Welcome home, Leader
          </h1>
          <p className="text-muted-foreground text-lg">
            Your journey to a peace-driven leadership begins here.
          </p>
        </div>

        {/* Onboarding Overview Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 relative overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="h-24 w-24" />
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  MVP Activation
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">
                The Peace-Driven Leader<span className="text-primary">™</span> Activation Pathway
              </CardTitle>
              <CardDescription className="text-base">
                Follow this guided journey to activate your peace and stabilize your leadership.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <span className="text-primary">{currentPhase} Phase</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{progressValue}% Complete</span>
                  </span>
                  <span className="text-muted-foreground">Level 1</span>
                </div>
                <Progress value={progressValue} className="h-3 bg-primary/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">COMPLETED</span>
                    <span className="text-sm font-semibold">Payment Received</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 shadow-sm animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Circle className="h-5 w-5 fill-primary/20" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-primary font-bold">NEXT STEP</span>
                    <span className="text-sm font-semibold truncate">{nextStep}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button asChild className="w-full sm:w-auto h-12 px-8 rounded-2xl group transition-all hover:pr-10">
                <Link href="/dashboard/onboarding" className="flex items-center">
                  Resume Journey 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Side Info / Support Card */}
          <Card className="border-border bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Need Support?</CardTitle>
              <CardDescription>
                Your ProTeam is here to help you every step of the way.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground leading-relaxed">
                Whether you have questions about the assessment results or need help stabilizing your rhythm, click below.
              </div>
              <Button variant="outline" className="w-full rounded-xl">
                Message ProTeam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
