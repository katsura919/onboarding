import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Ambient glow, matched to the marketing page — no repeating tech pattern */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-40 -right-24 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[130px]" />
                <div className="absolute top-[60%] -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/[0.06] blur-[150px]" />
            </div>

            <DashboardHeader />
            <main className="relative z-10 pt-16">{children}</main>
        </div>
    )
}
