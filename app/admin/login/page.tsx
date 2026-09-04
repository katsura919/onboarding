"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Login failed")
            }

            toast.success("Welcome back")
            router.push("/admin")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background px-6">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                        <ShieldCheck
                            className="h-5 w-5 text-primary"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="space-y-1">
                        <h1 className="font-serif text-2xl font-medium tracking-tight">
                            Admin Access
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Restricted to authorized administrators.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8"
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="h-12 border-border/50 bg-secondary"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="h-12 border-border/50 bg-secondary pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword
                                            ? "Hide password"
                                            : "Show password"}
                                    </span>
                                </button>
                            </div>
                        </Field>
                        <Field>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Log in"}
                            </Button>
                        </Field>
                        <Field>
                            <FieldDescription className="text-center">
                                Not an admin?{" "}
                                <Link
                                    href="/login"
                                    className="underline underline-offset-4"
                                >
                                    Go to member sign in
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}
