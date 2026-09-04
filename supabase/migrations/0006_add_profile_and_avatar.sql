-- Member self-service profile: physical stats, apparel sizing, and a
-- health snapshot the styling/support team can reference. Same access
-- model as the rest of `users` — service role only, RLS locked down.
alter table public.users
    add column if not exists profile jsonb not null default '{}'::jsonb,
    add column if not exists avatar_url text;

-- Public bucket so avatar images can be shown via a plain public URL;
-- uploads still only ever go through the server-side service role key.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
