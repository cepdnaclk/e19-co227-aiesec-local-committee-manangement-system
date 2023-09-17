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
    nic                 CHAR(12),
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
) ;


/* =============== TERMS TABLE =============== */
CREATE TABLE term (
    id                     VARCHAR(10) PRIMARY KEY NOT NULL, #yy-Summer/Winter
    startDate              DATE NOT NULL,
    endDate                DATE NOT NULL,
    newbieRecruitmentDate  DATE NOT NULL
);

/* =============== UPCOMING EVENTS TABLE =========*/

CREATE TABLE lc_event (

    event_id                INT(4) AUTO_INCREMENT PRIMARY KEY,
    title                   VARCHAR(50),
    event_description       VARCHAR(200),
    post_link               VARCHAR(255),
    event_date              CHAR(10) #remove when current date is past the event date

);

/* =============== TEAMS TABLE =============== */

/* ============== iGV PROJECTS =============== */

/* commenting with -- gives a parse error in node */
/* can be deleted -  slots deleted - questions,application set null*/
CREATE TABLE igv_project (

    expa_id         INT(7) PRIMARY KEY,
    project_name    VARCHAR(50),
    sdg             INT(2),
    jd              VARCHAR(350),
    opp_provider    VARCHAR(50),
    food            VARCHAR(20), /*provided/covered/provided and covered*/
    transportation  VARCHAR(20), /*provided/covered/provided and covered*/
    accommodation   VARCHAR(20), /*provided/covered/provided and covered*/
    notes           VARCHAR(100)

);

/* ================ PROJECT SLOTS TABLE ========== */
CREATE TABLE igv_slot (

    expa_id         INT(7),
    slot_id         INT(4) AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(25),
    start_date      CHAR(10),
    end_date        CHAR(10),
    num_openings    INT(2),

    FOREIGN KEY(expa_id) REFERENCES igv_project(expa_id)
);

/* ================= iGV INTERVIEW QUESRIONS TABLE ========= */
CREATE TABLE igv_question (

    expa_id         INT(7),
    question_id     INT(4) AUTO_INCREMENT PRIMARY KEY,
    question        VARCHAR(200),

    FOREIGN KEY(expa_id) REFERENCES igv_project(expa_id)

);
/* ============= iGV APPLICATION STATUS =============*/

CREATE TABLE igv_application_status (
    status_id       INT(2) PRIMARY KEY,
    status_name     VARCHAR(50)  
);

/* ================= iGV APPLICATIONS TABLE =================*/

CREATE TABLE igv_application (

    ep_id           INT(7), /* from expa */
    app_id          INT(5) AUTO_INCREMENT PRIMARY KEY, /* one ep can have multiple applications*/
    app_status      VARCHAR(15),
    ep_name         VARCHAR(50),
    incharge_member_id INT(5),
    team            VARCHAR(15),
    applied_date    CHAR(10),
    contacted_date  CHAR(10),
    /* project_name    VARCHAR(20),*/
    slot_id       INT(4),
    project_expa_id INT(7), /* f KEY */
    gender          CHAR(1),  /* M/F */
    home_mc         VARCHAR(25),
    home_lc         VARCHAR(25),
    contact_number  VARCHAR(15),
    email           VARCHAR(50),
    notes           VARCHAR(150),

    /* interview details will be filled after scheduling the interview */

    interview_date  CHAR(10),
    interview_time  CHAR(10), 

    /* EP Manager details */

    ep_mng_name     VARCHAR(20),
    ep_mng_contact  VARCHAR(15),
    ep_mng_email    VARCHAR(50),

    /* date recording */

    abh_date        CHAR(10),
    accepted_date   CHAR(10),
    approved_date   CHAR(10),

    /* foreign key declaration */ 

    FOREIGN KEY (project_expa_id) REFERENCES igv_project(expa_id),
    FOREIGN KEY (incharge_member_id) REFERENCES member(id),
    FOREIGN KEY (slot_id) REFERENCES igv_slot(slot_id)
);

/* =================== iGV INTERVIEW LOG TABLE =========*/
CREATE TABLE igv_interview_log (

    app_id          INT(5),
    question_id     INT(3),
    answer          VARCHAR(200),

    FOREIGN KEY (app_id) REFERENCES igv_application(app_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (question_id) REFERENCES igv_question(question_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

/* Create an empty interview log when a new application is created
(answers updated later during interview by user)*/
CREATE TRIGGER CreateInterviewLog
AFTER INSERT ON igv_application
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE question_id INT;
    
    /* Get all related question IDs based on the project_expa_id */
    DECLARE cur CURSOR FOR
        SELECT q.question_id
        FROM igv_question AS q
        WHERE q.expa_id = NEW.project_expa_id;
    /* Fix for Error: No data - zero rows fetched, selected, or processed */
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    /* Loop through each question and insert into igv_interview_log */
    OPEN cur;
    FETCH cur INTO question_id;
    WHILE question_id IS NOT NULL AND done != 1 DO
        INSERT INTO igv_interview_log (app_id, question_id, answer)
        VALUES (NEW.app_id, question_id, "");
        FETCH cur INTO question_id;
    END WHILE;
    CLOSE cur;
END;


/* =============================================== */

/*table for storing templates of emails*/
CREATE TABLE email_template (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL UNIQUE,
    subject     VARCHAR(255)    NOT NULL,
    body        TEXT            NOT NULL,
    attachments JSON
);

/*table for user's gmail date'*/
CREATE TABLE user_gmail_data (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    accessToken     TEXT ,
    refreshToken    TEXT ,
    tokenExpiry     BIGINT
);

CREATE TABLE ogv_applicants (
    id                  INT NOT NULL AUTO_INCREMENT,
    notes               TEXT,
    status              ENUM('pre-signup', 'signup', 'accepted', 'approved', 'realized', 'finished', 'completed', 'approval-broken', 'realization-broken') NOT NULL,
    
    -- pre-signup
    firstName           VARCHAR(255) NOT NULL,
    lastName            VARCHAR(255) NOT NULL,
    phone               VARCHAR(20),
    email               VARCHAR(255) NOT NULL,
    memberInChargeId    INT,
    campaignId          INT,

    -- accepted
    opportunityId       INT,
    opportunityName     VARCHAR(255),
    hostMc              VARCHAR(255),
    hostLc              VARCHAR(255),
    acceptedStartDate   DATE,
    acceptanceDate      DATE,
    isEseEmailSent      BOOLEAN DEFAULT FALSE,

    -- approved
    approvedDate        DATE,
    paymentDate         DATE,
    paymentAmount       DECIMAL(10,2),
    proofLink           VARCHAR(1024),

    -- realized
    realizedStartDate   DATE,

    -- finished
    finishedDate        DATE,

    -- completed
    completedDate       DATE,

    -- approval-broken or realization-broken
    breakNote          TEXT,


    PRIMARY KEY (id),
    FOREIGN KEY (memberInChargeId) REFERENCES member(id),
    INDEX (status),
    INDEX (email),
    INDEX (memberInChargeId)
);


CREATE VIEW ApplicantDetailsInBrief AS
SELECT 
    o.id,
    o.firstName,
    o.lastName,
    o.status,
    o.phone,
    o.campaignId,
    m.preferred_name AS memberInCharge
FROM 
    ogv_applicants o
LEFT JOIN 
    member m ON o.memberInChargeId = m.id;


CREATE VIEW DetailsForSendReminders AS
SELECT 
    o.id,
    o.firstName,
    o.lastName,
    o.phone,
    o.campaignId,
    m.preferred_name AS memberName,
    m.email AS memberEmail
FROM 
    ogv_applicants o
LEFT JOIN 
    member m ON o.memberInChargeId = m.id
WHERE
    o.status = 'pre-signup';