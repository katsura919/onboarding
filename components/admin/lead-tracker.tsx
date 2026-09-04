"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Lead, LeadStatus } from "@/lib/db/leads"

const STATUS_LABELS: Record<LeadStatus, string> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    won: "Won",
    lost: "Lost",
}

const STATUS_BADGE_STYLES: Record<LeadStatus, string> = {
    new: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    contacted: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    qualified: "border-violet-500/20 bg-violet-500/10 text-violet-600",
    won: "border-green-500/20 bg-green-500/10 text-green-600",
    lost: "border-destructive/20 bg-destructive/10 text-destructive",
}

const EMPTY_FORM = { name: "", email: "", phone: "", source: "", notes: "" }

export function LeadTracker({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState(initialLeads)
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [isCreating, setIsCreating] = useState(false)

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name.trim()) {
            toast.error("Name is required")
            return
        }

        setIsCreating(true)
        try {
            const res = await fetch("/api/admin/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to add lead")
            }

            setLeads((prev) => [data.lead, ...prev])
            setForm(EMPTY_FORM)
            setShowForm(false)
            toast.success("Lead added")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsCreating(false)
        }
    }

    async function patchLead(
        id: string,
        body: Partial<Pick<Lead, "status" | "notes">>,
        successMessage?: string
    ) {
        setPendingId(id)
        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to update lead")
            }

            setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, ...body } : l))
            )
            if (successMessage) toast.success(successMessage)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPendingId(null)
        }
    }

    async function handleDelete(id: string) {
        setPendingId(id)
        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to delete lead")
            }

            setLeads((prev) => prev.filter((l) => l.id !== id))
            toast.success("Lead removed")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPendingId(null)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
                <div>
                    <h2 className="font-serif text-lg font-medium">
                        Lead Tracker
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Prospects who haven&apos;t signed up yet. Track them
                        through the pipeline.
                    </p>
                </div>
                <Button
                    variant={showForm ? "outline" : "default"}
                    size="sm"
                    onClick={() => setShowForm((v) => !v)}
                    className="h-9 rounded-xl px-4 text-xs"
                >
                    {showForm ? (
                        <>
                            <X className="h-3.5 w-3.5" /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5" /> Add Lead
                        </>
                    )}
                </Button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="grid gap-3 border-b border-border/50 bg-primary/[0.02] px-6 py-5 sm:grid-cols-2 lg:grid-cols-5"
                >
                    <Input
                        placeholder="Name *"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Source (e.g. Instagram)"
                        value={form.source}
                        onChange={(e) =>
                            setForm({ ...form, source: e.target.value })
                        }
                    />
                    <div className="flex gap-2">
                        <Input
                            placeholder="Notes"
                            value={form.notes}
                            onChange={(e) =>
                                setForm({ ...form, notes: e.target.value })
                            }
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isCreating}
                            className="h-9 shrink-0 rounded-xl px-4 text-xs"
                        >
                            {isCreating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {leads.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                    No leads yet. Add your first prospect above.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Notes</th>
                                <th className="px-6 py-3">Added</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => {
                                const isPending = pendingId === lead.id

                                return (
                                    <tr
                                        key={lead.id}
                                        className="border-b border-border/50 last:border-0"
                                    >
                                        <td className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {lead.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            <div className="flex flex-col">
                                                {lead.email && (
                                                    <span>{lead.email}</span>
                                                )}
                                                {lead.phone && (
                                                    <span>{lead.phone}</span>
                                                )}
                                                {!lead.email && !lead.phone && (
                                                    <span>-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            {lead.source || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={lead.status}
                                                disabled={isPending}
                                                onChange={(e) =>
                                                    patchLead(
                                                        lead.id,
                                                        {
                                                            status: e.target
                                                                .value as LeadStatus,
                                                        },
                                                        "Lead status updated"
                                                    )
                                                }
                                                className={cn(
                                                    "rounded-full border px-2.5 py-1 text-xs font-bold outline-none disabled:opacity-50",
                                                    STATUS_BADGE_STYLES[
                                                        lead.status
                                                    ]
                                                )}
                                            >
                                                {(
                                                    Object.keys(
                                                        STATUS_LABELS
                                                    ) as LeadStatus[]
                                                ).map((value) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {STATUS_LABELS[value]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="max-w-[16rem] px-6 py-4">
                                            <input
                                                type="text"
                                                defaultValue={lead.notes ?? ""}
                                                disabled={isPending}
                                                placeholder="-"
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value || null
                                                    if (
                                                        value ===
                                                        (lead.notes ?? null)
                                                    )
                                                        return
                                                    patchLead(lead.id, {
                                                        notes: value,
                                                    })
                                                }}
                                                className="w-full rounded-lg border border-transparent bg-transparent px-1 py-1 text-xs outline-none hover:border-border/50 focus:border-border/50 disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            {new Date(
                                                lead.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                disabled={isPending}
                                                onClick={() =>
                                                    handleDelete(lead.id)
                                                }
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                {isPending ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
