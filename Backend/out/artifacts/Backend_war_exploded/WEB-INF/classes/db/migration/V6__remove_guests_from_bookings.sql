y-- Migration to remove the 'guests' column from the 'bookings' table
ALTER TABLE bookings DROP COLUMN IF EXISTS guests;
