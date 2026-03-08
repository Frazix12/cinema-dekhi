alter table public.profiles
add column if not exists is_developer boolean not null default false;

drop policy if exists "Users can insert their own api keys" on public.api_keys;

create policy "Users can insert their own api keys"
  on public.api_keys
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_developer = true
    )
  );
