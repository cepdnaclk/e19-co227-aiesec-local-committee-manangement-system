USE LC_KANDY;

/* ~~~~~~~~~~~~~~~~~~~~ PROJECTS ~~~~~~~~~~~~~~~~~~~~ */
CREATE TABLE igv_project (
    expaId          INT(7) PRIMARY KEY,
    projectName     VARCHAR(50),
    sdg             INT(2),
    jd              VARCHAR(350),
    oppProvider     VARCHAR(50),
    food            ENUM('Provided', 'Covered', 'Provided & Covered'),
    transportation  ENUM('Provided', 'Covered', 'Provided & Covered'),
    accommodation   ENUM('Provided', 'Covered', 'Provided & Covered'),
    notes           VARCHAR(100)
);

/* ~~~~~~~~~~~~~~~~~~~~ SLOTS ~~~~~~~~~~~~~~~~~~~~ */
CREATE TABLE igv_slot (
    expaId          INT(7),
    slotId          INT(4) AUTO_INCREMENT PRIMARY KEY,
    slotName        VARCHAR(25),
    startDate       DATE,
    endDate         DATE,
    numOpenings     INT(2),

    FOREIGN KEY(expaId) REFERENCES igv_project(expaId) 
        ON UPDATE CASCADE ON DELETE CASCADE
);

/* ~~~~~~~~~~~~~~~~~~~~ QUESTIONS ~~~~~~~~~~~~~~~~~~~~ */
CREATE TABLE igv_question (
    questionId      INT(4) AUTO_INCREMENT PRIMARY KEY,
    expaId          INT(7),
    question        VARCHAR(200),

    FOREIGN KEY(expaId) REFERENCES igv_project(expaId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

/* ~~~~~~~~~~~~~~~~~~~~ APPLICATIONS ~~~~~~~~~~~~~~~~~~~~ */
CREATE TABLE igv_application (
    epId            INT(7),
    appId           INT(5) AUTO_INCREMENT PRIMARY KEY, /* one ep can have multiple applications*/
    appStatus       ENUM('Open', 'Withdrawn', 'Rejected', 'ABH', 'Accepted', 'Approved'),
    epName          VARCHAR(50),
    memberId        INT(5),
    team            VARCHAR(15),
    appliedDate     DATE NULL,
    contactedDate   DATE,
    slotId          INT(4),
    projectExpaId   INT(7),
    gender          CHAR(1),
    homeMc          VARCHAR(25),
    homeLc          VARCHAR(25),
    contactNumber   VARCHAR(15),
    email           VARCHAR(50),
    notes           VARCHAR(150),

    /* interview details will be filled after scheduling the interview */
    interviewDate   DATE,
    interviewTime   TIME, 

    /* EP Manager details */
    epMngName       VARCHAR(20),
    epMngContact    VARCHAR(15),
    epMngEmail      VARCHAR(50),

    /* date recording */
    abhDate         DATE,
    acceptedDate    DATE,
    approvedDate    DATE,

    /* realization */
    realizedDate    DATE,
    paymentDate     DATE,
    amount          DECIMAL(10, 2),
    proofLink       CHAR(100),

    /* finished */
    finishedDate    DATE,

    /* completed */
    completedDate    DATE,

    FOREIGN KEY (projectExpaId) REFERENCES igv_project(expaId)
    ON DELETE SET NULL ON UPDATE SET NULL,
    FOREIGN KEY (memberId) REFERENCES member(id)
    ON DELETE SET NULL ON UPDATE SET NULL,
    FOREIGN KEY (slotId) REFERENCES igv_slot(slotId)
    ON DELETE SET NULL ON UPDATE SET NULL
);

/* ~~~~~~~~~~~~~~~~~~~~ INTERVIEW LOGS ~~~~~~~~~~~~~~~~~~~~ */
CREATE TABLE igv_interview_log (

    appId           INT(5),
    questionId      INT(3),
    answer          VARCHAR(200),

    FOREIGN KEY (appId) REFERENCES igv_application(appId) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (questionId) REFERENCES igv_question(questionId)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE igv_email_status(

    id              INT             AUTO_INCREMENT PRIMARY KEY,
    appId           INT(5),
    templateId      INT(3),
    status          ENUM('Pending', 'Sent')     DEFAULT 'Pending',

    FOREIGN KEY (appId) REFERENCES igv_application(appId) 
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (templateId) REFERENCES email_template(id) 
        ON DELETE CASCADE ON UPDATE CASCADE

);

/* ~~~~~~~~~~~~~~~~~~~~ TRIGGERS ~~~~~~~~~~~~~~~~~~~~ */
/* Create an empty interview log when a new application is created
(answers updated later during interview by user)*/
CREATE TRIGGER CreateInterviewLog
AFTER INSERT ON igv_application
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE questionId INT;
    
    /* Get all related question IDs based on the project_expa_id */
    DECLARE cur CURSOR FOR
        SELECT q.questionId
        FROM igv_question AS q
        WHERE q.expaId = NEW.projectExpaId;
    /* Fix for Error: No data - zero rows fetched, selected, or processed */
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    /* Loop through each question and insert into igv_interview_log */
    OPEN cur;
    FETCH cur INTO questionId;
    WHILE questionId IS NOT NULL AND done != 1 DO
        INSERT INTO igv_interview_log (appId, questionId, answer)
        VALUES (NEW.appId, questionId, "");
        FETCH cur INTO questionId;
    END WHILE;
    CLOSE cur;
END;


/* Each time a new applicant is created add rows for each templateId in email_template where OfficeId = 'IGV' with status pending*/
CREATE TRIGGER CreateEmailStatusLog
AFTER INSERT ON igv_application
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE template_id INT;
    
    /* Cursor for fetching template IDs based on officeId = 'igv' */
    DECLARE cur CURSOR FOR
        SELECT id
        FROM email_template
        WHERE officeId = 'IGV';
    
    /* Handler for ending the loop when all rows have been fetched */
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    /* Loop through each templateId and insert into igv_email_status */
    OPEN cur;
    FETCH cur INTO template_id;
    WHILE done != 1 DO
        INSERT INTO igv_email_status (appId, templateId)
        VALUES (NEW.appId, template_id); 
        FETCH cur INTO template_id;
    END WHILE;
    CLOSE cur;
END;



/* ~~~~~~~~~~~~~~~~~~~~ STORED PROCEDURES ~~~~~~~~~~~~~~~~~~~~ */
CREATE PROCEDURE GetIGVOpportunities()
BEGIN
SELECT
    p.expaId as 'key',
    p.projectName as 'value',
    JSON_ARRAYAGG(JSON_OBJECT('key',s.slotId,'value', s.slotName)) as 'slots'
FROM igv_project AS p
LEFT JOIN igv_slot AS s ON p.expaId = s.expaId
GROUP BY p.expaId, p.projectName;
END;

CREATE PROCEDURE GetAllIGVApplicationsForAdmin()
BEGIN
SELECT 
    a.appId,
    a.appStatus,
    a.epName,
    m.preferredName as inChargeMember,
    p.projectName,
    s.slotName
FROM 
    igv_application as a
LEFT JOIN
    igv_project as p
ON
    a.projectExpaId = p.expaId
LEFT JOIN
    igv_slot as s
ON
    a.slotId = s.slotId
LEFT JOIN
    member as m
ON
    a.memberId = m.id
ORDER BY 
    a.appliedDate DESC ;
END;

CREATE PROCEDURE GetAllIGVApplications(
    IN inMemberId INT(5)
)
BEGIN
SELECT 
    a.appId,
    a.appStatus,
    a.epName,
    m.preferredName as inChargeMember,
    p.projectName,
    s.slotName
FROM 
    igv_application as a
LEFT JOIN
    igv_project as p
ON
    a.projectExpaId = p.expaId
LEFT JOIN
    igv_slot as s
ON
    a.slotId = s.slotId
LEFT JOIN
    member as m
ON
    a.memberId = m.id
WHERE
    a.memberId = inMemberId
ORDER BY 
    a.appliedDate DESC ;
END;

CREATE PROCEDURE GetIGVApplication(
    IN inAppId  INT(5)
)
BEGIN
SELECT 
    a.appId,
    a.appStatus,
    a.epName,
    m.preferredName as inChargeMember,
    p.projectName,
    s.slotName
FROM 
    igv_application as a
LEFT JOIN
    igv_project as p
ON
    a.projectExpaId = p.expaId
LEFT JOIN
    igv_slot as s
ON
    a.slotId = s.slotId
LEFT JOIN
    member as m
ON
    a.memberId = m.id
WHERE
    a.appId = inAppId
ORDER BY 
    a.appliedDate DESC ;
END;


CREATE PROCEDURE GetLatestIGVApplication()
BEGIN
SELECT 
    a.appId,
    a.appStatus,
    a.epName,
    m.preferredName as inChargeMember,
    p.projectName,
    s.slotName
FROM 
    igv_application as a
LEFT JOIN
    igv_project as p
ON
    a.projectExpaId = p.expaId
LEFT JOIN
    igv_slot as s
ON
    a.slotId = s.slotId
LEFT JOIN
    member as m
ON
    a.memberId = m.id
WHERE
    a.appId = (SELECT MAX(appId) FROM igv_application)
ORDER BY 
    a.appliedDate DESC ;
END;


CREATE PROCEDURE GetIGVMemberList()
BEGIN
SELECT
    id as 'key',
    preferredName as 'value'
FROM
    member
WHERE
    frontOfficeId = 'iGV';
END;

CREATE PROCEDURE GetInterviewLog(IN appId INT(5))
BEGIN
SELECT 
    q.questionId,
    q.question,
    a.answer
FROM
    igv_question AS q
RIGHT JOIN
    igv_interview_log as a
ON
    a.questionId = q.questionId
WHERE
    q.expaId = (SELECT i.projectExpaId 
    FROM igv_application AS i WHERE i.appId = appId); 
END;

CREATE PROCEDURE UpdateInterviewLog(IN entries JSON, IN appId INT(5))
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE current_entry JSON;

    WHILE i < JSON_LENGTH(entries) DO
        SET current_entry = JSON_UNQUOTE(JSON_EXTRACT(entries, CONCAT('$[', i, ']')));
        UPDATE igv_interview_log AS l SET answer = JSON_UNQUOTE(JSON_EXTRACT(current_entry, '$.answer'))
        WHERE l.appId = appId AND l.questionId = JSON_UNQUOTE(JSON_EXTRACT(current_entry, '$.questionId'));
        SET i = i + 1;
    END WHILE;
END;

CREATE PROCEDURE GetUpcomingInterviews(IN id INT(5))
BEGIN
SELECT
    epName, interviewDate, interviewTime
FROM
    igv_application
WHERE
    memberId = id
AND
    DATE(interviewDate) >= CURDATE();
END;


CREATE PROCEDURE GetIGVApplicantDetails(specificAppId INT)
    BEGIN
        SELECT 
            m.email AS memberEmail,
            a.email AS applicantEmail,
            a.epName,
            p.projectName,
            s.slotName,
            s.startDate,
            s.endDate,
            p.accommodation,
            p.food,
            p.transportation,
            a.amount AS fee,
            m.fullName AS memberFullName,
            r.title AS roleName,
            d.departmentName
        FROM 
            igv_application AS a
        JOIN 
            igv_project AS p ON a.projectExpaId = p.expaId
        JOIN 
            igv_slot AS s ON a.slotId = s.slotId
        JOIN 
            member AS m ON a.memberId = m.id
        JOIN 
            role AS r ON m.roleId = r.id  
        JOIN 
            department AS d ON m.departmentId = d.id
    WHERE 
            a.appId = specificAppId;
END;