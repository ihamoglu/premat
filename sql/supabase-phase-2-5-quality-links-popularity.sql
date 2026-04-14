begin;

create table if not exists public.document_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  kind text not null check (kind in ('file', 'solution', 'answer_key', 'video', 'extra')),
  label text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists document_links_document_position_idx
on public.document_links(document_id, position);

grant select on table public.document_links to anon, authenticated;
grant insert, update, delete on table public.document_links to authenticated;

alter table public.document_links enable row level security;

drop policy if exists "document_links_anon_select_published" on public.document_links;
drop policy if exists "document_links_authenticated_select_scope" on public.document_links;
drop policy if exists "document_links_admin_insert" on public.document_links;
drop policy if exists "document_links_admin_update" on public.document_links;
drop policy if exists "document_links_admin_delete" on public.document_links;

create policy "document_links_anon_select_published"
on public.document_links
for select
to anon
using (
  exists (
    select 1
    from public.documents d
    where d.id = document_id
      and d.published = true
  )
);

create policy "document_links_authenticated_select_scope"
on public.document_links
for select
to authenticated
using (
  exists (
    select 1
    from public.documents d
    where d.id = document_id
      and (
        d.published = true
        or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
      )
  )
);

create policy "document_links_admin_insert"
on public.document_links
for insert
to authenticated
with check (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "document_links_admin_update"
on public.document_links
for update
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
)
with check (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "document_links_admin_delete"
on public.document_links
for delete
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create or replace function public.get_public_document_popularity()
returns table(document_id uuid, popularity_score bigint)
language sql
security definer
set search_path = public
as $$
  select
    d.id as document_id,
    coalesce(
      sum(
        case e.event_type
          when 'file_open' then 3
          when 'solution_open' then 2
          when 'answer_key_open' then 2
          when 'collection_add' then 2
          when 'detail_view' then 1
          else 0
        end
      ),
      0
    )::bigint as popularity_score
  from public.documents d
  left join public.document_events e
    on e.document_id = d.id
   and e.created_at >= now() - interval '30 days'
  where d.published = true
  group by d.id
  having coalesce(
    sum(
      case e.event_type
        when 'file_open' then 3
        when 'solution_open' then 2
        when 'answer_key_open' then 2
        when 'collection_add' then 2
        when 'detail_view' then 1
        else 0
      end
    ),
    0
  ) > 0
  order by popularity_score desc
  limit 50;
$$;

revoke all on function public.get_public_document_popularity() from public;
grant execute on function public.get_public_document_popularity() to anon, authenticated;

commit;
