USE LC_KANDY;

CREATE TABLE term (
    id                     VARCHAR(10) PRIMARY KEY NOT NULL, #yy-Summer/Winter
    startDate              DATE NOT NULL,
    endDate                DATE NOT NULL,
    newbieRecruitmentDate  DATE NOT NULL
);

CREATE PROCEDURE GetAllTerms()
BEGIN
SELECT 
    id,
    DATE_FORMAT(startDate, "%Y-%m-%d") as startDate,
    DATE_FORMAT(endDate, "%Y-%m-%d") as endDate,
    DATE_FORMAT(newbieRecruitmentDate, "%Y-%m-%d") as newbieRecruitmentDate
FROM term;
END;

CREATE PROCEDURE GetTerm(IN id VARCHAR(10))
BEGIN
SELECT 
    t.id,
    DATE_FORMAT(t.startDate, "%Y-%m-%d") as startDate,
    DATE_FORMAT(t.endDate, "%Y-%m-%d") as endDate,
    DATE_FORMAT(t.newbieRecruitmentDate, "%Y-%m-%d") as newbieRecruitmentDate
FROM term as t
WHERE t.id = id;
END;

CREATE PROCEDURE InsertTerm (
    IN inId VARCHAR(10),
    IN inStartDate DATE,
    IN inEndDate DATE,
    IN inNewbieRecruitmentDate DATE
)
BEGIN
    INSERT INTO term (id, startDate, endDate, newbieRecruitmentDate)
    VALUES (inId, inStartDate, inEndDate, inNewbieRecruitmentDate);
    SELECT 
        id,
        DATE_FORMAT(startDate, "%Y-%m-%d") as startDate,
        DATE_FORMAT(endDate, "%Y-%m-%d") as endDate,
        DATE_FORMAT(newbieRecruitmentDate, "%Y-%m-%d") as newbieRecruitmentDate
    FROM term WHERE id = inId;
END;

CREATE PROCEDURE UpdateTerm (
    IN inId VARCHAR(10),
    IN inStartDate DATE,
    IN inEndDate DATE,
    IN inNewbieRecruitmentDate DATE
)
BEGIN
    UPDATE term SET
        startDate = inStartDate, 
        endDate = inEndDate,
        newbieRecruitmentDate = inNewbieRecruitmentDate
    WHERE
        id = inId;
    SELECT 
        id,
        DATE_FORMAT(startDate, "%Y-%m-%d") as startDate,
        DATE_FORMAT(endDate, "%Y-%m-%d") as endDate,
        DATE_FORMAT(newbieRecruitmentDate, "%Y-%m-%d") as newbieRecruitmentDate
    FROM term WHERE id = inId;
END;