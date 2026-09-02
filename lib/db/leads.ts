import { getSupabase } from "@/lib/supabase"

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost"

export interface Lead {
    id: string
    name: string
    email: string | null
    phone: string | null
    source: string | null
    status: LeadStatus
    notes: string | null
    createdAt: string
    updatedAt: string
}

type LeadRow = {
    id: string
    name: string
    email: string | null
    phone: string | null
    source: string | null
    status: LeadStatus
    notes: string | null
    created_at: string
    updated_at: string
}

const SELECT_COLUMNS =
    "id, name, email, phone, source, status, notes, created_at, updated_at"

function toLead(row: LeadRow): Lead {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        source: row.source,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

/**
 * Pipeline for the /admin Lead Tracker tab: newest first.
 */
export async function listLeads(): Promise<Lead[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("leads")
        .select(SELECT_COLUMNS)
        .order("created_at", { ascending: false })

    if (error) throw error
    return (data ?? []).map((row) => toLead(row as unknown as LeadRow))
}

export async function createLead(input: {
    name: string
    email?: string | null
    phone?: string | null
    source?: string | null
    notes?: string | null
}): Promise<Lead> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("leads")
        .insert({
            name: input.name,
            email: input.email ?? null,
            phone: input.phone ?? null,
            source: input.source ?? null,
            notes: input.notes ?? null,
        })
        .select(SELECT_COLUMNS)
        .single()

    if (error) throw error
    return toLead(data as unknown as LeadRow)
}

export async function updateLead(
    id: string,
    input: {
        name?: string
        email?: string | null
        phone?: string | null
        source?: string | null
        status?: LeadStatus
        notes?: string | null
    }
): Promise<Lead | null> {
    const supabase = getSupabase()
    const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    }
    if (input.name !== undefined) payload.name = input.name
    if (input.email !== undefined) payload.email = input.email
    if (input.phone !== undefined) payload.phone = input.phone
    if (input.source !== undefined) payload.source = input.source
    if (input.status !== undefined) payload.status = input.status
    if (input.notes !== undefined) payload.notes = input.notes

    const { data, error } = await supabase
        .from("leads")
        .update(payload)
        .eq("id", id)
        .select(SELECT_COLUMNS)
        .maybeSingle()

    if (error) throw error
    return data ? toLead(data as unknown as LeadRow) : null
}

export async function deleteLead(id: string): Promise<void> {
    const supabase = getSupabase()
    const { error } = await supabase.from("leads").delete().eq("id", id)
    if (error) throw error
}
