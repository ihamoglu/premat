begin;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('ihamoglu@gmail.com')
on conflict (email) do nothing;

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_admin_select" on public.admin_users;

create policy "admin_users_admin_select"
on public.admin_users
for select
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = lower(email)
  or lower(coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) = 'admin'
);

create or replace function public.is_premat_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) = 'admin'
    or exists (
      select 1
      from public.admin_users a
      where lower(a.email) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
    );
$$;

revoke all on function public.is_premat_admin() from public;
grant execute on function public.is_premat_admin() to authenticated;

drop policy if exists "documents_anon_select_published" on public.documents;
drop policy if exists "documents_authenticated_select_scope" on public.documents;
drop policy if exists "documents_admin_insert" on public.documents;
drop policy if exists "documents_admin_update" on public.documents;
drop policy if exists "documents_admin_delete" on public.documents;

create policy "documents_anon_select_published"
on public.documents
for select
to anon
using (published = true);

create policy "documents_authenticated_select_scope"
on public.documents
for select
to authenticated
using (published = true or public.is_premat_admin());

create policy "documents_admin_insert"
on public.documents
for insert
to authenticated
with check (public.is_premat_admin());

create policy "documents_admin_update"
on public.documents
for update
to authenticated
using (public.is_premat_admin())
with check (public.is_premat_admin());

create policy "documents_admin_delete"
on public.documents
for delete
to authenticated
using (public.is_premat_admin());

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
      and (d.published = true or public.is_premat_admin())
  )
);

create policy "document_links_admin_insert"
on public.document_links
for insert
to authenticated
with check (public.is_premat_admin());

create policy "document_links_admin_update"
on public.document_links
for update
to authenticated
using (public.is_premat_admin())
with check (public.is_premat_admin());

create policy "document_links_admin_delete"
on public.document_links
for delete
to authenticated
using (public.is_premat_admin());

drop policy if exists "admin_can_read_document_covers" on storage.objects;
drop policy if exists "admin_can_insert_document_covers" on storage.objects;
drop policy if exists "admin_can_update_document_covers" on storage.objects;
drop policy if exists "admin_can_delete_document_covers" on storage.objects;

create policy "admin_can_read_document_covers"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'document-covers'
  and public.is_premat_admin()
);

create policy "admin_can_insert_document_covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'document-covers'
  and (
    name like 'documents/%'
    or name like 'documents/questions/%'
  )
  and public.is_premat_admin()
);

create policy "admin_can_update_document_covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'document-covers'
  and public.is_premat_admin()
)
with check (
  bucket_id = 'document-covers'
  and (
    name like 'documents/%'
    or name like 'documents/questions/%'
  )
  and public.is_premat_admin()
);

create policy "admin_can_delete_document_covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'document-covers'
  and (
    name like 'documents/%'
    or name like 'documents/questions/%'
  )
  and public.is_premat_admin()
);

commit;
