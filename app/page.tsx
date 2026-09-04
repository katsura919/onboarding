import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { ModeToggle } from "@/components/mode-toggle"
import {
    UserCircle,
    HeartPulse,
    ShieldCheck,
    Zap,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const phases = [
    {
        title: "Connection",
        objective: "I feel seen and welcomed.",
        icon: UserCircle,
        desc: "Establish the foundation. Map your neurodiversity and leadership triage.",
        chips: [
            "Foundation Video",
            "Getting to Know You",
            "Your Triage",
            "Schedule Orientation",
        ],
        filled: true,
    },
    {
        title: "Awareness",
        objective: "I see my life clearly now.",
        icon: HeartPulse,
        desc: "360° evaluations and growth inputs to identify historical blocks.",
        chips: ["360° Evaluation", "Growth Inputs", "Evening Pulse"],
        filled: false,
    },
    {
        title: "Stabilization",
        objective: "I am stepping into the life I desire.",
        icon: ShieldCheck,
        desc: "Create your Ideal Day Narrative and activate your family mission.",
        chips: ["Vision Activation", "Vision Statements", "Ideal Day Story"],
        filled: true,
    },
    {
        title: "Activation",
        objective: "I am fully activated and supported.",
        icon: Zap,
        desc: "Full pro-team support and community activation for wealth and legacy.",
        chips: ["Kickstart Call", "Join Telegram", "Wealth Strategy"],
        filled: false,
    },
]

const features = [
    "Personalized at every step",
    "Guided by experts",
    "Track your progress in real-time",
    "Unlock phases as you grow",
    "Built for leaders, not followers",
]

export default function Page() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background font-sans text-foreground">
            {/* Ambient background: gradient + film grain, not a repeating tech pattern */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay"
                    aria-hidden="true"
                >
                    <filter id="grain">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.85"
                            numOctaves="2"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grain)" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
                <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="relative h-9 w-9 md:h-10 md:w-10">
                        <Image
                            src="/assets/logo.png"
                            alt="Peace-Driven Leader Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-serif text-lg font-medium tracking-tight whitespace-nowrap text-foreground md:text-xl">
                        The Peace-Driven Leader
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                    <Link
                        href="/login"
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:text-sm"
                    >
                        Sign In
                    </Link>
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-border bg-secondary/20 text-xs backdrop-blur-sm hover:bg-secondary/30 md:rounded-xl md:text-base"
                        >
                            Join
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-6xl space-y-28 px-4 pt-8 pb-40 md:space-y-36 md:px-6 md:pt-16">
                {/* Hero Section */}
                <section className="mx-auto max-w-3xl animate-in space-y-7 text-center duration-1000 fade-in slide-in-from-bottom-8 md:space-y-9">
                    <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-primary/90 uppercase md:text-xs">
                        <span className="h-px w-6 bg-primary/40" />
                        The Path to Peace-Driven Leadership
                        <span className="h-px w-6 bg-primary/40" />
                    </div>

                    <h1 className="font-serif text-4xl leading-[1.1] font-medium tracking-tight sm:text-6xl md:text-7xl md:leading-[1.05]">
                        Activate Your{" "}
                        <span className="text-primary italic">
                            Inner Mastery
                        </span>
                    </h1>

                    <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        Transition from burnout to breakthrough. Our proprietary
                        pathway maps your Mind, Body, and Divine Identity to
                        establish peace across every domain.
                    </p>

                    <p className="font-serif text-sm text-primary/70 italic md:text-base">
                        &ldquo;You no longer have to carry everything
                        alone.&rdquo;
                    </p>

                    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 pt-2 sm:max-w-none sm:flex-row">
                        <Link href="/login" className="w-full sm:w-auto">
                            <InteractiveHoverButton className="h-12 w-full px-8 text-base md:h-14 md:px-10 md:text-lg">
                                Start Your Pathway
                            </InteractiveHoverButton>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                className="h-12 w-full gap-2 px-6 text-base text-muted-foreground hover:bg-secondary/20 md:h-14 md:px-8 md:text-lg"
                            >
                                Sign In <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Four Phases Section */}
                <section className="space-y-12 md:space-y-16">
                    <div className="mx-auto max-w-xl space-y-3 text-center">
                        <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase md:text-xs">
                            <span className="h-px w-5 bg-border" />
                            The Pathway
                            <span className="h-px w-5 bg-border" />
                        </div>
                        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-5xl">
                            Four Phases to{" "}
                            <span className="text-primary italic">
                                Breakthrough
                            </span>
                        </h2>
                        <p className="text-muted-foreground">
                            A step-by-step evolution designed to deconstruct
                            chaos and rebuild your baseline for sustainable
                            excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6">
                        {phases.map((item, i) => (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-3xl border border-border/60 p-4 transition-all duration-500 sm:p-6 md:p-8 md:hover:-translate-y-1.5 ${
                                    item.filled
                                        ? "bg-primary/[0.06]"
                                        : "bg-card/20"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-3 right-1 font-serif text-7xl font-medium text-primary/[0.06] transition-colors select-none group-hover:text-primary/10 sm:text-8xl md:text-9xl"
                                >
                                    0{i + 1}
                                </span>

                                <div className="relative z-10 space-y-2.5 sm:space-y-3">
                                    <item.icon
                                        className="h-5 w-5 text-primary md:h-6 md:w-6"
                                        strokeWidth={1.5}
                                    />
                                    <h3 className="font-serif text-xl font-medium md:text-2xl">
                                        {item.title}
                                    </h3>
                                    <p className="font-serif text-sm text-primary/80 italic">
                                        &ldquo;{item.objective}&rdquo;
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {item.desc}
                                    </p>
                                    <p className="pt-1 text-[10px] leading-relaxed font-semibold tracking-wide text-muted-foreground/70 uppercase md:text-[11px]">
                                        {item.chips.join("  ·  ")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Journey Section */}
                <section className="space-y-10 md:space-y-14">
                    <div className="space-y-3 text-center">
                        <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase md:text-xs">
                            <span className="h-px w-5 bg-border" />
                            How It Works
                            <span className="h-px w-5 bg-border" />
                        </div>
                        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-5xl">
                            Your{" "}
                            <span className="text-primary italic">Journey</span>
                        </h2>
                    </div>

                    <div className="relative mx-auto max-w-xl">
                        <div className="absolute top-2 bottom-2 left-5 w-px">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/15 to-transparent" />
                            <div className="journey-travel absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_3px_var(--primary)]" />
                        </div>
                        <div className="space-y-9">
                            {phases.map((item, i) => (
                                <div
                                    key={i}
                                    className="relative flex items-start gap-5"
                                >
                                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background font-serif text-sm text-primary">
                                        {i + 1}
                                    </div>
                                    <div className="space-y-1 pt-1.5">
                                        <h4 className="flex items-center gap-2 font-semibold">
                                            <item.icon
                                                className="h-4 w-4 text-primary"
                                                strokeWidth={1.5}
                                            />
                                            {item.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mx-auto max-w-2xl px-4 text-center font-serif text-base leading-relaxed text-muted-foreground italic md:text-lg">
                        {features.map((feature, i) => (
                            <span key={feature}>
                                {feature}
                                {i < features.length - 1 && (
                                    <span className="mx-2.5 text-primary/50 not-italic md:mx-3">
                                        ·
                                    </span>
                                )}
                            </span>
                        ))}
                    </p>
                </section>

                {/* Final CTA */}
                <section className="relative space-y-5 overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/15 via-card/40 to-background p-8 text-center md:space-y-6 md:rounded-[3rem] md:p-24">
                    <div className="relative z-10 space-y-4">
                        <p className="font-serif text-sm text-primary/70 italic md:text-base">
                            &ldquo;We&rsquo;re not rushing. We&rsquo;re
                            aligning.&rdquo;
                        </p>
                        <h2 className="font-serif text-3xl leading-tight font-medium tracking-tight md:text-6xl">
                            Your Legacy Begins{" "}
                            <span className="text-primary italic">
                                with Peace
                            </span>
                            .
                        </h2>
                        <p className="mx-auto max-w-sm text-base text-muted-foreground md:text-lg">
                            The pathway is open. Are you ready to activate your
                            potential?
                        </p>
                        <div className="pt-4 md:pt-6">
                            <Link
                                href="/login"
                                className="inline-block w-full sm:w-auto"
                            >
                                <InteractiveHoverButton className="h-14 w-full px-10 text-lg shadow-2xl shadow-primary/40 sm:w-auto md:h-16 md:px-12 md:text-xl">
                                    Apply to Join
                                </InteractiveHoverButton>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-border/50 px-8 py-14 text-center text-sm">
                <p className="text-muted-foreground">
                    © {new Date().getFullYear()} Minesha. All rights reserved.
                </p>
                <div className="mt-4 flex items-center justify-center gap-6 text-muted-foreground">
                    <Link
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Terms
                    </Link>
                    <Link
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="#"
                        className="transition-colors hover:text-foreground"
                    >
                        Support
                    </Link>
                </div>
            </footer>
        </div>
    )
}
