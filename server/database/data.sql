USE LC_KANDY;

# Insert Static Data
INSERT INTO faculty (id, title) VALUES
('AG', 'Faculty of Agriculture')
,('A', 'Faculty of Arts')
,('D', 'Faculty of Dental Sciences')
,('E', 'Faculty of Engineering')
,('M', 'Faculty of Medicine')
,('S', 'Faculty of Science')
,('V', 'Faculty of Veterinary Medicine and Animal Science')
,('AHS', 'Faculty of Allied Health Sciences')
,('M', 'Faculty of Management')
;

INSERT INTO district (title) VALUES
('Ampara')
,('Anuradhapura')
,('Badulla')
,('Batticaloa')
,('Colombo')
,('Galle')
,('Gampaha')
,('Hambantota')
,('Jaffna')
,('Kalutara')
,('Kandy')
,('Kegalle')
,('Kilinochchi')
,('Kurunegala')
,('Mannar')
,('Matale')
,('Matara')
,('Monaragala')
,('Mullaitivu')
,('Nuwara Eliya')
,('Polonnaruwa')
,('Puttalam')
,('Ratnapura')
,('Trincomalee')
,('Vavuniya')
;

# Insert Dummy Data
INSERT INTO member (email, passphrase)
VALUES 
("john@example.com", 123), 
("admin", "admin")
;

INSERT INTO fo (id, title, abbreviation) VALUES
(0, "Local Committee President", "LCP")
,(1, "incoming Global Volunteer", "iGV")
,(2, "outgoing Global Volunteer", "oGV")
,(3, "incoming Global Talent/Teacher", "iGT")
,(4, "outgoing Global Talent/Teacher", "oGT")
,(5, "Back Office Vice President", "BOVP")
;

INSERT INTO bo (id, title, abbreviation) VALUES
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

INSERT INTO valid_pair (functional_area_id, department_id) VALUES
(0,0) --president
,(1,1),(1,2),(1,3),(1,4),(1,5),(1,6) --igv
,(2,1),(2,2),(2,4),(2,6),(2,7),(2,8) --ogv
,(3,1),(3,2),(3,3),(3,4),(3,5),(3,6) --igt
,(4,1),(4,2),(4,4),(4,6),(4,7),(4,8) --ogt
;

INSERT INTO roles (id, title, abbreviation) VALUES
(0, "Local Committee President", "LCP")
,(1, "Local Committee Vice President", "LCVP")
,(2, "Manager", "MGR")
,(3, "Specialist", "SPL")
,(4, "Team Leader", "TL")
,(5, "Team Member", "TM")
,(6, "Coordinator", "CDN")
;

INSERT INTO term (title) VALUES
('2021-Summer')
,('2021-Winter')
,('2022-Summer')
,('2022-Winter')
;
