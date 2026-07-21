-- Add video_url column to projects table
alter table projects
  add column if not exists video_url text;
