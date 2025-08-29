-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles table
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create analytics table for tracking user events
create table if not exists public.analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  event_name text not null,
  event_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for analytics table
alter table public.analytics enable row level security;

-- Create policies for analytics table
create policy "Users can view their own analytics." on public.analytics
  for select using (auth.uid() = user_id);

create policy "Users can insert their own analytics." on public.analytics
  for insert with check (auth.uid() = user_id);

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create sample data table for demonstrations
create table if not exists public.sample_data (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  value numeric not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- Set up RLS for sample_data table
alter table public.sample_data enable row level security;

-- Create policies for sample_data table
create policy "Users can view their own sample data." on public.sample_data
  for select using (auth.uid() = user_id);

create policy "Users can insert their own sample data." on public.sample_data
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own sample data." on public.sample_data
  for update using (auth.uid() = user_id);

create policy "Users can delete their own sample data." on public.sample_data
  for delete using (auth.uid() = user_id);