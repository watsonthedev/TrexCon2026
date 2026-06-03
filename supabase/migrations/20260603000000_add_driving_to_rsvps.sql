-- Migration: add_driving_to_rsvps
-- Created: 2026-06-03
--
-- Tracks whether an attendee is driving themselves to the convention.
-- Used to suppress the "Needs ride" badge and adjust carpool question copy.

alter table rsvps
  add column driving boolean not null default false;
