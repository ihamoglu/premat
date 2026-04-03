begin;

grant usage on schema public to anon, authenticated;

grant select on table public.documents to anon;
grant select, insert, update, delete on table public.documents to authenticated;

revoke insert, update, delete on table public.documents from anon;

alter table public.documents enable row level security;

drop policy if exists "public_can_read_published_documents" on public.documents;
drop policy if exists "authenticated_can_manage_documents" on public.documents;

create policy "public_can_read_published_documents"
on public.documents
for select
to anon, authenticated
using (published = true);

create policy "authenticated_can_manage_documents"
on public.documents
for all
to authenticated
using (true)
with check (true);

commit;