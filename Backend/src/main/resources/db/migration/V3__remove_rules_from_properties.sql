-- Migration to remove 'rules' column from 'properties' table
ALTER TABLE properties DROP COLUMN IF EXISTS rules;
