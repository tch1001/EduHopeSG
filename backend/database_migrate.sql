-- TickNinja Tables
ALTER TABLE IF EXISTS courses
    RENAME TO course,
    ALTER COLUMN id TYPE UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    

CREATE TABLE IF NOT EXISTS course (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code COURSE,
  long_name text UNIQUE NOT NULL,
  short_form text UNIQUE NOT NULL,
  image text NOT NULL
);

CREATE TABLE IF NOT EXISTS subject (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  level LEVEL,
  course uuid,
  image text NOT NULL
);