create table if not exists public.solutions (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.solutions enable row level security;

drop policy if exists "solutions_select" on public.solutions;
drop policy if exists "solutions_insert" on public.solutions;
drop policy if exists "solutions_update" on public.solutions;

create policy "solutions_select"
on public.solutions
for select
to anon
using (true);

create policy "solutions_insert"
on public.solutions
for insert
to anon
with check (true);

create policy "solutions_update"
on public.solutions
for update
to anon
using (true)
with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_solutions_updated_at on public.solutions;

create trigger set_solutions_updated_at
before update on public.solutions
for each row
execute function public.set_updated_at();
