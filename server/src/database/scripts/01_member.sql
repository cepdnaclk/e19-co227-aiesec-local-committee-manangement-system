USE LC_KANDY;

/* ~~~~~~~~~~~~~~~~~~~~ FACULTIES ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE faculty (
    id              VARCHAR(3) PRIMARY KEY,
    facultyName     VARCHAR(100)
); */

INSERT INTO faculty (id, title) VALUES
('AG', 'Faculty of Agriculture'),
('A', 'Faculty of Arts'),
('D', 'Faculty of Dental Sciences'),
('E', 'Faculty of Engineering'),
('M', 'Faculty of Medicine'),
('S', 'Faculty of Science'),
('V', 'Faculty of Veterinary Medicine and Animal Science'),
('AHS', 'Faculty of Allied Health Sciences'),
('MG', 'Faculty of Management');

/* ~~~~~~~~~~~~~~~~~~~~ DISTRICTS ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE district (
    id              INT(2) PRIMARY KEY,
    districtName    VARCHAR(20)
); */

INSERT INTO district (id, title) VALUES
(1, 'Ampara'),
(2, 'Anuradhapura'),
(3, 'Badulla'),
(4, 'Batticaloa'),
(5, 'Colombo'),
(6, 'Galle'),
(7, 'Gampaha'),
(8, 'Hambantota'),
(9, 'Jaffna'),
(10, 'Kalutara'),
(11, 'Kandy'),
(12, 'Kegalle'),
(13, 'Kilinochchi'),
(14, 'Kurunegala'),
(15, 'Mannar'),
(16, 'Matale'),
(17, 'Matara'),
(18, 'Monaragala'),
(19, 'Mullaitivu'),
(20, 'Nuwara Eliya'),
(21, 'Polonnaruwa'),
(22, 'Puttalam'),
(23, 'Ratnapura'),
(24, 'Trincomalee'),
(25, 'Vavuniya');

/* ~~~~~~~~~~~~~~~~~~~~ ROLES ~~~~~~~~~~~~~~~~~~~~ */

/* CREATE TABLE role (
    id              VARCHAR(4) PRIMARY KEY,
    roleName        VARCHAR(50)
); */

INSERT INTO role (title, id) VALUES
("Local Committee President", "LCP"),
("Local Committee Vice President", "LCVP"),
("Manager", "MGR"),
("Specialist", "SPL"),
("Team Leader", "TL"),
("Team Member", "TM"),
("Coordinator", "CDN");

/* ~~~~~~~~~~~~~~~~~~~~ FRONT OFFICES ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE front_office (
    id              VARCHAR(4) PRIMARY KEY,
    frontOfficeName VARCHAR(50)
); */

INSERT INTO front_office (frontOfficeName, id) VALUES
("Local Committee President", "LCP"),
("incoming Global Volunteer", "iGV"),
("outgoing Global Volunteer", "oGV"),
("incoming Global Talent/Teacher", "iGT"),
("outgoing Global Talent/Teacher", "oGT"),
("Back Office Vice President", "BOVP");

/* ~~~~~~~~~~~~~~~~~~~~ BACK OFFICES ~~~~~~~~~~~~~~~~~~~~ *//* 
CREATE TABLE back_office (
    id              VARCHAR(4) PRIMARY KEY,
    backOfficeName  VARCHAR(50)
); */

INSERT INTO back_office (backOfficeName, id) VALUES
("BRAND", "BND"),
("Finance and Legal", "FnL"),
("Business Development", "BD"),
("People Management", "PM"),
("Information Management", "IM"),
("Expansions Management", "EM"),
("Public Relations and Engage with AIESEC", "PnE");

/* ~~~~~~~~~~~~~~~~~~~~ DEPARTMENTS ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE department (
    id              VARCHAR(4) PRIMARY KEY,
    departmentName  VARCHAR(25)
); */

INSERT INTO department (departmentName, id) VALUES
("Local Committee President", "LCP"),
("Vice President", "VP"),
("International Relations", "IR"),
("Matching", "M"),
("Business to Business", "B2B"),
("Value Delivery", "VD"),
("Marketing", "MKT"),
("Business to Customer", "B2C"),
("Customer Experience", "CXP");

/* ~~~~~~~~~~~~~~~~~~~~ VALID FRONT OFFICES - DEPARTMENTS ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE front_valid_pair (
    officeId        VARCHAR(4),
    departmentId    VARCHAR(4),

    FOREIGN KEY (officeId)     REFERENCES front_office(id),
    FOREIGN KEY (departmentId) REFERENCES department(id)
); */

INSERT INTO front_valid_pair (officeId, departmentId) VALUES
("LCP","LCP"),
("iGV","VP"),("iGV","IR"),("iGV","M"),("iGV","B2B"),("iGV","VD"),("iGV","MKT"),
("oGV","VP"),("oGV","IR"),("oGV","B2B"),("oGV","MKT"),("oGV","B2C"),("oGV","CXP"),
("iGV","VP"),("iGV","IR"),("iGV","M"),("iGV","B2B"),("iGV","VD"),("iGV","MKT"),
("oGT","VP"),("oGT","IR"),("oGT","B2B"),("oGT","MKT"),("oGT","B2C"),("oGT","CXP");

/* ~~~~~~~~~~~~~~~~~~~~ MEMBERS ~~~~~~~~~~~~~~~~~~~~ */
/* CREATE TABLE member ( 

    id                  INT(5) AUTO_INCREMENT PRIMARY KEY,

    -- login details
    email               VARCHAR(255) UNIQUE NOT NULL,
    passphrase          VARCHAR(20)  NOT NULL,

    -- member details
    fullName            VARCHAR(100),
    preferredName       VARCHAR(30),
    frontOfficeId       VARCHAR(4),
    departmentId        VARCHAR(4),
    backOfficeId        VARCHAR(4),
    joinedDate          CHAR(10),
    roleId              VARCHAR(4),
    contactNo           VARCHAR(12),
    aiesecEmail         VARCHAR(255),
    gender              CHAR(1),
    nic                 CHAR(12),
    birthDate           CHAR(10),
    facebookLink        VARCHAR(255),
    linkedinLink        VARCHAR(255),
    instagramLink       VARCHAR(255),
    registerNo          VARCHAR(12) UNIQUE,
    schoolName          VARCHAR(50),
    homeAddress         VARCHAR(100),
    homeContact         VARCHAR(12),
    districtId          INT(2),
    photoLink           VARCHAR(255),
    boardingAddress     VARCHAR(100),

    FOREIGN KEY (frontOfficeId)     REFERENCES front_office(id),
    FOREIGN KEY (backOfficeId)      REFERENCES back_office(id),
    FOREIGN KEY (departmentId)      REFERENCES department(id),
    FOREIGN KEY (districtId)        REFERENCES district(id),
    FOREIGN KEY (roleId)            REFERENCES role(id)
);
 */
/* ~~~~~~~~~~~~~~~~~~~~ STORED PROCEDURES ~~~~~~~~~~~~~~~~~~~~ */

-- -- Get context data required to show member details
-- CREATE PROCEDURE GetMemberContext()
-- BEGIN
-- SELECT id as 'key', districtName as 'value' from district;
-- SELECT f.id as 'key', 
-- CONCAT('(', f.id, ') ', f.frontOfficeName) as 'value',
-- JSON_ARRAYAGG(JSON_OBJECT('key',d.id,'value', CONCAT('(',d.id,') ', d.departmentName))) as 'departments'
-- FROM front_valid_pair AS v, front_office AS f, department AS d
-- WHERE f.id = v.officeId AND d.id = v.departmentId
-- GROUP BY f.id, f.frontOfficeName;
-- SELECT id as 'key', CONCAT('(',id,') ', backOfficeName) as 'value' from back_office;
-- SELECT id as 'key', CONCAT('(',id,') ', roleName) as 'value' from role;
-- END;

-- -- Get all members
-- CREATE PROCEDURE GetAllMembers()
-- BEGIN
-- SELECT 
--     m.id,
--     m.preferredName,
--     f.frontOfficeName,
--     b.backOfficeName,
--     d.departmentName,
--     r.roleName,
--     m.photoLink,
--     m.aiesecEmail
--     FROM member AS m
--     LEFT JOIN front_office AS f
--     ON f.id = m.frontOfficeId
--     LEFT JOIN back_office AS b
--     ON b.id = m.backOfficeId
--     LEFT JOIN department AS d
--     ON d.id = m.departmentId
--     LEFT JOIN role as r
--     ON r.id = m.roleId;
-- END;