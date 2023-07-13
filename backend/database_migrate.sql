-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"

-- Enums
DROP TYPE IF EXISTS LEVEL CASCADE;
CREATE TYPE LEVEL AS ENUM (
    'H1',
    'H2',
    'H3',
    'SL',
    'HL'
);

DROP TYPE IF EXISTS EDUCATION CASCADE;
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

DROP TYPE IF EXISTS COURSE_ENUM CASCADE;
CREATE TYPE COURSE_ENUM AS ENUM (
    'N_LEVEL',
    'O_LEVEL',
    'A_LEVEL',
    'DIPLOMA',
    'IB',
    'IP',
    'PRIMARY'
);

DROP TYPE IF EXISTS COMMUNICATION CASCADE;
CREATE TYPE COMMUNICATION AS ENUM (
    'Texting',
    'Virtual Consultation',
    'Face-to-Face'
);

DROP TYPE IF EXISTS RELATIONSHIP_STATUS CASCADE;
CREATE TYPE RELATIONSHIP_STATUS AS ENUM (
    'PENDING',
    'ACCEPTED',
    'ON_HOLD'
);

-- TickNinja Tables
DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS course (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(32) UNIQUE NOT NULL,
    long_name VARCHAR(128) UNIQUE NOT NULL,
    short_form VARCHAR(18) UNIQUE NOT NULL,
    code COURSE_ENUM,
    image VARCHAR NOT NULL
);

INSERT INTO course (name, long_name, short_form, image)
    VALUES ('GCE N-Level', 'General Certificate of Education Normal Level', 'N-Level', 'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2022/12/12/yaohui-wknlevel17-5030_4.jpg');
INSERT INTO course (name, long_name, short_form, image)    
    VALUES ('GCE O-Level', 'General Certificate of Education Ordinary Level', 'O-Level', 'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2023/01/05/IMG5629_5.JPG');
INSERT INTO course (name, long_name, short_form, image)    
    VALUES ('GCE A-Level', 'General Certificate of Education Advanced Level', 'A-Level', 'https://www.asiaone.com/sites/default/files/styles/article_main_image/public/original_images/Mar2014/20140303_alevel.jpg');
    

DROP TABLE IF EXISTS subjects;
CREATE TABLE IF NOT EXISTS subject (
    id SERIAL PRIMARY KEY,
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
DROP TABLE IF EXISTS eduhope_user CASCADE;
CREATE TABLE IF NOT EXISTS eduhope_user (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    given_name VARCHAR(32) NOT NULL CHECK (length(given_name) BETWEEN 3 AND 32),
    family_name VARCHAR(32) NOT NULL CHECK (length(family_name) BETWEEN 2 AND 32),
    email VARCHAR(672) UNIQUE NOT NULL, -- email address max length of 320 vars, encryption returns 2x
    password TEXT UNIQUE NOT NULL,

    school VARCHAR(128) NOT NULL,
    level_of_education EDUCATION NOT NULL, -- highest/current level of edu.
    course COURSE_ENUM,
    telegram VARCHAR(32) NOT NULL UNIQUE CHECK (length(telegram) BETWEEN 5 AND 32),
    bio VARCHAR(200) DEFAULT '',
    profile_image TEXT,

    referral VARCHAR(64), -- Reddit, Telegram, etc.

    created_on TIMESTAMPTZ DEFAULT now(),
    updated_on TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ DEFAULT now()
);

DROP TABLE IF EXISTS tutor;
CREATE TABLE IF NOT EXISTS tutor (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,

    subjects INT[] NOT NULL, -- subject ids from TickNinja
    tutee_limit INT DEFAULT 3 CHECK (tutee_limit BETWEEN 1 AND 5),
    commitment_end TIMESTAMP,
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

DROP TABLE IF EXISTS tutee_tutor_relationship;
CREATE TABLE IF NOT EXISTS tutee_tutor_relationship (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    tutee UUID,
    tutor UUID,

    subject INT, -- subject ids from TickNinja
    status RELATIONSHIP_STATUS,

    created_on timestamptz,
    updated_on timestamptz,

    CONSTRAINT fk_tutee
        FOREIGN KEY (tutee)
            REFERENCES eduhope_user(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,

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
    manage_accounts boolean NOT NULL DEFAULT false,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES eduhope_user(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
);