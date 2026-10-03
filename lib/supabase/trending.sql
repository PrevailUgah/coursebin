create table trending_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('image', 'video')),
  title text not null,
  subtitle text,
  media_path text not null,
  media_type text not null,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index idx_trending_posts_created_at on trending_posts(created_at desc);

alter table trending_posts enable row level security;

create policy "public read trending posts" on trending_posts for select using (true);

create policy "senior admins manage trending posts" on trending_posts
  for all
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'senior_admin'))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'senior_admin'));

create policy "senior admins upload trending media" on storage.objects
  for insert
  with check (
    bucket_id = 'trending-media'
    and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'senior_admin')
  );

create policy "senior admins delete trending media" on storage.objects
  for delete
  using (
    bucket_id = 'trending-media'
    and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'senior_admin')
  );

create policy "public read trending media" on storage.objects
  for select using (bucket_id = 'trending-media');