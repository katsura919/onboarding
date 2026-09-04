import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, listUsers } from "@/lib/db/users"
import { listLeads } from "@/lib/db/leads"
import { AdminUsersTable } from "@/components/admin/users-table"
import { LeadTracker } from "@/components/admin/lead-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function AdminPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        redirect("/login")
    }

    let userId: string
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        )
        userId = (payload as any).userId
    } catch {
        redirect("/login")
    }

    const viewer = await findUserById(userId)
    if (!viewer) {
        redirect("/api/auth/logout")
    }
    if (!viewer.isActive) {
        redirect("/api/auth/logout")
    }
    if (!viewer.isAdmin) {
        redirect("/dashboard")
    }

    const [users, leads] = await Promise.all([listUsers(), listLeads()])

    return (
        <div className="container mx-auto max-w-7xl animate-in p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-2">
                    <div className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        <span className="h-px w-5 bg-border" />
                        Admin
                    </div>
                    <h1 className="font-serif text-3xl font-medium tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        {users.length} {users.length === 1 ? "user" : "users"}{" "}
                        signed up · {leads.length}{" "}
                        {leads.length === 1 ? "lead" : "leads"} in the pipeline.
                    </p>
                </div>

                <Tabs defaultValue="users" orientation="vertical">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="leads">Lead Tracker</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <div className="rounded-3xl border border-border/60 bg-card/40">
                            <div className="border-b border-border/50 px-6 py-5">
                                <h2 className="font-serif text-lg font-medium">
                                    All Users
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Every signup, where they are in the
                                    Activation Pathway, and whether their
                                    account is active.
                                </p>
                            </div>
                            <AdminUsersTable
                                initialUsers={users}
                                viewerId={viewer.id}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="leads">
                        <div className="rounded-3xl border border-border/60 bg-card/40">
                            <LeadTracker initialLeads={leads} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
