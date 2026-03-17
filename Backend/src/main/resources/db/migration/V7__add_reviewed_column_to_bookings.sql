-- Migration: Add 'reviewed' column to 'bookings' table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reviewed BOOLEAN NOT NULL DEFAULT FALSE;
