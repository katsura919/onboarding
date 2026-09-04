"use client"

import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function AdminHeader() {
    const router = useRouter()
    const pathname = usePathname()

    async function handleLogout() {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" })
            if (res.ok) {
                toast.success("Logged out")
                router.push("/admin/login")
                router.refresh()
            } else {
                throw new Error("Logout failed")
            }
        } catch {
            toast.error("Error logging out")
        }
    }

    // The login page has no session to log out of, so it renders its own
    // minimal header instead of this one.
    if (pathname === "/admin/login") return null

    return (
        <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2.5">
                    <img
                        src="/assets/logo.png"
                        alt="Peace-Driven Leader"
                        className="h-7 w-auto shrink-0 object-contain"
                    />
                    <span className="hidden truncate font-serif text-base font-medium tracking-tight text-foreground sm:inline">
                        The Peace-Driven Leader
                    </span>
                    <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Admin
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <ModeToggle />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="h-9 gap-2 rounded-xl px-3 text-xs"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Log out</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
