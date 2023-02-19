CREATE TYPE IF NOT EXISTS LEVEL AS ENUM (
  'H1',
  'H2',
  'H3',
  'SL',
  'HL'
);

CREATE TYPE IF NOT EXISTS EDUCATION AS ENUM (
  'SEC_1',
  'SEC_2',
  'SEC_3',
  'SEC_4',
  'SEC_5',
  'JC_1',
  'JC_2',
  'PRIVATE_O_LEVEL',
  'PRIVATE_A_LEVEL',
  'IP_1',
  'IP_2',
  'IP_3',
  'IP_4',
  'IP_5',
  'IP_6',
  'IB_1',
  'IB_2'
);

CREATE TYPE IF NOT EXISTS COURSE AS ENUM (
  'N_LEVEL',
  'O_LEVEL',
  'A_LEVEL',
  'BI',
  'IP',
  'PRIMARY'
);

CREATE TYPE IF NOT EXISTS COMMUNICATION AS ENUM (
  'TEXTING',
  'VIRTUAL_CONSULTATION',
  'FACE_TO_FACE'
);

CREATE TYPE IF NOT EXISTS RELATIONSHIP_STATUS AS ENUM (
  'PENDING',
  'ACCEPTED',
  'ON_HOLD'
);

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

CREATE TABLE IF NOT EXISTS eduhope_user (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  given_name VARCHAR(32) NOT NULL CHECK (length(name) BETWEEN 3 AND 32),
  family_name VARCHAR(32) NOT NULL CHECK (length(name) BETWEEN 2 AND 32),
  email VARCHAR(672) UNIQUE NOT NULL, -- email address max length of 320 vars, encryption returns 2x
  password TEXT UNIQUE NOT NULL,

  school VARCHAR(128) NOT NULL,
  level_of_education EDUCATION NOT NULL,
  telegram VARCHAR(32) NOT NULL UNIQUE CHECK (length(name) BETWEEN 5 AND 32),
  bio VARCHAR(200) DEFAULT '',
  profile_image TEXT UNIQUE NOT NULL,

  referral VARCHAR(64), -- Reddit, Telegram, etc.
  tutee_terms BOOLEAN DEFAULT 'yes',

  created_on TIMESTAMPTZ DEFAULT now(),
  updated_on TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ DEFAULT now(),
);

CREATE TABLE IF NOT EXISTS tutor (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  tutoring COURSE[],
  subjects UUID[],
  tutee_limit int DEFAULT 3,
  preferred_communications COMMUNICATION,
  description text,
  average_response_time text,
  created_on timestamptz,
  updated_on timestamptz,
  last_login timestamptz
);

CREATE TABLE IF NOT EXISTS tutee_tutor_relationship (
  id varchar(73) UNIQUE PRIMARY KEY,
  tutee uuid,
  tutor uuid,
  subjects uuid[],
  status RELATIONSHIP_STATUS,
  created_on timestamptz,
  updated_on timestamptz,
  last_login timestamptz
);

CREATE TABLE IF NOT EXISTS permission (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  uesr_id uuid UNIQUE NOT NULL,
  manage_courses boolean NOT NULL DEFAULT false,
  manage_subjects boolean NOT NULL DEFAULT false,
  manage_accounts boolean NOT NULL DEFAULT false
);

ALTER TABLE "subject" ADD FOREIGN KEY ("course") REFERENCES "course" ("id");

ALTER TABLE "tutor" ADD FOREIGN KEY ("user_id") REFERENCES "eduhope_user" ("id");

ALTER TABLE "tutor" ADD FOREIGN KEY ("subjects") REFERENCES "subject" ("id");

CREATE TABLE "eduhope_user_tutee_tutor_relationship" (
  "eduhope_user_id" uuid,
  "tutee_tutor_relationship_tutee" uuid,
  PRIMARY KEY ("eduhope_user_id", "tutee_tutor_relationship_tutee")
);

ALTER TABLE "eduhope_user_tutee_tutor_relationship" ADD FOREIGN KEY ("eduhope_user_id") REFERENCES "eduhope_user" ("id");

ALTER TABLE "eduhope_user_tutee_tutor_relationship" ADD FOREIGN KEY ("tutee_tutor_relationship_tutee") REFERENCES "tutee_tutor_relationship" ("tutee");


CREATE TABLE "eduhope_user_tutee_tutor_relationship(1)" (
  "eduhope_user_id" uuid,
  "tutee_tutor_relationship_tutor" uuid,
  PRIMARY KEY ("eduhope_user_id", "tutee_tutor_relationship_tutor")
);

ALTER TABLE "eduhope_user_tutee_tutor_relationship(1)" ADD FOREIGN KEY ("eduhope_user_id") REFERENCES "eduhope_user" ("id");

ALTER TABLE "eduhope_user_tutee_tutor_relationship(1)" ADD FOREIGN KEY ("tutee_tutor_relationship_tutor") REFERENCES "tutee_tutor_relationship" ("tutor");


ALTER TABLE "tutee_tutor_relationship" ADD FOREIGN KEY ("subjects") REFERENCES "subject" ("id");

ALTER TABLE "permission" ADD FOREIGN KEY ("uesr_id") REFERENCES "eduhope_user" ("id");
