-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DROP TYPE IF EXISTS LEVEL;
CREATE TYPE LEVEL AS ENUM (
    'H1',
    'H2',
    'H3',
    'SL',
    'HL'
);

DROP TYPE IF EXISTS EDUCATION;
CREATE TYPE EDUCATION AS ENUM (
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
    'IB_2',
    'POLYTECHNIC_0',
    'POLYTECHNIC_1',
    'POLYTECHNIC_2',
    'POLYTECHNIC_3',
    'UNI_UNDERGRADUATE',
    'UNI_GRADUATE'
);

DROP TYPE IF EXISTS COMMUNICATION;
CREATE TYPE COMMUNICATION AS ENUM (
    'TEXTING',
    'VIRTUAL_CONSULTATION',
    'FACE_TO_FACE'
);

DROP TYPE IF EXISTS RELATIONSHIP_STATUS;
CREATE TYPE RELATIONSHIP_STATUS AS ENUM (
    'PENDING',
    'ACCEPTED',
    'ON_HOLD'
);

-- TickNinja Tables
CREATE TABLE IF NOT EXISTS course (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(32) UNIQUE NOT NULL,
    long_name VARCHAR(128) UNIQUE NOT NULL,
    short_form VARCHAR(18) UNIQUE NOT NULL,
    image VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS subject (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    course UUID,
    name VARCHAR(32) UNIQUE NOT NULL,
    level LEVEL,
    image VARCHAR NOT NULL,

    CONSTRAINT fk_course
        FOREIGN KEY (course)
            REFERENCES course(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

-- EduHopeSG Tables
CREATE TABLE IF NOT EXISTS eduhope_user (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    given_name VARCHAR(32) NOT NULL CHECK (length(name) BETWEEN 3 AND 32),
    family_name VARCHAR(32) NOT NULL CHECK (length(name) BETWEEN 2 AND 32),
    email VARCHAR(672) UNIQUE NOT NULL, -- email address max length of 320 vars, encryption returns 2x
    password TEXT UNIQUE NOT NULL,

    school VARCHAR(128) NOT NULL,
    level_of_education EDUCATION NOT NULL, -- highest/current level of edu.
    telegram VARCHAR(32) NOT NULL UNIQUE CHECK (length(name) BETWEEN 5 AND 32),
    bio VARCHAR(200) DEFAULT '',
    profile_image TEXT UNIQUE NOT NULL,

    referral VARCHAR(64), -- Reddit, Telegram, etc.

    created_on TIMESTAMPTZ DEFAULT now(),
    updated_on TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutor (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,

    subjects UUID[] NOT NULL, -- subject ids from TickNinja
    tutee_limit INT DEFAULT 3 CHECK (tutee_limit BETWEEN 1 AND 5),
    preferred_communications COMMUNICATION[] NOT NULL,

    description VARCHAR(2000),
    average_response_time VARCHAR(50),

    created_on timestamptz,
    updated_on timestamptz,

    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
            REFERENCES eduhope_user(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tutee_tutor_relationship (
    id VARCHAR(73) UNIQUE PRIMARY KEY,
    tutee UUID,
    tutor UUID,

    subjects UUID[], -- subject ids from TickNinja
    status RELATIONSHIP_STATUS,

    created_on timestamptz,
    updated_on timestamptz

    CONSTRAINT fk_tutee
        FOREIGN KEY (tutee)
            REFERENCES eduhope_user(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE

    CONSTRAINT fk_tutor
        FOREIGN KEY (tutor)
            REFERENCES eduhope_user(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS permission (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL,

    manage_courses boolean NOT NULL DEFAULT false,
    manage_subjects boolean NOT NULL DEFAULT false,
    manage_accounts boolean NOT NULL DEFAULT false

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES eduhope_user(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
);