begin;

-- Clean up all legacy/duplicate documents policies reported by Supabase Advisor.
-- Keep one policy per role/action, and wrap auth calls in SELECT for initplan caching.
drop policy if exists "public can read documents" on public.documents;
drop policy if exists "public_can_read_published_documents" on public.documents;
drop policy if exists "only_named_admin_can_manage_documents" on public.documents;
drop policy if exists "authenticated can insert documents" on public.documents;
drop policy if exists "authenticated can update documents" on public.documents;
drop policy if exists "authenticated can delete documents" on public.documents;
drop policy if exists "authenticated_can_manage_documents" on public.documents;
drop policy if exists "admin_can_insert_documents" on public.documents;
drop policy if exists "admin_can_update_documents" on public.documents;
drop policy if exists "admin_can_delete_documents" on public.documents;
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
using (
  published = true
  or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "documents_admin_insert"
on public.documents
for insert
to authenticated
with check (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "documents_admin_update"
on public.documents
for update
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
)
with check (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "documents_admin_delete"
on public.documents
for delete
to authenticated
using (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

-- storage.document-covers: keep public object URL access, but prevent bucket
-- listing through broad storage.objects SELECT policies.
do $$
declare
  target_policy record;
begin
  for target_policy in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd = 'SELECT'
      and policyname not like 'admin_can_%'
      and (
        policyname ilike '%document%cover%'
        or coalesce(qual, '') ilike '%document-covers%'
      )
  loop
    execute format(
      'drop policy if exists %I on storage.objects',
      target_policy.policyname
    );
  end loop;
end $$;

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
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_insert_document_covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_update_document_covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'document-covers'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
)
with check (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_delete_document_covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

-- Cover FK used by collection item joins/deletes.
create index if not exists document_collection_items_document_id_idx
on public.document_collection_items(document_id);

-- Advisor may flag a brand-new index as unused until production traffic touches it.
-- Drop the earlier composite event index that Advisor reported as unused, but keep
-- a document_id FK index so document deletes/cascades stay efficient.
drop index if exists public.document_events_document_type_created_idx;

create index if not exists document_events_document_id_idx
on public.document_events(document_id);

commit;
