CREATE PROCEDURE GetMemberRegisterResources()
BEGIN
SELECT id as 'key', title as 'value' from district;
SELECT f.id as 'key', 
CONCAT('(', f.id, ') ', f.title) as 'value',
JSON_ARRAYAGG(JSON_OBJECT('key',d.id,'value', CONCAT('(',d.id,') ', d.title))) as 'departments'
FROM front_valid_pair AS v, front_office AS f, department AS d
WHERE f.id = v.office_id AND d.id = v.department_id
GROUP BY f.id, f.title, f.abbreviation;
SELECT id as 'key', CONCAT('(',abbreviation,') ', title) as 'value' from back_office;
SELECT id as 'key', CONCAT('(',abbreviation,') ', title) as 'value' from role;
END;

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

CREATE PROCEDURE GetAllMembers()
BEGIN
SELECT 
    m.id,
    m.preferred_name,
    m.front_office_id,
    f.abbreviation AS front_office_abbreviation,
    m.department_id,
    d.abbreviation AS department_abbreviation,
    m.role_id, 
    r.abbreviation AS role_abbreviation,
    m.photo_link,
    m.aiesec_email
    FROM member AS m
    LEFT JOIN front_office AS f
    ON f.id = m.front_office_id
    LEFT JOIN department AS d
    ON d.id = m.department_id
    LEFT JOIN role as r
    ON r.id = m.role_id;
END;

CREATE PROCEDURE GetMember(IN id INT(5))
BEGIN
SELECT
    *
FROM
    member
WHERE
    id = id;
END;

CREATE PROCEDURE GetAllApplications()
BEGIN
SELECT 
    a.ep_id,
    a.app_status,
    a.app_id,
    a.ep_name,
    m.preferred_name as incharge_member,
    p.project_name,
    s.title as slot_name
FROM 
    igv_application as a
LEFT JOIN
    igv_project as p
ON
    a.project_expa_id = p.expa_id
LEFT JOIN
    igv_slot as s
ON
    a.slot_id = s.slot_id
LEFT JOIN
    member as m
ON
    a.incharge_member_id = m.id
ORDER BY 
    a.applied_date DESC ;
END;

CREATE PROCEDURE GetApplicationResources()
BEGIN
SELECT
    p.expa_id as 'key',
    p.project_name as 'value',
    JSON_ARRAYAGG(JSON_OBJECT('key',s.slot_id,'value', s.title)) as 'slots'
FROM igv_project AS p, igv_slot As s
WHERE p.expa_id = s.expa_id
GROUP BY p.expa_id, p.project_name;
END;

CREATE PROCEDURE GetInChargeMemberList()
BEGIN
SELECT
    id as 'key',
    preferred_name as 'value'
FROM
    member;
END;

/*
#produre to calculate slot end date after start date is added
CREATE PROCEDURE CalculateEndDate(IN start_date DATE, OUT end_date DATE)
BEGIN
    SET end_date = DATE_ADD(start_date, INTERVAL 6 WEEK);
END;

CALL CalculateEndDate('2023-08-14', @output);
SELECT @output AS calculated_end_date;
*/


CREATE PROCEDURE GetInterviewLog(IN app_id INT(5))
BEGIN
SELECT 
    q.question_id,
    q.question,
    a.answer
FROM
    igv_question AS q
RIGHT JOIN
    igv_interview_log as a
ON
    a.question_id = q.question_id
WHERE
    q.expa_id = (SELECT i.project_expa_id 
    FROM igv_application AS i WHERE i.app_id = app_id); 
END;

CREATE PROCEDURE UpdateInterviewLog(IN entries JSON, IN app_id INT(5))
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE current_entry JSON;

    WHILE i < JSON_LENGTH(entries) DO
        SET current_entry = JSON_UNQUOTE(JSON_EXTRACT(entries, CONCAT('$[', i, ']')));
        UPDATE igv_interview_log AS l SET answer = JSON_UNQUOTE(JSON_EXTRACT(current_entry, '$.answer'))
        WHERE l.app_id = app_id AND l.question_id = JSON_UNQUOTE(JSON_EXTRACT(current_entry, '$.questionId'));
        SET i = i + 1;
    END WHILE;
END;

CREATE PROCEDURE GetUpcomingInterviews(IN id INT(5))
BEGIN
SELECT
    ep_name, interview_date, interview_time
FROM
    igv_application
WHERE
    incharge_member_id = id
AND
    DATE(interview_date) >= CURDATE();
END;







-- OGV

CREATE PROCEDURE GetOGVApplicantDetailsInDetail(IN applicant_id INT)
BEGIN
    SELECT 
        status,
        firstName,
        lastName,
        phone,
        email,
        memberInChargeId,
        campaignId,
        sentLinks,
        signupNotes,
        opportunityId,
        opportunityName,
        hostMc,
        hostLc,
        DATE_FORMAT(acceptedStartDate, "%Y-%m-%d") as acceptedStartDate,
        DATE_FORMAT(acceptanceDate, "%Y-%m-%d") as acceptanceDate,
        isEseEmailSent,
        acceptedNotes,
        DATE_FORMAT(approvedDate, "%Y-%m-%d") as approvedDate,
        DATE_FORMAT(paymentDate, "%Y-%m-%d") as paymentDate,
        paymentAmount,
        proofLink,
        approvedNotes,
        DATE_FORMAT(realizedStartDate, "%Y-%m-%d") as realizedStartDate,
        realizedNotes,
        DATE_FORMAT(finishedDate, "%Y-%m-%d") as finishedDate,
        DATE_FORMAT(completedDate, "%Y-%m-%d") as completedDate,
        approvalBreakNote,
        realizationBreakNote
    FROM 
        ogv_applicants
    WHERE 
        id = applicant_id;
END;

-- to send the newly created/edited record details back to client app to refresh client side data table
CREATE PROCEDURE OGVApplicantDetailsInBrief(IN applicant_id INT)
BEGIN
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
        member m ON o.memberInChargeId = m.id
    WHERE
        o.id = applicant_id;
END;




