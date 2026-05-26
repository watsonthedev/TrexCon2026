-- Migration: create_rsvps
-- Created: 2026-05-26
--
-- Stores RSVP submissions from the TrexCon website.
-- RLS policy: anyone can insert (public form), only authenticated users can read.

create table rsvps (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null    default now(),
  twitch_username  text        not null,
  nickname         text,
  arrival_flight   text,
  arrival_date     date,
  arrival_time     time,
  hotel            text,
  hotel_checkin    date,
  departure_flight text,
  departure_date   date,
  departure_time   time,
  needs_ride       boolean
);

alter table rsvps enable row level security;

-- Grant table-level privileges to Supabase roles
grant insert on public.rsvps to anon;
grant select on public.rsvps to authenticated;

-- Public insert: anyone can submit an RSVP
create policy "public can insert rsvps"
  on rsvps for insert
  with check (true);

-- Authenticated read: only logged-in users (e.g. Trexcapades) can view submissions
create policy "authenticated users can read rsvps"
  on rsvps for select
  using (auth.role() = 'authenticated');
