"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Heart } from "lucide-react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { toast } from "sonner"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

export default function SuccessPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const confettiRef = useRef<ConfettiRef>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      confettiRef.current?.fire({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#d6b56c", "#f1ddb0", "#173029"], // Forest & Gold theme
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  async function handleBegin() {
    setIsStarting(true)
    try {
      const res = await fetch("/api/onboarding/complete-celebration", {
        method: "POST",
      })

      if (res.ok) {
        toast.success("Welcome aboard, Leader.")
        router.push("/dashboard")
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast.error("Process interrupted. Redirecting...")
      router.push("/dashboard")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4 overflow-hidden">
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 h-full w-full"
        options={{
          get particleCount() {
            return Math.floor(Math.random() * 50) + 50
          },
        }}
      />
      
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* Lottie Placeholder Container */}
        <div className="relative mx-auto w-64 h-64 bg-primary/5 rounded-full flex items-center justify-center border-4 border-dashed border-primary/20 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center text-primary/30 text-sm font-medium animate-pulse text-center p-4">
             [Lottie Animation Placeholder]
             <br />
             (Celebratory Confetti & Support)
          </div>
          <Sparkles className="h-12 w-12 text-primary absolute -top-4 -right-4 animate-bounce" />
          <Heart className="h-10 w-10 text-primary/40 absolute -bottom-4 -left-4 animate-pulse" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 drop-shadow-sm">
            Welcome Home!
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic">
            "I’m truly so glad you’re here."
          </p>
          <div className="max-w-md mx-auto text-muted-foreground leading-relaxed">
            You’ve made a beautiful decision. From this moment forward, you do not have to carry everything alone. You’ve partnered with a team ready to help you thrive.
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center">
          <InteractiveHoverButton
            onClick={handleBegin}
            disabled={isStarting}
            className="h-16 px-12 text-xl border-primary/30 bg-card/50 backdrop-blur-xl shadow-2xl hover:border-primary transition-all"
          >
            {isStarting ? "Activating..." : "Begin Activation Pathway"}
          </InteractiveHoverButton>
          <p className="mt-6 text-sm text-muted-foreground uppercase tracking-[0.3em] font-light flex items-center justify-center gap-1">
            The Peace-Driven Leader<span className="text-primary font-bold">™</span>
          </p>
        </div>
      </div>
    </div>
  )
}
