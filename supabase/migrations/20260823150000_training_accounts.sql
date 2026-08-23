create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null unique,
  first_name text not null,
  last_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  course_id text not null,
  course_name text not null,
  amount integer not null check (amount >= 0),
  currency text not null,
  status text not null check (status in ('paid', 'refunded')),
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.course_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  active boolean not null default true,
  granted_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index course_access_user_id_idx on public.course_access(user_id);
create index purchases_user_id_idx on public.purchases(user_id);

alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.course_access enable row level security;

create policy "profiles read own profile" on public.profiles for select to authenticated using (auth.uid() = auth_user_id);
create policy "purchases read own purchases" on public.purchases for select to authenticated using (user_id in (select id from public.profiles where auth_user_id = auth.uid()));
create policy "access read own access" on public.course_access for select to authenticated using (user_id in (select id from public.profiles where auth_user_id = auth.uid()));
