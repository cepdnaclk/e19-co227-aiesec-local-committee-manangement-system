USE LC_KANDY;

# Insert Static Data
INSERT INTO faculty (title) VALUES
('Faculty of Agriculture')
,('Faculty of Arts')
,('Faculty of Dental Sciences')
,('Faculty of Engineering')
,('Faculty of Medicine')
,('Faculty of Science')
,('Faculty of Veterinary Medicine and Animal Science')
,('Faculty of Allied Health Sciences')
,('Faculty of Management')
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

INSERT INTO functional_area (title, abbreviation) VALUES
('function 1', 'f1')
,('function 2', 'f2')
;

INSERT INTO department (title, abbreviation) VALUES
('department 1.1', 'd1.1')
,('department 1.2', 'd1.2')
,('department 2.1', 'd2.1')
,('department 2.2', 'd2.2')
;

INSERT INTO valid_pair (functional_area_id, department_id) VALUES
('1', '1')
,('1', '2')
,('2', '3')
,('2', '4')
;

INSERT INTO term (title) VALUES
('2021-Summer')
,('2021-Winter')
,('2022-Summer')
,('2022-Winter')
;

INSERT INTO role (title) VALUES
('role1')
,('role2')
,('role3')
;