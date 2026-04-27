create table if not exists public.exam_countdowns (
  exam_key text primary key check (exam_key in ('lgs', 'yks')),
  label text not null,
  exam_at timestamptz not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.exam_countdowns enable row level security;

drop policy if exists "Public can read active exam countdowns" on public.exam_countdowns;
drop policy if exists "Admin can read exam countdowns" on public.exam_countdowns;
drop policy if exists "Admin can insert exam countdowns" on public.exam_countdowns;
drop policy if exists "Admin can update exam countdowns" on public.exam_countdowns;

create policy "Public can read active exam countdowns"
on public.exam_countdowns
for select
using (active = true);

create policy "Admin can read exam countdowns"
on public.exam_countdowns
for select
to authenticated
using (lower(auth.jwt() ->> 'email') = 'ihamoglu@gmail.com');

create policy "Admin can insert exam countdowns"
on public.exam_countdowns
for insert
to authenticated
with check (lower(auth.jwt() ->> 'email') = 'ihamoglu@gmail.com');

create policy "Admin can update exam countdowns"
on public.exam_countdowns
for update
to authenticated
using (lower(auth.jwt() ->> 'email') = 'ihamoglu@gmail.com')
with check (lower(auth.jwt() ->> 'email') = 'ihamoglu@gmail.com');

insert into public.exam_countdowns (exam_key, label, exam_at, active)
values
  ('lgs', 'LGS', '2026-06-13T09:30:00+03:00', true),
  ('yks', 'YKS', '2026-06-20T10:15:00+03:00', true)
on conflict (exam_key) do update
set
  label = excluded.label,
  exam_at = excluded.exam_at,
  active = excluded.active,
  updated_at = now();
