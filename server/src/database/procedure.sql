CREATE PROCEDURE GetMemberRegisterResources()
BEGIN
SELECT id as 'key', title as 'value' from district;
SELECT f.id as 'key', 
CONCAT('(', f.abbreviation, ') ', f.title) as 'value',
JSON_ARRAYAGG(JSON_OBJECT('key',d.id,'value', CONCAT('(',d.abbreviation,') ', d.title))) as 'departments'
FROM valid_pair AS v, front_office AS f, department AS d
WHERE f.id = v.office_id AND d.id = v.department_id
GROUP BY f.id, f.title, f.abbreviation;
SELECT id as 'key', CONCAT('(',abbreviation,') ', title) as 'value' from back_office;
SELECT id as 'key', CONCAT('(',abbreviation,') ', title) as 'value' from role;
END;

CREATE PROCEDURE GetAllTerms()
BEGIN
SELECT 
    title,
    DATE_FORMAT(start_date, "%Y-%m-%d") as startDate,
    DATE_FORMAT(end_date, "%Y-%m-%d") as endDate,
    DATE_FORMAT(newbie_recruitment_date, "%Y-%m-%d") as newbieRecruitmentDate
FROM term;
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