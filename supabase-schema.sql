create table if not exists public.team_registrations (
  id text primary key,
  "teamName" text not null,
  track text not null,
  "leaderName" text not null,
  "leaderEmail" text not null,
  "leaderGithub" text not null,
  members jsonb not null default '[]'::jsonb,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id text primary key,
  "eventName" text not null,
  "teamName" text not null,
  "leaderName" text not null,
  "leaderEmail" text not null,
  "leaderGithub" text not null,
  members jsonb not null default '[]'::jsonb,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.community_requests (
  id text primary key,
  name text not null,
  email text not null,
  role text not null,
  github text not null,
  portfolio text,
  reason text not null,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.sponsor_requests (
  id text primary key,
  "companyName" text not null,
  "workEmail" text not null,
  role text,
  tier text,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.workshop_rsvps (
  id text primary key,
  "workshopId" text not null,
  "workshopTitle" text not null,
  name text not null,
  email text not null,
  github text not null,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.flux_page_contents (
  page_key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.team_registrations enable row level security;
alter table public.event_registrations enable row level security;
alter table public.community_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.sponsor_requests enable row level security;
alter table public.workshop_rsvps enable row level security;
alter table public.flux_page_contents enable row level security;

drop policy if exists "anon can insert team registrations" on public.team_registrations;
drop policy if exists "anon can read team registrations" on public.team_registrations;
drop policy if exists "anon can delete team registrations" on public.team_registrations;
drop policy if exists "anon can insert event registrations" on public.event_registrations;
drop policy if exists "anon can read event registrations" on public.event_registrations;
drop policy if exists "anon can delete event registrations" on public.event_registrations;
drop policy if exists "anon can insert community requests" on public.community_requests;
drop policy if exists "anon can read community requests" on public.community_requests;
drop policy if exists "anon can delete community requests" on public.community_requests;
drop policy if exists "anon can insert contact messages" on public.contact_messages;
drop policy if exists "anon can read contact messages" on public.contact_messages;
drop policy if exists "anon can delete contact messages" on public.contact_messages;
drop policy if exists "anon can insert sponsor requests" on public.sponsor_requests;
drop policy if exists "anon can read sponsor requests" on public.sponsor_requests;
drop policy if exists "anon can delete sponsor requests" on public.sponsor_requests;
drop policy if exists "anon can insert workshop rsvps" on public.workshop_rsvps;
drop policy if exists "anon can read workshop rsvps" on public.workshop_rsvps;
drop policy if exists "anon can delete workshop rsvps" on public.workshop_rsvps;
drop policy if exists "anon can read page content" on public.flux_page_contents;
drop policy if exists "anon can insert page content" on public.flux_page_contents;
drop policy if exists "anon can update page content" on public.flux_page_contents;

create policy "anon can insert team registrations" on public.team_registrations for insert to anon with check (true);
create policy "anon can read team registrations" on public.team_registrations for select to anon using (true);
create policy "anon can delete team registrations" on public.team_registrations for delete to anon using (true);

create policy "anon can insert event registrations" on public.event_registrations for insert to anon with check (true);
create policy "anon can read event registrations" on public.event_registrations for select to anon using (true);
create policy "anon can delete event registrations" on public.event_registrations for delete to anon using (true);

create policy "anon can insert community requests" on public.community_requests for insert to anon with check (true);
create policy "anon can read community requests" on public.community_requests for select to anon using (true);
create policy "anon can delete community requests" on public.community_requests for delete to anon using (true);

create policy "anon can insert contact messages" on public.contact_messages for insert to anon with check (true);
create policy "anon can read contact messages" on public.contact_messages for select to anon using (true);
create policy "anon can delete contact messages" on public.contact_messages for delete to anon using (true);

create policy "anon can insert sponsor requests" on public.sponsor_requests for insert to anon with check (true);
create policy "anon can read sponsor requests" on public.sponsor_requests for select to anon using (true);
create policy "anon can delete sponsor requests" on public.sponsor_requests for delete to anon using (true);

create policy "anon can insert workshop rsvps" on public.workshop_rsvps for insert to anon with check (true);
create policy "anon can read workshop rsvps" on public.workshop_rsvps for select to anon using (true);
create policy "anon can delete workshop rsvps" on public.workshop_rsvps for delete to anon using (true);

create policy "anon can read page content" on public.flux_page_contents for select to anon using (true);
create policy "anon can insert page content" on public.flux_page_contents for insert to anon with check (true);
create policy "anon can update page content" on public.flux_page_contents for update to anon using (true) with check (true);
