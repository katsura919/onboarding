"use client"
import {
    ArrowRight,
    ShieldCheck,
    Heart,
    Sparkles,
    Home,
    Users,
    Compass,
    Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuditQuestion {
    field: string
    question: string
    helper: string
}

interface AuditFieldProps extends Omit<Phase1Props, "currentStep"> {
    q: AuditQuestion
}

function AuditField({ q, formData, setFormData }: AuditFieldProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-bold tracking-wide uppercase">
                {q.question}
            </p>
            <p className="text-sm text-muted-foreground italic">{q.helper}</p>
            <textarea
                value={formData[q.field] || ""}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        [q.field]: e.target.value,
                    })
                }
                className="min-h-[100px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-base transition-all outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Share your thoughts..."
            />
        </div>
    )
}

interface Phase1Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

export function Phase1Connection({
    currentStep,
    formData,
    setFormData,
}: Phase1Props) {
    return (
        <div className="min-h-[40vh]">
            {currentStep === "1A" && (
                <div className="animate-in space-y-10 duration-1000 fade-in slide-in-from-bottom-4">
                    {/* Narrative Section */}
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="space-y-3">
                            <Heart
                                className="h-5 w-5 text-primary"
                                strokeWidth={1.5}
                            />
                            <h2 className="font-serif text-2xl font-medium">
                                Human-First Leadership
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                In this phase, we move beyond metrics. We want
                                to understand the heartbeat of your leadership.
                                Who you are when the pressure is off.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <ShieldCheck
                                className="h-5 w-5 text-primary"
                                strokeWidth={1.5}
                            />
                            <h2 className="font-serif text-2xl font-medium">
                                Extreme Privacy
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Everything shared here is encrypted and
                                accessible only to your dedicated Activation
                                Team. This is your safe harbor.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "1B" && (
                <div className="max-w-2xl animate-in space-y-8 px-1 duration-700 fade-in">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Your Primary Role & Responsibility
                            </label>
                            <textarea
                                value={formData.snapshot_1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        snapshot_1: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="What is your current focus?"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Current Challenges
                            </label>
                            <textarea
                                value={formData.snapshot_2}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        snapshot_2: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="What's been feeling heavy lately?"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold tracking-wider text-primary uppercase">
                                Desired Outcomes
                            </label>
                            <textarea
                                value={formData.snapshot_3}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        snapshot_3: e.target.value,
                                    })
                                }
                                className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background p-4 text-lg transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="What does 'stabilized' look like for you?"
                            />
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "1C" && (
                <div className="max-w-4xl animate-in space-y-10 duration-700 fade-in">
                    <div className="grid gap-8">
                        {/* Mind */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Sparkles
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Mind (The Wiring)
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* PDL Score */}
                                <div className="flex flex-col gap-6 border-b border-primary/10 pb-6 md:flex-row md:items-end">
                                    <div className="flex-1 space-y-3">
                                        <p className="text-sm font-bold tracking-wide uppercase">
                                            PDL Leader Score
                                        </p>
                                        <a
                                            href="https://docs.google.com/document/d/1iYCURCTSHcaqVVYYyfa_iz9RkNsF1FRRFoTnMoCMWxE/edit?usp=sharing"
                                            target="_blank"
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            Open PDL Assessment Doc{" "}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                    <div className="w-full md:w-48">
                                        <input
                                            type="text"
                                            value={formData.triage_pdl}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    triage_pdl: e.target.value,
                                                })
                                            }
                                            placeholder="Your Score"
                                            className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Neurodiversity */}
                                <div className="flex flex-col gap-6 border-b border-primary/10 pb-6 md:flex-row md:items-end">
                                    <div className="flex-1 space-y-3">
                                        <p className="text-sm font-bold tracking-wide uppercase">
                                            High Functioning Neurodiversity
                                        </p>
                                        <a
                                            href="https://exceptionalindividuals.com/neurodiversity/"
                                            target="_blank"
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            Take Neurodiversity Test{" "}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                    <div className="w-full md:w-48">
                                        <input
                                            type="text"
                                            value={formData.triage_neuro}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    triage_neuro:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Result Summary"
                                            className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                {/* Internal Wiring */}
                                <div className="space-y-3">
                                    <p className="text-sm font-bold tracking-wide uppercase">
                                        Internal Wiring (CliftonStrengths /
                                        Human Design)
                                    </p>
                                    <input
                                        type="text"
                                        value={formData.triage_wiring}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                triage_wiring: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your strengths or design profile..."
                                        className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Heart
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Body (The Interaction)
                                </h3>
                            </div>

                            <div className="flex flex-col gap-6 md:flex-row md:items-end">
                                <div className="flex-1 space-y-3">
                                    <p className="text-sm font-bold tracking-wide uppercase">
                                        DiSC Assessment
                                    </p>
                                    <a
                                        href="https://discpersonalitytesting.com/free-disc-test/"
                                        target="_blank"
                                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                    >
                                        Start Free DiSC Test{" "}
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </a>
                                </div>
                                <div className="w-full md:w-48">
                                    <input
                                        type="text"
                                        value={formData.triage_disc}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                triage_disc: e.target.value,
                                            })
                                        }
                                        placeholder="Your Result"
                                        className="w-full rounded-xl border-2 border-border/50 bg-background p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "1D" && (
                <div className="max-w-3xl animate-in space-y-8 duration-700 fade-in">
                    <div className="space-y-8 rounded-[2.5rem] border border-primary/20 bg-primary/[0.03] p-8 sm:p-10">
                        <div className="space-y-4">
                            <h2 className="font-serif text-2xl font-medium italic">
                                "Before we meet, is there anything on your
                                heart, your mind, or your plate that you want me
                                to be aware of?"
                            </h2>
                            <p className="text-lg text-muted-foreground italic">
                                Nothing is too BIG or small for us to hold.
                            </p>
                        </div>
                        <textarea
                            value={formData.open_share}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    open_share: e.target.value,
                                })
                            }
                            className="min-h-[300px] w-full rounded-3xl border-2 border-border/50 bg-background/50 p-6 font-serif text-xl leading-relaxed transition-all outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="Share your thoughts here..."
                        />
                    </div>
                </div>
            )}

            {currentStep === "1E" && (
                <div className="mx-auto max-w-4xl animate-in space-y-12 duration-700 fade-in">
                    <div className="grid grid-cols-1 gap-10">
                        {[
                            {
                                title: "Mission & Vision",
                                id: "ft9eAypjpac",
                                icon: <Sparkles className="h-4 w-4" />,
                            },
                            {
                                title: "Our Culture",
                                id: "G-IJMF9WN6I",
                                icon: <Heart className="h-4 w-4" />,
                            },
                            {
                                title: "Signature Key Terms",
                                id: "b75eF1j3BdE",
                                icon: <ShieldCheck className="h-4 w-4" />,
                            },
                        ].map((video) => (
                            <div key={video.id} className="space-y-4">
                                <div className="relative aspect-video overflow-hidden rounded-sm border border-primary/10 bg-neutral-900 shadow-2xl">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.id}`}
                                        className="absolute inset-0 h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <h3 className="flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
                                    {video.icon}
                                    {video.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 rounded-[2.5rem] border border-primary/20 bg-primary/[0.03] p-8 sm:p-10">
                        <div className="space-y-3">
                            <h3 className="font-serif text-2xl font-medium text-primary italic">
                                "What resonated most with you?"
                            </h3>
                            <p className="text-muted-foreground">
                                Jot down any thoughts, breakthroughs, or
                                questions that surfaced while watching.
                            </p>
                        </div>
                        <textarea
                            value={formData.culture_takeaways}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    culture_takeaways: e.target.value,
                                })
                            }
                            className="min-h-[150px] w-full rounded-2xl border-2 border-border/50 bg-background/50 p-6 font-serif text-lg italic transition-all outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Your takeaways..."
                        />
                    </div>
                </div>
            )}

            {currentStep === "1G" && (
                <div className="flex animate-in flex-col items-center justify-center space-y-8 py-20 text-center duration-700 fade-in">
                    <span className="font-serif text-4xl text-primary italic">
                        ✦
                    </span>
                    <div className="max-w-lg space-y-4">
                        <h2 className="font-serif text-3xl font-medium">
                            Divine Identity Uncovered
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            This reveals your Divine Identity, The Real You,
                            uncovered from the weight of past experiences and
                            the noise of your present reality.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="group h-14 rounded-full px-10 text-base font-medium"
                    >
                        <a
                            href="https://giftstest.com/?utm_source=chatgpt.com"
                            target="_blank"
                            className="flex items-center gap-2"
                        >
                            Book Your 1:1 Orientation Call
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </div>
            )}

            {currentStep === "1F" && (
                <div className="max-w-4xl animate-in space-y-10 duration-700 fade-in">
                    <div className="space-y-3">
                        <h2 className="font-serif text-2xl font-medium italic">
                            Your Peace-Driven Home Audit
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">
                            An honest look at where things stand today, not the
                            highlight reel, not the ideal version. Just the
                            truth of your home, right now.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {/* Chaos + Overwhelm Awareness */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Home
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Chaos + Overwhelm Awareness
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        field: "homeAudit_chaos",
                                        question:
                                            "1. What currently feels the most out of control in your home right now?",
                                        helper: "Where is the loudest chaos?",
                                    },
                                    {
                                        field: "homeAudit_overwhelmTime",
                                        question:
                                            "2. When during the day do you feel the most overwhelmed, and what is happening at that time?",
                                        helper: "Find the pressure points.",
                                    },
                                    {
                                        field: "homeAudit_invisibleLabor",
                                        question:
                                            "3. What are the 3–5 things you're mentally tracking every day that no one else is helping with?",
                                        helper: "This reveals invisible labor.",
                                    },
                                    {
                                        field: "homeAudit_90DayCost",
                                        question:
                                            "4. If nothing changed, what would your home feel like 90 days from now?",
                                        helper: "Helps her confront the cost of staying stuck.",
                                    },
                                ].map((q) => (
                                    <AuditField
                                        key={q.field}
                                        q={q}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Systems + Structure Awareness */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Compass
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Systems + Structure Awareness
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        field: "homeAudit_routines",
                                        question:
                                            "5. What routines currently exist in your home (morning, after school, bedtime), and are they actually followed?",
                                        helper: "Honest audit, not ideal version.",
                                    },
                                    {
                                        field: "homeAudit_breakdownAreas",
                                        question:
                                            "6. Where do things tend to pile up or break down the most?",
                                        helper: "Laundry, dishes, backpacks, paperwork, schedules, etc.",
                                    },
                                    {
                                        field: "homeAudit_assumedResponsibilities",
                                        question:
                                            '7. What responsibilities are clearly assigned, and what is just "assumed" you will handle?',
                                        helper: "This is where resentment lives.",
                                    },
                                ].map((q) => (
                                    <AuditField
                                        key={q.field}
                                        q={q}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Leadership + Family Alignment */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Users
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Leadership + Family Alignment
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        field: "homeAudit_familyWord",
                                        question:
                                            "8. If your family had to describe how the home runs right now in one word, what would it be?",
                                        helper: "Chaos, rushed, reactive, peaceful, structured, etc.",
                                    },
                                    {
                                        field: "homeAudit_ownVsDirect",
                                        question:
                                            "9. What do your kids (and/or partner) currently own vs. what do they wait for you to direct?",
                                        helper: "Dependency vs. leadership culture.",
                                    },
                                    {
                                        field: "homeAudit_overFunctioning",
                                        question:
                                            "10. Where are you over-functioning, and where should you actually be leading instead of doing?",
                                        helper: "",
                                    },
                                ].map((q) => (
                                    <AuditField
                                        key={q.field}
                                        q={q}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Clarity + Vision Reset */}
                        <div className="space-y-6 rounded-3xl border border-border/60 p-6 sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                <Sparkles
                                    className="h-5 w-5 text-primary"
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-serif text-xl font-medium">
                                    Clarity + Vision Reset
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        field: "homeAudit_peacefulVision",
                                        question:
                                            '11. What would a "peaceful and well-run home" actually look like for YOU, not Instagram?',
                                        helper: "Define your version of peace.",
                                    },
                                    {
                                        field: "homeAudit_oneSystemFix",
                                        question:
                                            "12. If you could fix just ONE system this week that would make everything feel lighter, what would it be?",
                                        helper: "This creates immediate traction.",
                                    },
                                ].map((q) => (
                                    <AuditField
                                        key={q.field}
                                        q={q}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step towards Embodiment */}
                    <div className="space-y-6 rounded-[2.5rem] border border-primary/20 bg-primary/[0.03] p-8 sm:p-10">
                        <div className="flex items-center gap-3">
                            <Flame
                                className="h-5 w-5 text-primary"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm font-bold tracking-wider text-primary uppercase">
                                Step Towards Embodiment
                            </p>
                        </div>
                        <h2 className="font-serif text-2xl font-medium italic">
                            &ldquo;What&apos;s one small change you are willing
                            to commit to this week to move your home toward
                            peace?&rdquo;
                        </h2>
                        <textarea
                            value={formData.homeAudit_commitment || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    homeAudit_commitment: e.target.value,
                                })
                            }
                            className="min-h-[120px] w-full rounded-2xl border-2 border-border/50 bg-background/50 p-6 font-serif text-lg leading-relaxed transition-all outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="This week, I commit to..."
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
