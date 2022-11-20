CREATE TABLE IF NOT EXISTS eduhope_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL,
    email VARCHAR(672) UNIQUE NOT NULL, -- email address max length of 320 vars, encryption requires 2x
    password TEXT NOT NULL, -- to requirements

    school VARCHAR(128) NOT NULL,
    level_of_education VARCHAR(64) NOT NULL, -- highest/current level of edu.
    telegram VARCHAR(32) NOT NULL, -- telegram handle
    bio VARCHAR(500) DEFAULT '',

    referral VARCHAR(64) NOT NULL, -- Reddit, Telegram, etc.
    tutee_terms BOOLEAN DEFAULT 'yes',

    created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),

    ----------- tutor data ------------
    is_tutor BOOLEAN DEFAULT FALSE,
    tutoring CHAR[] DEFAULT array[]::char[], -- [N, O, A, P, B, I] (n', o', a'lvl, pri, BI, IP)
    subjects INT[] DEFAULT array[]::int[] check(), -- subject ids from TickNinja
    tutee_limit INT DEFAULT 3 CHECK (tutee_limit BETWEEN 1 AND 5),
    commitment_end TIMESTAMP,
    preferred_communications TEXT[],
    avg_response_time VARCHAR(32),

    tutor_terms BOOLEAN DEFAULT 'no'
);

CREATE TABLE IF NOT EXISTS tutee_tutor_relationship (
    id VARCHAR(73) PRIMARY KEY GENERATED ALWAYS AS (TEXT(tutee_id) || ':' || TEXT(tutor_id)) STORED,    
    tutee_id UUID NOT NULL REFERENCES eduhope_user(id)
        ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES eduhope_user(id)
        ON DELETE CASCADE,

    subjects INT[] NOT NULL, -- subject ids from TickNinja
    relationship_status INT NOT NULL DEFAULT 0, -- 0 pending tutor accept, 1 accepted and in effect

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