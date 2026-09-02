-- Lead Tracker: prospects who haven't signed up yet, tracked separately
-- from the `users` table (which is signed-up, paying/trial accounts in
-- the Activation Pathway). Same access model as `users`: read/written
-- only via the server-side service role key from /admin, so RLS is left
-- enabled with no policies.

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text,
    phone text,
    source text,
    status text not null default 'new',
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.leads
    add constraint leads_status_check
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost'));

alter table public.leads enable row level security;
