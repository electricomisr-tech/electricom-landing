-- ============================================================
-- Electricom Landing - Supabase Database Setup
-- ============================================================
-- Paste this entire file into the Supabase SQL Editor and click "Run".
-- This creates a single content table + image storage bucket + access rules.
-- ============================================================

-- 1) Content table (a single row holding the entire site content as JSON)
create table if not exists public.site_content (
  id          integer primary key default 1,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- 2) Seed initial row if missing (real content gets pushed from the admin panel on first save)
insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- 3) Auto-update updated_at on save
create or replace function public.touch_site_content()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_site_content_touch on public.site_content;
create trigger trg_site_content_touch
before update on public.site_content
for each row execute function public.touch_site_content();

-- 4) Row-Level Security: everyone can read, only logged-in admins can write
alter table public.site_content enable row level security;

drop policy if exists "public read content"  on public.site_content;
drop policy if exists "admin write content"  on public.site_content;
drop policy if exists "admin insert content" on public.site_content;

create policy "public read content"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "admin write content"
  on public.site_content for update
  to authenticated
  using (true) with check (true);

create policy "admin insert content"
  on public.site_content for insert
  to authenticated
  with check (true);

-- 5) Storage bucket for uploaded images (logos, project photos, etc.)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 6) Storage access rules: public can read; only authenticated admins can upload/delete
drop policy if exists "public read media"        on storage.objects;
drop policy if exists "admin upload media"       on storage.objects;
drop policy if exists "admin update media"       on storage.objects;
drop policy if exists "admin delete media"       on storage.objects;

create policy "public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "admin upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "admin update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

create policy "admin delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
