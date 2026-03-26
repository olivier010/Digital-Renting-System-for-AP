-- Migration to remove avatar, bio, company_name, location, and tax_id columns from users table
ALTER TABLE users
    DROP COLUMN IF EXISTS avatar,
    DROP COLUMN IF EXISTS bio,
    DROP COLUMN IF EXISTS company_name,
    DROP COLUMN IF EXISTS location,
    DROP COLUMN IF EXISTS tax_id;
