CREATE TABLE IF NOT EXISTS eduhope_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- to requirements

    school VARCHAR(128) NOT NULL,
    level_of_education VARCHAR(64) NOT NULL, -- highest/current level of edu.
    telegram VARCHAR(32) NOT NULL, -- telegram handle
    bio VARCHAR(500) DEFAULT '',

    referal VARCHAR(64) NOT NULL, -- Reddit, Telegram, etc.
    tutee_terms BOOLEAN DEFAULT 'yes',
    created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),

    ----------- tutor data ------------
    is_tutor BOOLEAN DEFAULT TRUE,
    tutoring CHAR[] NOT NULL, -- [O, A, P, B, I] (o'levels, n'levels, pri, BI, IP)
    subjects INT[] NOT NULL, -- subject ids from TickNinja
    tutee_limit INT NOT NULL DEFAULT 3,
    commitment_end TIMESTAMP NOT NULL,
    preferred_communications TEXT[] NOT NULL,
    avg_response_time VARCHAR(32) NOT NULL,

    tutor_terms BOOLEAN DEFAULT 'yes'
);

CREATE TABLE IF NOT EXISTS tutee_tutor_relationship (
    tutee_id UUID NOT NULL REFERENCES eduhope_user(id)
        ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES eduhope_user(id)
        ON DELETE CASCADE,

    subjects INT[] NOT NULL, -- subject ids from TickNinja

    created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT now()
);

------ level_of_education
-- Secondary 3
-- Secondary 4
-- Secondary 5
-- O level Private candidate
-- JC 1
-- JC 2
-- A level Private candidate
-- Polytechnic
-- Awaiting university
-- University undergraduate
-- University graduate