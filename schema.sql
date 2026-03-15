-- Recommended: keep app tables in public unless you prefer a custom schema
-- Assumption:
--   profiles.id = auth.users.id
-- so auth.uid() can be used directly for ownership checks.

create extension if not exists pgcrypto;

-- =========================
-- TABLES
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  business_name text,
  google_review_url text,
  delay_hours integer not null default 2 check (delay_hours >= 0)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text,
  phone text
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  service_type text not null,
  completed_at timestamptz,
  status text not null check (status in ('completed', 'review_sent', 'reviewed')),
  notes text
);

create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text not null check (status in ('pending', 'sent', 'failed', 'clicked', 'reviewed'))
);

-- =========================
-- HELPFUL INDEXES
-- =========================

create index if not exists customers_user_id_idx
  on public.customers(user_id);

create index if not exists jobs_user_id_idx
  on public.jobs(user_id);

create index if not exists jobs_customer_id_idx
  on public.jobs(customer_id);

create index if not exists review_requests_job_id_idx
  on public.review_requests(job_id);

-- =========================
-- DATA INTEGRITY
-- =========================
-- Prevent cross-user references:
-- a user must only create jobs for their own customers.

create or replace function public.enforce_job_customer_ownership()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.customers c
    where c.id = new.customer_id
      and c.user_id = new.user_id
  ) then
    raise exception 'customer_id does not belong to user_id';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_job_customer_ownership on public.jobs;

create trigger trg_enforce_job_customer_ownership
before insert or update on public.jobs
for each row
execute function public.enforce_job_customer_ownership();

-- =========================
-- ENABLE RLS
-- =========================

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.jobs enable row level security;
alter table public.review_requests enable row level security;

-- Optional but recommended: force RLS even for table owners
alter table public.profiles force row level security;
alter table public.customers force row level security;
alter table public.jobs force row level security;
alter table public.review_requests force row level security;

-- =========================
-- RLS POLICIES: PROFILES
-- =========================

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles
for delete
using (id = auth.uid());

-- =========================
-- RLS POLICIES: CUSTOMERS
-- =========================

drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own"
on public.customers
for select
using (user_id = auth.uid());

drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own"
on public.customers
for insert
with check (user_id = auth.uid());

drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own"
on public.customers
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "customers_delete_own" on public.customers;
create policy "customers_delete_own"
on public.customers
for delete
using (user_id = auth.uid());

-- =========================
-- RLS POLICIES: JOBS
-- =========================

drop policy if exists "jobs_select_own" on public.jobs;
create policy "jobs_select_own"
on public.jobs
for select
using (user_id = auth.uid());

drop policy if exists "jobs_insert_own" on public.jobs;
create policy "jobs_insert_own"
on public.jobs
for insert
with check (user_id = auth.uid());

drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own"
on public.jobs
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "jobs_delete_own" on public.jobs;
create policy "jobs_delete_own"
on public.jobs
for delete
using (user_id = auth.uid());

-- =========================
-- RLS POLICIES: REVIEW_REQUESTS
-- Ownership is derived through jobs.user_id
-- =========================

drop policy if exists "review_requests_select_own" on public.review_requests;
create policy "review_requests_select_own"
on public.review_requests
for select
using (
  exists (
    select 1
    from public.jobs j
    where j.id = review_requests.job_id
      and j.user_id = auth.uid()
  )
);

drop policy if exists "review_requests_insert_own" on public.review_requests;
create policy "review_requests_insert_own"
on public.review_requests
for insert
with check (
  exists (
    select 1
    from public.jobs j
    where j.id = review_requests.job_id
      and j.user_id = auth.uid()
  )
);

drop policy if exists "review_requests_update_own" on public.review_requests;
create policy "review_requests_update_own"
on public.review_requests
for update
using (
  exists (
    select 1
    from public.jobs j
    where j.id = review_requests.job_id
      and j.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.jobs j
    where j.id = review_requests.job_id
      and j.user_id = auth.uid()
  )
);

drop policy if exists "review_requests_delete_own" on public.review_requests;
create policy "review_requests_delete_own"
on public.review_requests
for delete
using (
  exists (
    select 1
    from public.jobs j
    where j.id = review_requests.job_id
      and j.user_id = auth.uid()
  )
);