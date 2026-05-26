-- Migration: rsvps_public_read
-- Created: 2026-05-26
--
-- Grants anon read access to rsvps so the attendee list page works
-- without Supabase Auth. The splash gate is the app-level guard.

grant select on public.rsvps to anon;

create policy "public can read rsvps"
  on rsvps for select
  using (true);
