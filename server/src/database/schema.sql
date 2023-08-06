/* Naming Conventions
   Adapted from: https://github.com/RootSoft/Database-Naming-Convention
    tables, views, columns
        => singular
        => lowercase
        => seperated by _ (snake_case)
        => AVOID QUOTED IDENTIFIERS ("date", "First Name")
        => full words, no abbreviations unless they are common (like id)
        => no reserved words
    primary keys
        => single column primary key fields should be named id
    foreign keys
        => should be a combination of the name of the referenced table and the name of the referenced fields
*/

DROP DATABASE IF EXISTS LC_KANDY;

CREATE DATABASE LC_KANDY;

USE LC_KANDY;

CREATE TABLE faculty (
    id              VARCHAR(3) PRIMARY KEY,
    title           VARCHAR(100)
);

CREATE TABLE district (
    id INT(2)       PRIMARY KEY,
    title           VARCHAR(50)
);

CREATE TABLE role (
    id INT(2)       PRIMARY KEY,
    title           VARCHAR(50),
    abbreviation    VARCHAR(4)
);

/* =============== FRONT OFFICE TABLE =============== */
CREATE TABLE front_office (
    id              INT(2) PRIMARY KEY,
    title           VARCHAR(50),
    abbreviation    VARCHAR(4)
);

/* =============== BACK OFFICE TABLE =============== */
CREATE TABLE back_office (
    id              INT(2) PRIMARY KEY,
    title           VARCHAR(50),
    abbreviation    VARCHAR(4)
);

/* =============== DEPARTMENTS TABLE =============== */
CREATE TABLE department (
    id              INT(2) PRIMARY KEY,
    title           VARCHAR(25),
    abbreviation    VARCHAR(10)
);

/* =============== VALID PAIRS (FUNCTS-DEPTS) TABLE =============== */
CREATE TABLE valid_pair (
    office_id INT(2),
    department_id INT(2),

    FOREIGN KEY (office_id)     REFERENCES front_office(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

/* =============== MEMEBERS MASTER TABLE =============== */
CREATE TABLE member (

    id       INT(5) AUTO_INCREMENT PRIMARY KEY,

    -- login details
    email               VARCHAR(255) UNIQUE NOT NULL,
    passphrase          VARCHAR(20)  NOT NULL,

    -- member details
    full_name           VARCHAR(100),
    preferred_name      VARCHAR(30),
    front_office_id     INT(2),
    department_id       INT(2),
    back_office_id      INT(2),
    -- TODO Find term using joined date
    joined_date         CHAR(10),
    role_id             INT(2),
    contact_no          VARCHAR(12),
    aiesec_email        VARCHAR(255),
    gender              CHAR(1),
    nic                 INT(12),
    birth_date          CHAR(10),
    facebook_link       VARCHAR(255),
    linkedin_link       VARCHAR(255),
    instagram_link      VARCHAR(255),
    register_no         VARCHAR(12) UNIQUE,
    school_name         VARCHAR(50),
    home_address        VARCHAR(100),
    home_contact        VARCHAR(12),
    district_id         INT(2),
    photo_link          VARCHAR(255),
    boarding_address    VARCHAR(100),

    FOREIGN KEY (front_office_id)   REFERENCES front_office(id),
    FOREIGN KEY (back_office_id)    REFERENCES back_office(id),
    FOREIGN KEY (department_id)     REFERENCES department(id),
    FOREIGN KEY (district_id)       REFERENCES district(id),
    FOREIGN KEY (role_id)           REFERENCES role(id)
);


/* =============== TERMS TABLE =============== */
CREATE TABLE term (
    title                   VARCHAR(10) PRIMARY KEY NOT NULL, #yy-Summer/Winter
    start_date              DATE NOT NULL,
    end_date                DATE NOT NULL,
    newbie_recruitment_date DATE NOT NULL
);

/* =============== TEAMS TABLE =============== */

/* ============== iGV PROJECTS =============== */

CREATE TABLE igv_project (

    expa_id         INT(7) PRIMARY KEY,
    project_name    VARCHAR(20),
    sdg             INT(2),
    jd              VARCHAR(350),
    opp_provider    VARCHAR(50),
    food            VARCHAR(20), --provided/covered/provided and covered
    transportation  VARCHAR(20), --provided/covered/provided and covered
    accommodation   VARCHAR(20), --provided/covered/provided and covered
    notes           VARCHAR(100)

);

/* ================ PROJECT SLOTS TABLE ========== */
CREATE TABLE igv_slot (

    expa_id         INT(7),
    slot_id         INT(4) AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(25),
    start_date      DATE,
    end_date        DATE,
    num_openings    INT(2),

    FOREIGN KEY(expa_id) REFERENCES igv_project(expa_id)
);

/* ================= iGV INTERVIEW QUESRIONS TABLE ========= */
CREATE TABLE igv_question (

    expa_id         INT(7),
    question_id     INT(4) AUTO_INCREMENT PRIMARY KEY,
    question        VARCHAR(200),

    FOREIGN KEY(project_id) REFERENCES igv_project(expa_id)

);
/* ============= iGV APPLICATION STATUS =============*/

CREATE TABLE igv_application_status (
    status_id       INT(2) PRIMARY KEY,
    status_name     VARCHAR(15)
    
 )

/* ================= iGV APPLICATIONS TABLE =================*/

CREATE TABLE igv_application (

    ep_id           INT(7), -- from expa
    app_id          INT(5) AUTO_INCREMENT PRIMARY KEY, --one ep can have multiple applications
    app_status      VARCHAR(15),
    ep_name         VARCHAR(50),
    incharge_member VARCHAR(50), -- member_id ???
    team            VARCHAR(15),
    applied_date    DATE,
    contacted_date  DATE,
    project_name    VARCHAR(20),
    slot_name       VARCHAR(25),
    project_expa_id INT(7), --f KEY
    gender          CHAR(1),  -- M/F
    home_mc         VARCHAR(25),
    home_lc         VARCHAR(25),
    contact_number  VARCHAR(15),
    email           VARCHAR(50),
    notes           VARCHAR(150),

    -- interview details will be filled after scheduling the interview--

    interview_date  DATE,
    interview_time  TIME, 

    -- EP Manager details

    ep_mng_name     VARCHAR(20),
    ep_mng_contact  VARCHAR(15),
    ep_mng_email    VARCHAR(50),

    -- date recording --

    abh_date        DATE,
    accepted_date   DATE,
    approved_date   DATE,

    -- foreign key declaration 

    FOREIGN KEY (project_expa_id) REFERENCES igv_project(expa_id)

);

/* =================== iGV INTERVIEW LOG TABLE =========*/
CREATE TABLE igv_interview_log (

    app_id          INT(5),
    question_id     INT(3),
    answer          VARCHAR(200),

    FOREIGN KEY (app_id) REFERENCES igv_application(app_id),
    FOREIGN KEY (question_id) REFERENCES igv_question(question_id)
);