begin;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  grade text not null check (grade in ('5', '6', '7', '8')),
  topic text not null,
  subtopic text,
  curriculum_code text,
  difficulty text check (difficulty in ('Başlangıç', 'Orta', 'İleri', 'Karma')),
  question_text text not null,
  question_image_url text,
  solution_text text,
  solution_video_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  text text not null,
  image_url text,
  is_correct boolean not null default false
);

create table if not exists public.question_sets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  grade text not null check (grade in ('5', '6', '7', '8')),
  topic text not null,
  difficulty text check (difficulty in ('Başlangıç', 'Orta', 'İleri', 'Karma')),
  duration_minutes integer,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.question_set_items (
  question_set_id uuid not null references public.question_sets(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position integer not null default 0,
  primary key (question_set_id, question_id)
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  question_set_id uuid not null references public.question_sets(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  correct_count integer,
  wrong_count integer,
  blank_count integer
);

create table if not exists public.test_attempt_answers (
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  primary key (attempt_id, question_id)
);

create index if not exists questions_grade_topic_idx
on public.questions(grade, topic);

create index if not exists question_options_question_id_idx
on public.question_options(question_id);

create index if not exists question_sets_published_grade_topic_idx
on public.question_sets(published, grade, topic);

create index if not exists question_set_items_question_id_idx
on public.question_set_items(question_id);

grant select on public.questions to anon, authenticated;
grant select on public.question_options to anon, authenticated;
grant select on public.question_sets to anon, authenticated;
grant select on public.question_set_items to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;
grant insert, update, delete on public.question_options to authenticated;
grant insert, update, delete on public.question_sets to authenticated;
grant insert, update, delete on public.question_set_items to authenticated;
grant insert on public.test_attempts to anon, authenticated;
grant insert on public.test_attempt_answers to anon, authenticated;

alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.question_sets enable row level security;
alter table public.question_set_items enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_attempt_answers enable row level security;

drop policy if exists "questions_public_select_published" on public.questions;
drop policy if exists "question_options_public_select_published" on public.question_options;
drop policy if exists "question_sets_public_select_published" on public.question_sets;
drop policy if exists "question_set_items_public_select_published" on public.question_set_items;
drop policy if exists "questions_admin_insert" on public.questions;
drop policy if exists "questions_admin_update" on public.questions;
drop policy if exists "questions_admin_delete" on public.questions;
drop policy if exists "question_options_admin_insert" on public.question_options;
drop policy if exists "question_options_admin_update" on public.question_options;
drop policy if exists "question_options_admin_delete" on public.question_options;
drop policy if exists "question_sets_admin_insert" on public.question_sets;
drop policy if exists "question_sets_admin_update" on public.question_sets;
drop policy if exists "question_sets_admin_delete" on public.question_sets;
drop policy if exists "question_set_items_admin_insert" on public.question_set_items;
drop policy if exists "question_set_items_admin_update" on public.question_set_items;
drop policy if exists "question_set_items_admin_delete" on public.question_set_items;
drop policy if exists "test_attempts_public_insert" on public.test_attempts;
drop policy if exists "test_attempt_answers_public_insert" on public.test_attempt_answers;

create policy "questions_public_select_published"
on public.questions for select to anon, authenticated
using (
  published = true
  or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "question_options_public_select_published"
on public.question_options for select to anon, authenticated
using (
  exists (
    select 1 from public.questions q
    where q.id = question_id
      and (
        q.published = true
        or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
      )
  )
);

create policy "question_sets_public_select_published"
on public.question_sets for select to anon, authenticated
using (
  published = true
  or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
);

create policy "question_set_items_public_select_published"
on public.question_set_items for select to anon, authenticated
using (
  exists (
    select 1 from public.question_sets s
    where s.id = question_set_id
      and (
        s.published = true
        or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com'
      )
  )
);

create policy "questions_admin_insert"
on public.questions for insert to authenticated
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "questions_admin_update"
on public.questions for update to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "questions_admin_delete"
on public.questions for delete to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_options_admin_insert"
on public.question_options for insert to authenticated
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_options_admin_update"
on public.question_options for update to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_options_admin_delete"
on public.question_options for delete to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_sets_admin_insert"
on public.question_sets for insert to authenticated
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_sets_admin_update"
on public.question_sets for update to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_sets_admin_delete"
on public.question_sets for delete to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_set_items_admin_insert"
on public.question_set_items for insert to authenticated
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_set_items_admin_update"
on public.question_set_items for update to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "question_set_items_admin_delete"
on public.question_set_items for delete to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'ihamoglu@gmail.com');

create policy "test_attempts_public_insert"
on public.test_attempts for insert to anon, authenticated
with check (
  exists (
    select 1 from public.question_sets s
    where s.id = question_set_id
      and s.published = true
  )
);

create policy "test_attempt_answers_public_insert"
on public.test_attempt_answers for insert to anon, authenticated
with check (
  exists (
    select 1 from public.questions q
    where q.id = question_id
      and q.published = true
  )
);

commit;
