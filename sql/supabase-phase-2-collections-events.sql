begin;

create table if not exists public.document_collections (
  id uuid primary key default gen_random_uuid(),
  public_slug text not null unique,
  title text not null default 'Çalışma Listem',
  description text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  is_public boolean not null default true
);

create table if not exists public.document_collection_items (
  collection_id uuid not null references public.document_collections(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, document_id)
);

create table if not exists public.document_events (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'detail_view',
      'file_open',
      'solution_open',
      'answer_key_open',
      'collection_add'
    )
  ),
  created_at timestamptz not null default now(),
  user_agent_hash text
);

create index if not exists document_collections_public_slug_idx
on public.document_collections(public_slug);

create index if not exists document_collection_items_collection_position_idx
on public.document_collection_items(collection_id, position);

create index if not exists document_events_document_type_created_idx
on public.document_events(document_id, event_type, created_at desc);

grant select, insert on table public.document_collections to anon, authenticated;
grant select, insert on table public.document_collection_items to anon, authenticated;
grant insert on table public.document_events to anon, authenticated;
grant select on table public.document_events to authenticated;

alter table public.document_collections enable row level security;
alter table public.document_collection_items enable row level security;
alter table public.document_events enable row level security;

drop policy if exists "public_can_read_public_collections" on public.document_collections;
drop policy if exists "public_can_create_public_collections" on public.document_collections;
drop policy if exists "public_can_read_public_collection_items" on public.document_collection_items;
drop policy if exists "public_can_create_collection_items" on public.document_collection_items;
drop policy if exists "public_can_create_document_events" on public.document_events;
drop policy if exists "authenticated_can_read_document_events" on public.document_events;

create policy "public_can_read_public_collections"
on public.document_collections
for select
to anon, authenticated
using (
  is_public = true
  and (expires_at is null or expires_at > now())
);

create policy "public_can_create_public_collections"
on public.document_collections
for insert
to anon, authenticated
with check (is_public = true);

create policy "public_can_read_public_collection_items"
on public.document_collection_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.document_collections c
    where c.id = collection_id
      and c.is_public = true
      and (c.expires_at is null or c.expires_at > now())
  )
);

create policy "public_can_create_collection_items"
on public.document_collection_items
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.document_collections c
    where c.id = collection_id
      and c.is_public = true
  )
  and exists (
    select 1
    from public.documents d
    where d.id = document_id
      and d.published = true
  )
);

create policy "public_can_create_document_events"
on public.document_events
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.documents d
    where d.id = document_id
      and d.published = true
  )
);

create policy "authenticated_can_read_document_events"
on public.document_events
for select
to authenticated
using (true);

commit;
