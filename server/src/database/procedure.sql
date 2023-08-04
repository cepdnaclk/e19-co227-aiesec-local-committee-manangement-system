CREATE PROCEDURE GetFunctionalArea()
BEGIN
SELECT f.id, f.title, f.abbreviation,
JSON_ARRAYAGG(JSON_OBJECT('id',d.id,'title',d.title,'abbreviation',d.abbreviation)) as departments
FROM valid_pair AS v, functional_area AS f, department AS d
WHERE f.id = v.functional_area_id AND d.id = v.department_id
GROUP BY f.id, f.title, f.abbreviation;
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