"use client"
import { Phone, Users, Wallet, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Phase4Props {
    currentStep: string
    formData: any
    setFormData: (data: any) => void
}

export function Phase4Activation({
    currentStep,
    formData,
    setFormData,
}: Phase4Props) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
            {currentStep === "4A" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[2.5rem] border border-white/10 bg-neutral-900 p-8 text-neutral-50 duration-700 fade-in sm:p-10">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                        <Phone
                            className="h-6 w-6 text-primary"
                            strokeWidth={1.5}
                        />
                        <div>
                            <h2 className="font-serif text-2xl font-medium">
                                The Kickstart Call
                            </h2>
                            <p className="text-xs font-semibold tracking-[0.15em] text-primary/70 uppercase">
                                Ground Rules & Milestones
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="leading-relaxed text-neutral-300">
                            This is where the transformation truly begins. In
                            this session, we will establish the "Rules of the
                            Game," unlock your first major rewards, and set the
                            milestones that will track your progress.
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-4">
                                <CheckCircle2
                                    className="h-4 w-4 text-primary"
                                    strokeWidth={1.5}
                                />
                                <span className="text-sm">
                                    Personal Roadmap
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-4">
                                <CheckCircle2
                                    className="h-4 w-4 text-primary"
                                    strokeWidth={1.5}
                                />
                                <span className="text-sm">
                                    First Milestone Unlocked
                                </span>
                            </div>
                        </div>

                        <Button
                            className="group h-14 w-full rounded-full text-base font-medium"
                            onClick={() =>
                                window.open(
                                    "https://calendly.com/minesha-kickoff",
                                    "_blank"
                                )
                            }
                        >
                            Book Your Kickstart Call
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            )}

            {currentStep === "4B" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[2.5rem] border border-white/10 bg-neutral-900 p-8 text-neutral-50 duration-700 fade-in sm:p-10">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                        <Users
                            className="h-6 w-6 text-primary"
                            strokeWidth={1.5}
                        />
                        <div>
                            <h2 className="font-serif text-2xl font-medium">
                                Community Portal
                            </h2>
                            <p className="text-xs font-semibold tracking-[0.15em] text-primary/70 uppercase">
                                Join the Telegram Collective
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="leading-relaxed text-neutral-300">
                            You are no longer carrying this weight alone. Join
                            our private Telegram collective to connect with
                            other Peace-Driven Leaders, share breakthroughs, and
                            receive daily encouragement from the ProTeam.
                        </p>

                        <Button
                            variant="secondary"
                            className="group h-14 w-full rounded-full text-base font-medium"
                            onClick={() =>
                                window.open(
                                    "https://t.me/minesha_leaders",
                                    "_blank"
                                )
                            }
                        >
                            Connect to Telegram
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>

                        <div className="flex items-start gap-3 border-t border-white/10 pt-2">
                            <span className="mt-0.5 font-serif text-primary italic">
                                ✦
                            </span>
                            <p className="text-xs leading-relaxed text-neutral-400">
                                Tip: After joining, introduce yourself and share
                                your "Word of the Year" from the previous phase!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "4C" && (
                <div className="w-full max-w-2xl animate-in space-y-8 rounded-[2.5rem] border border-border/60 bg-card/40 p-8 text-center duration-700 fade-in sm:p-10">
                    <Wallet
                        className="mx-auto h-8 w-8 text-primary"
                        strokeWidth={1.5}
                    />

                    <div className="space-y-3">
                        <h2 className="font-serif text-2xl font-medium">
                            Financial Alignment
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Your wealth strategist is ready to help you align
                            your cash, credit, and investments with your new
                            state of peace.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            className="group h-14 w-full rounded-full text-base font-medium"
                            onClick={() =>
                                window.open(
                                    "https://calendly.com/minesha-wealth",
                                    "_blank"
                                )
                            }
                        >
                            Schedule Wealth Strategist Call
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                            This is the final step of your activation pathway.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
