-- Add gallery_images column to projects table for multiple photos
alter table projects
  add column if not exists gallery_images text[] not null default '{}';
