begin;

alter table public.documents
add column if not exists difficulty text
check (
  difficulty is null
  or difficulty in ('Başlangıç', 'Orta', 'İleri', 'Karma')
);

alter table public.documents
add column if not exists page_count integer
check (page_count is null or page_count > 0);

alter table public.documents
add column if not exists question_count integer
check (question_count is null or question_count > 0);

alter table public.documents
add column if not exists source_year integer
check (source_year is null or (source_year >= 2000 and source_year <= 2100));

alter table public.documents
add column if not exists curriculum_code text;

alter table public.documents
add column if not exists is_print_ready boolean not null default false;

alter table public.documents
add column if not exists has_video_solution boolean not null default false;

update public.documents
set has_video_solution = true
where solution_url is not null
  and btrim(solution_url) <> ''
  and has_video_solution = false;

commit;
