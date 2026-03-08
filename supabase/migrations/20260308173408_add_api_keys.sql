create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  key text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.api_keys enable row level security;

create policy "Users can insert their own api keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own api keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can delete their own api keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);
