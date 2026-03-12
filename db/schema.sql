create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.website_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  business_name text not null,
  business_type text not null,
  location text not null,
  website_goal text not null,
  pages text[] not null default '{}',
  features text[] not null default '{}',
  design_styles text[] not null default '{}',
  color_palette jsonb not null default '{"mode":"auto","name":"Modern Signal","primary":"#0F766E","secondary":"#ECFEFF","tertiary":"#F97316"}',
  target_audience text[] not null default '{}',
  services_offered text[] not null default '{}',
  customer_location text not null default '',
  customer_location_value text not null default '',
  target_customers text[] not null default '{}',
  preferred_platform text not null,
  business_description text not null default '',
  brand_personality text not null default '',
  tone_of_voice text not null default '',
  unique_selling_points text not null default '',
  business_goals text not null default '',
  brand_assets_available boolean,
  inspiration_images jsonb not null default '[]',
  generated_prompt text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.users enable row level security;
alter table public.website_projects enable row level security;

create policy "Users can view their profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can insert their profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Users can view own projects"
on public.website_projects
for select
using (auth.uid() = user_id);

create policy "Users can insert own projects"
on public.website_projects
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own projects"
on public.website_projects
for delete
using (auth.uid() = user_id);
