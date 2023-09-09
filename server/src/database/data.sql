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

INSERT INTO igv_application_status (status_id, status_name) VALUES
(0, "Open"),(1,"Rejected"), (2, "Withdrawn"),(3,"Accepted By Host"),(4, "Accepted"),
(5, "Approved"),(6, "Approval Broken"),(7,"Realized"),(8,"Realizaiton Broken"),
(9,"Finished"),(10, "Completed");

/* =============== DUMMY DATA =============== */
INSERT INTO member 
(
    email, 
    passphrase,
    full_name,
    preferred_name,
    front_office_id,
    department_id,
    back_office_id,
    joined_date,
    role_id,
    contact_no,
    aiesec_email,
    gender,
    nic,
    birth_date,
    facebook_link,
    linkedin_link,
    instagram_link,
    register_no,
    school_name,
    home_address,
    home_contact,
    district_id,
    photo_link,
    boarding_address
)
VALUES 
(
    "john@example.com", 
    123,
    "John Doe",
    "John",
    "1",
    "1",
    "1",
    "2019-01-01",
    "1",
    "1234567890",
    "john@example.com",
    "M",
    "1234567890",
    "2002-01-01",
    "john@facebook.com",
    "john@linkedin.com",
    "john@instagram.com",
    "E/02/002",
    "School",
    "No.2 Kings Street, Kandy",
    "1234567890",
    "1",
    "https://drive.google.com/file/d/1ADL_F1F12M-f9DwB416OzOysLWP-BigE/view?usp=sharing",
    "No.3 Kings Street, Kandy"
)
,(
    'jane.smith@example.com',
    'pass123',
    'Jane Smith', 
    'Janie', 
    2, 
    1, 
    3, 
    '2022-08-20', 
    3, 
    '555-123-4567', 
    'jane.smith@aiesec.org', 
    'F', 
    "9876543210", 
    '1998-03-25', 
    'https://www.facebook.com/janesmith', 
    'https://www.linkedin.com/in/janesmith', 
    'https://www.instagram.com/janesmith', 
    '2', 
    'Sample High School', 
    '789 Oak Ave, Town', 
    '123-987-4560', 
    4, 
    'https://drive.google.com/file/d/1bfWwEMlz2OZT35i7GPinWkjSuhgqvu7z/view?usp=sharing', 
    '567 Pine Ave, Town'
)
,(
    'michael.johnson@example.com', 
    'mikepass', 
    'Michael Johnson', 
    'Mike', 
    3, 
    1, 
    2, 
    '2021-05-03', 
    2, 
    '999-555-1212', 
    'michael.johnson@aiesec.org', 
    'M', 
    "5555555550", 
    '1990-12-15', 
    'https://www.facebook.com/mikejohnson', 
    'https://www.linkedin.com/in/mikejohnson', 
    'https://www.instagram.com/mikejohnson', 
    '3', 
    'Test High School', 
    '111 Maple Rd, Village', 
    '777-888-9999', 
    1, 
    'https://drive.google.com/file/d/12eQiW6RUUVqPkY37vxYM1KXGSPTT11MD/view?usp=sharing', 
    '222 Birch Rd, Village'
)
,(
    'alexandra.jackson@example.com', 
    'alexpass', 
    'Alexandra Jackson', 
    'Alex', 
    2, 
    2, 
    1, 
    '2020-11-28', 
    4, 
    '111-222-3333', 
    'alexandra.jackson@aiesec.org', 
    'M', 
    "4444444440", 
    '1988-07-20', 
    'https://www.facebook.com/alexjackson', 
    'https://www.linkedin.com/in/alexjackson', 
    'https://www.instagram.com/alexjackson', 
    '4', 
    'Example Academy', 
    '555 Elm Ave, Village', 
    '333-111-2222', 
    2, 
    'https://drive.google.com/file/d/1N4QLzpMHWTY2vXxzYWI126NeRy3RHE3Z/view?usp=sharing', 
    '666 Maple Ave, Village'
),
(
    "tomioka@example.com", 
    123,
    "mizu123",
    "Giyuu",
    "1",
    "1",
    "1",
    "2019-01-01",
    "4",
    "1234567890",
    "tomioka@example.com",
    "M",
    "1234567890",
    "2002-01-01",
    "tomioka@facebook.com",
    "tomioka@linkedin.com",
    "tomioka@instagram.com",
    "E/02/003",
    "School",
    "No.2 Kings Street, Kandy",
    "1234567890",
    "1",
    "https://drive.google.com/file/d/1_5ttCoLPOlmsMD5lIk8wZ11fxj_lBTgR/view?usp=sharing",
    "No.3 Kings Street, Kandy"
)
;

INSERT INTO term VALUES
('22-Summer', '2022-01-01', '2022-05-01', '2022-03-01')
,('22-Winter', '2022-06-01', '2022-12-01', '2022-07-01')
;

INSERT INTO igv_project (expa_id, project_name, sdg, jd, opp_provider, food, transportation, accommodation, notes) VALUES
(1234567, "Global Classroom - Kandy", 4, 
"1. Participate in activites to teach English to children. 
2. Conduct practical activites", "Britshway English Acadamy", "Provided", "Covered", "Provided and Covered", "Only for europeans" );
INSERT INTO igv_slot (expa_id, title, start_date, end_date, num_openings) VALUES 
(
    1234567,
    "Slot 1",
    "2020-01-01",
    "2020-02-02",
    "2"
);

INSERT INTO igv_question (expa_id, question) VALUES 
(1234567, "What does the fox say?")
,(1234567, "Why is gamora?")
,(1234567, "When we fall asleep where do we go?")
;

INSERT INTO igv_application (
ep_id,          
app_id,         
app_status,     
ep_name,        
incharge_member_id,
team,           
applied_date,   
contacted_date,   
slot_id,      
project_expa_id,
gender,         
home_mc,        
home_lc,        
contact_number, 
email,          
notes,
interview_date,
interview_time,
ep_mng_name,   
ep_mng_contact,
ep_mng_email,
abh_date,     
accepted_date,
approved_date
) VALUES 
(
1234567, 
1234567,
"OPEN", 
"Tony Tamer", 
1, 
"Team1", 
"2023-07-31",
"2023-08-01",
1,
1234567,
"M", 
"Turkey", 
"ANKARA",
"092092484",
"tony@aiesec.net",
"Note test 1 3 4",
"2023-10-02",
"1.30 PM",
"EP manager 1",
"03655989966",
"abuoew@aiesec.net",
"2023-08-02",
"2023-08-03",
"2023-08-04"
);



/*INSERT INTO igv_interview_log (app_id, question_id, answer) VALUES

(1234567, 1, "Awoooo")
,(1234567, 2, "What?")
,(1234567, 3, "Ananthayata")
;*/

INSERT INTO igv_slot (expa_id, title, start_date, end_date, num_openings) VALUES

(1234567, "August - 1", "2023-08-25", "2023-09-10", 3 )
,(1234567, "September - 2", "2023-09-10", "2023-10-25" , 5)
;

INSERT INTO lc_event (title, event_description, post_link, event_date) VALUES

("Local Committee Meeting - August", "August month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2023-08-30")
,("Local Committee Meeting - September", "August month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2023-08-30")
;

INSERT INTO email_templates (name, subject, body) VALUES

("reminder", "Reminder (via LCMS)", 

"<p>This Email is sent to <strong>remind </strong>you that you are assigned to someone :).</p>
<p>&nbsp;</p>
<p>Thank You,</p>
<p>AIESEC local committee management system</p>" ),

("approved", "Your application is approved", 

"<p>Happy to say that your application is approved. yeee !!</p>
<p>&nbsp;</p>
<p>Thank You,</p>
<p>AIESEC local committee management system</p>");