-- LinguaApp Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- ─── Profiles ───
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  total_xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── User Progress (SRS data) ───
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  vocabulary_id text not null,
  ease_factor real default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  next_review timestamp with time zone default now(),
  last_reviewed timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, vocabulary_id)
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- ─── Quiz Results ───
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  language text not null,
  score integer not null,
  total_questions integer not null,
  xp_earned integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

-- ─── Daily Activity ───
create table if not exists public.daily_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date default current_date,
  words_learned integer default 0,
  words_reviewed integer default 0,
  xp_earned integer default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

alter table public.daily_activity enable row level security;

create policy "Users can view own daily activity"
  on public.daily_activity for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily activity"
  on public.daily_activity for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily activity"
  on public.daily_activity for update
  using (auth.uid() = user_id);

-- ─── Keep-alive ping table ───
create table if not exists public.keepalive (
  id integer primary key default 1,
  last_ping timestamp with time zone default now()
);

insert into public.keepalive (id, last_ping) values (1, now())
on conflict (id) do nothing;

-- Anyone can read/update keepalive (no auth needed for cron)
alter table public.keepalive enable row level security;

create policy "Anyone can read keepalive"
  on public.keepalive for select
  using (true);

create policy "Anyone can update keepalive"
  on public.keepalive for update
  using (true);

-- ─── Auto-create profile on signup ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
