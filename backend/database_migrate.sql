-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"

-- Enums
DROP TYPE IF EXISTS LEVEL CASCADE;
CREATE TYPE LEVEL AS ENUM (
    'Pure',
    'Elective',
    'H1',
    'H2',
    'H3',
    'SL',
    'HL'
);

DROP TYPE IF EXISTS EDUCATION CASCADE;
CREATE TYPE EDUCATION AS ENUM (
    'Sec 1',
    'Sec 2',
    'Sec 3',
    'Sec 4',
    'Sec 5',
    'JC 1',
    'JC 2',
    'JC Graduate',    
    'Polytechnic Year 1',
    'Polytechnic Year 2',
    'Polytechnic Year 3',
    'Polytechnic Graduate',    
    'Private O''Level',
    'Private A''Level',    
    'Uni Undergraduate',
    'Uni Graduate'
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
    VALUES ('GCE N-Level', 'General Certificate of Education Normal Level', 'N-Level', 'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2022/12/12/yaohui-wknlevel17-5030_4.jpg'),
    ('GCE O-Level', 'General Certificate of Education Ordinary Level', 'O-Level', 'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2023/01/05/IMG5629_5.JPG'),
    ('GCE A-Level', 'General Certificate of Education Advanced Level', 'A-Level', 'https://www.asiaone.com/sites/default/files/styles/article_main_image/public/original_images/Mar2014/20140303_alevel.jpg'),
    ('International Baccalaureate', 'International Baccalaureate Diploma Programme', 'IB', NULL);    
    

DROP TABLE IF EXISTS subjects;
CREATE TABLE IF NOT EXISTS subject (
    id SERIAL PRIMARY KEY,
    course UUID,
    name VARCHAR(50) NOT NULL,
    level LEVEL,

    UNIQUE(name, level)

    CONSTRAINT fk_course
        FOREIGN KEY (course)
            REFERENCES course(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

INSERT INTO subject (course, name, level)
    VALUES (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'English', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Chinese', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Higher Chinese', NULL),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Chinese Language Basic', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Malay', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Higher Malay', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Malay Language Basic', NULL),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Tamil', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Higher Tamil', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Tamil Language Basic', NULL),        
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Economics', 'Pure'),     
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Literature', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Chinese Literature', 'Pure'),        
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Malay Literature', 'Pure'),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Tamil Literature', 'Pure'),            
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'History', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Geography', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Social Studies', 'Elective'),                
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Literature', 'Elective'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Chinese Literature', 'Elective'),        
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Malay Literature', 'Elective'),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Tamil Literature', 'Elective'),        
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'History', 'Elective'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Geography', 'Elective'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Elementary Mathematics', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Additional Mathematics', NULL),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Physics', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Chemistry', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Biology', 'Pure'),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Combined Science (Physics)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Combined Science (Chemistry)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Combined Science (Biology)', NULL),    
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Nutrition and Food Science', NULL),        
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Art', NULL),            
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Higher Art', NULL),                
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Design & Technology', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Business Studies', NULL), 
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Principles of Accounts', NULL), 
    (( SELECT id FROM course WHERE name = 'GCE O-Level' ), 'Computing', NULL);
  
INSERT INTO subject (course, name, level)
    VALUES (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'General Paper', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Knowledge and Inquiry', 'H2'),          
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chinese', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chinese Language Basic', 'H1'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chinese Language and Literature', 'H2'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chinese Language and Literature', 'H3'), 
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Malay', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Malay Language Basic', 'H1'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Malay Language and Literature', 'H2'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Malay Language and Literature', 'H3'), 
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Tamil', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Tamil Language Basic', 'H1'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Tamil Language and Literature', 'H2'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Tamil Language and Literature', 'H3'),         
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'China Studies in Chinese', 'H2'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Geography', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'History', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Literature', 'H1'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Economics', 'H1'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Art', 'H1'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Geography', 'H2'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'History', 'H2'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Literature', 'H2'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Economics', 'H2'),        
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Art', 'H2'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'China Studies in English', 'H2'),        
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'English Language and Linguistics', 'H2'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Theatre Studies and Drama', 'H2'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Principles of Accounting', 'H2'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Management of Business', 'H2'),  
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Music', 'H2'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Mathematics', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Physics', 'H1'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chemistry', 'H1'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Biology', 'H1'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'China Studies in English', 'H1'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Mathematics', 'H2'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Physics', 'H2'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chemistry', 'H2'),    
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Biology', 'H2'),        
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Computing', 'H2'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Further Mathematics', 'H2'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Literature', 'H3'),
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Economics (Cambridge)', 'H3'),     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Chemistry', 'H3'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Physics', 'H3'),                 
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Biology', 'H3'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Art', 'H3'),                     
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Mathematics', 'H3'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Music', 'H3'),                 
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'Geography', 'H3'),       
    (( SELECT id FROM course WHERE name = 'GCE A-Level' ), 'History', 'H3');  

INSERT INTO subject (course, name, level)
    VALUES (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'English Language N(A)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Chinese N(A)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Malay N(A)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Tamil N(A)', NULL),      
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'History N(A)', 'Pure'),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Geography N(A)', 'Pure'),       
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Literature N(A)', 'Pure'),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'History N(A)', 'Elective'),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Geography N(A)', 'Elective'),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Literature N(A)', 'Elective'),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Combined Science (Chemistry) N(A)', NULL),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Combined Science (Physics) N(A)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Combined Science (Biology) N(A)', NULL),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Art N(A)', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Design & Technology N(A)', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Principles of Accounts N(A)', NULL),  
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Nutrition and Food Science N(A)', NULL),   
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'English Language N(T)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Chinese N(T)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Malay N(T)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Tamil N(T)', NULL),
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Art N(T)', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Design & Technology N(T)', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Computer Applications N(T)', NULL),  
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Nutrition and Food Science N(T)', NULL),                    
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Elements of Business Skills N(T)', NULL),     
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Music N(T)', NULL),  
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Mobile Robotics', NULL),  
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Smart Electrical Technology', NULL),                    
    (( SELECT id FROM course WHERE name = 'GCE N-Level' ), 'Retail Operations', NULL)    

INSERT INTO subject (course, name, level)
    VALUES (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Theory of Knowledge', NULL),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Extended Essay', NULL),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Literature (English)', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Language & Literature (English)', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Language & Literature (English)', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Chinese B', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Malay B', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Tamil B', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Hindi B', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Business Management', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Economics', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Geography', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'History', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Business Management', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Economics', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Geography', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'History', 'HL'),    
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Physics', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Chemistry', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Biology', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Computing', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Physics', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Chemistry', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Biology', 'HL'),  
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Mathematics', 'SL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Mathematics', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Music', 'HL'),
    (( SELECT id FROM course WHERE name = 'International Baccalaureate' ), 'Visual Arts', 'HL') 

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

    created_on timestamptz DEFAULT now(),
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

    created_on timestamptz DEFAULT now(),
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