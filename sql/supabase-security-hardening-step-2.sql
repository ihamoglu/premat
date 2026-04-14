begin;

-- public.documents: keep public read access limited to published rows,
-- but replace unrestricted authenticated write policies with admin-only ones.
drop policy if exists "authenticated_can_manage_documents" on public.documents;
drop policy if exists "admin_can_insert_documents" on public.documents;
drop policy if exists "admin_can_update_documents" on public.documents;
drop policy if exists "admin_can_delete_documents" on public.documents;

create policy "admin_can_insert_documents"
on public.documents
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_update_documents"
on public.documents
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_delete_documents"
on public.documents
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

-- storage.document-covers: public bucket object URLs do not require a broad
-- SELECT/list policy on storage.objects. Drop public listing policies for this
-- bucket, then allow only the admin account to list/upload/update/delete.
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
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_insert_document_covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_update_document_covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'document-covers'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
)
with check (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "admin_can_delete_document_covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'document-covers'
  and name like 'documents/%'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ihamoglu@gmail.com'
);

commit;
