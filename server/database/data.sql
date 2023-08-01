USE LC_KANDY;

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