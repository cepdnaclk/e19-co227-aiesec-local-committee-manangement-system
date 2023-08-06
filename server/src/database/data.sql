USE LC_KANDY;

/* =============== STATIC DATA =============== */
INSERT INTO faculty (id, title) VALUES
('AG', 'Faculty of Agriculture')
,('A', 'Faculty of Arts')
,('D', 'Faculty of Dental Sciences')
,('E', 'Faculty of Engineering')
,('M', 'Faculty of Medicine')
,('S', 'Faculty of Science')
,('V', 'Faculty of Veterinary Medicine and Animal Science')
,('AHS', 'Faculty of Allied Health Sciences')
,('MG', 'Faculty of Management')
;

INSERT INTO district (id, title) VALUES
(1, 'Ampara')
,(2, 'Anuradhapura')
,(3, 'Badulla')
,(4, 'Batticaloa')
,(5, 'Colombo')
,(6, 'Galle')
,(7, 'Gampaha')
,(8, 'Hambantota')
,(9, 'Jaffna')
,(10, 'Kalutara')
,(11, 'Kandy')
,(12, 'Kegalle')
,(13, 'Kilinochchi')
,(14, 'Kurunegala')
,(15, 'Mannar')
,(16, 'Matale')
,(17, 'Matara')
,(18, 'Monaragala')
,(19, 'Mullaitivu')
,(20, 'Nuwara Eliya')
,(21, 'Polonnaruwa')
,(22, 'Puttalam')
,(23, 'Ratnapura')
,(24, 'Trincomalee')
,(25, 'Vavuniya')
;

INSERT INTO role (id, title, abbreviation) VALUES
(0, "Local Committee President", "LCP")
,(1, "Local Committee Vice President", "LCVP")
,(2, "Manager", "MGR")
,(3, "Specialist", "SPL")
,(4, "Team Leader", "TL")
,(5, "Team Member", "TM")
,(6, "Coordinator", "CDN")
;

INSERT INTO front_office (id, title, abbreviation) VALUES
(0, "Local Committee President", "LCP")
,(1, "incoming Global Volunteer", "iGV")
,(2, "outgoing Global Volunteer", "oGV")
,(3, "incoming Global Talent/Teacher", "iGT")
,(4, "outgoing Global Talent/Teacher", "oGT")
,(5, "Back Office Vice President", "BOVP")
;

INSERT INTO back_office (id, title, abbreviation) VALUES
(1, "BRAND", "BND")
,(2, "Finance and Legal", "FnL")
,(3, "Business Development", "BD")
,(4, "People Management", "PM")
,(5, "Information Management", "IM")
,(6, "Expansions Management", "EM")
,(7, "Public Relations and Engage with AIESEC", "PnE")
;

INSERT INTO department (id, title, abbreviation) VALUES
(0, "Local Committee President", "LCP")
,(1, "Vice President", "VP")
,(2, "International Relations", "IR")
,(3, "Matching", "M")
,(4, "Business to Business", "B2B")
,(5, "Value Delivery", "VD")
,(6, "Marketing", "MKT")
,(7, "Business to Customer", "B2C")
,(8, "Customer Experience", "CXP")
;

/* commenting with -- gives a parse error in node */
INSERT INTO valid_pair (office_id, department_id) VALUES
(0,0) /* president */
,(1,1),(1,2),(1,3),(1,4),(1,5),(1,6) /* igv */
,(2,1),(2,2),(2,4),(2,6),(2,7),(2,8) /* ogv */
,(3,1),(3,2),(3,3),(3,4),(3,5),(3,6) /* igt */
,(4,1),(4,2),(4,4),(4,6),(4,7),(4,8) /* ogt */
;

/* =============== DUMMY DATA =============== */
INSERT INTO member (email, passphrase)
VALUES 
("john@example.com", 123), 
("admin", "admin")
;

INSERT INTO term VALUES
('22-Summer', '2022-01-01', '2022-05-01', '2022-03-01')
,('22-Winter', '2022-06-01', '2022-12-01', '2022-07-01')
;

INSERT INTO igv_projects (expa_id, project_name, sdg, jd, opp_provider, food, transportation, accommodation, notes) VALUES
(1234567, "Global Classroom - Kandy", 4, 
"1. Participate in activites to teach English to children. 
2. Conduct practical activites", "Britshway English Acadamy", "Provided", "Covered", "Provided and Covered", "Only for europeans" );