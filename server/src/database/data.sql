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

INSERT INTO role (title, id) VALUES
("Local Committee President", "LCP")
,("Local Committee Vice President", "LCVP")
,("Manager", "MGR")
,("Specialist", "SPL")
,("Team Leader", "TL")
,("Team Member", "TM")
,("Coordinator", "CDN")
;

INSERT INTO front_office (title, id) VALUES
("Local Committee President", "LCP")
,("incoming Global Volunteer", "iGV")
,("outgoing Global Volunteer", "oGV")
,("incoming Global Talent/Teacher", "iGT")
,("outgoing Global Talent/Teacher", "oGT")
,("Back Office Vice President", "BOVP")
;

INSERT INTO back_office (title, id) VALUES
("BRAND", "BND")
,("Finance and Legal", "FnL")
,("Business Development", "BD")
,("People Management", "PM")
,("Information Management", "IM")
,("Expansions Management", "EM")
,("Public Relations and Engage with AIESEC", "PnE")
;

INSERT INTO department (title, id) VALUES
("Local Committee President", "LCP")
,("Vice President", "VP")
,("International Relations", "IR")
,("Matching", "M")
,("Business to Business", "B2B")
,("Value Delivery", "VD")
,("Marketing", "MKT")
,("Business to Customer", "B2C")
,("Customer Experience", "CXP")
;

/* commenting with -- gives a parse error in node */
INSERT INTO front_valid_pair (office_id, department_id) VALUES
("LCP","LCP") /* president */
,("iGV","VP"),("iGV","IR"),("iGV","M"),("iGV","B2B"),("iGV","VD"),("iGV","MKT") /* igv */
,("oGV","VP"),("oGV","IR"),("oGV","B2B"),("oGV","MKT"),("oGV","B2C"),("oGV","CXP") /* ogv */
,("iGV","VP"),("iGV","IR"),("iGV","M"),("iGV","B2B"),("iGV","VD"),("iGV","MKT") /* igt */
,("oGT","VP"),("oGT","IR"),("oGT","B2B"),("oGT","MKT"),("oGT","B2C"),("oGT","CXP") /* ogt */
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
    "astromp01@gmail.com", 
    123,
    "John Doe",
    "John",
    "LCP",
    "LCP",
    NULL,
    "2019-01-01",
    "LCP",
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
    'sankapeeris360@gmail.com',
    '123',
    'Jane Smith', 
    'Janie', 
    "oGV", 
    "CXP", 
    NULL, 
    '2022-08-20', 
    "SPL", 
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
    "oGV", 
    "CXP", 
    NULL, 
    '2021-05-03', 
    "SPL", 
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
    "oGV", 
    "CXP", 
    NULL,
    '2020-11-28', 
    "TM", 
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
    "oGV", 
    "CXP", 
    NULL,
    "2019-01-01",
    "TL",
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

INSERT INTO email_template (name, subject, body, attachments) VALUES

("reminder", "Reminder (via LCMS)", 

"<p>Hi {{member_name}} !</p>
<p>This Email is sent to <strong>remind </strong>you that you are assigned to an OGV applicant.</p>
<p style='margin-left:40px'>applicant&#39;s details :&nbsp;</p>
<p style='margin-left:80px'>{{applicant_details}}</p>
<p>&nbsp;</p>
<p>Thank You,</p>
<p>AIESEC local committee management system</p>",
'["https://assets.website-files.com/60a2e3be4c28b25f35f6a54a/621bcef94c58054c38ae8305_AIESEC_OG.jpg"]'),

("ese", "Test Ese email subject", 

"<p>Test Email Body!! </p>
<p>&nbsp;</p>
<p>Thank You,</p>
<p>AIESEC local committee management system</p>", '["https://assets.website-files.com/60a2e3be4c28b25f35f6a54a/621bcef94c58054c38ae8305_AIESEC_OG.jpg"]');

INSERT INTO ogv_applicants (
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
    acceptedStartDate,
    acceptanceDate,
    isEseEmailSent,
    acceptedNotes,
    approvedDate,
    paymentDate,
    paymentAmount,
    proofLink,
    approvedNotes,
    realizedStartDate,
    realizedNotes,
    finishedDate,
    completedDate,
    approvalBreakNote,
    realizationBreakNote
) VALUES (
    'Signup',
    'John',
    'Doe',
    '+1234567890',
    'sankapeeris360@gmail.com',
    2, -- Assuming memberInChargeId corresponds to an existing member with ID 1
    'Campaign123',
    'http://link1.com,http://link2.com',
    'Notes about the signup',
    1234567, -- Assuming opportunityId corresponds to an existing opportunity with ID 1234567
    'Opportunity Name',
    'Host MC',
    'Host LC',
    '2023-09-18',
    '2023-09-20',
    1, -- Assuming isEseEmailSent should be set to TRUE
    'Notes about acceptance',
    '2023-09-25',
    '2023-09-26',
    500.00, -- Assuming paymentAmount
    'http://prooflink.com',
    'Notes about approval',
    '2023-10-01',
    'Notes about realization',
    '2023-10-10',
    '2023-10-15',
    'Notes about approval break',
    'Notes about realization break'
), (
    'Accepted',
    'Alice',
    'Smith',
    '+9876543210',
    'alicesmith@example.com',
    3, -- Assuming memberInChargeId corresponds to an existing member with ID 2
    'Campaign456',
    'http://link3.com,http://link4.com',
    'Notes about the signup',
    7654321, -- Assuming opportunityId corresponds to an existing opportunity with ID 7654321
    'Another Opportunity',
    'Another Host MC',
    'Another Host LC',
    '2023-09-22',
    '2023-09-24',
    0, -- Assuming isEseEmailSent should be set to FALSE
    'Additional notes about acceptance',
    '2023-09-28',
    '2023-09-29',
    750.50, -- Assuming paymentAmount
    'http://anotherprooflink.com',
    'Additional notes about approval',
    '2023-10-05',
    'Additional notes about realization',
    '2023-10-12',
    '2023-10-18',
    'Additional notes about approval break',
    'Additional notes about realization break'
), (
    'Realized',
    'Sarah',
    'Johnson',
    '+5551234567',
    'sarahjohnson@example.com',
    4, -- Assuming memberInChargeId corresponds to an existing member with ID 3
    'Campaign789',
    'http://link5.com,http://link6.com',
    'Notes about the signup',
    9876543, -- Assuming opportunityId corresponds to an existing opportunity with ID 9876543
    'Realized Opportunity',
    'MC for Realized',
    'LC for Realized',
    '2023-09-10',
    '2023-09-15',
    1, -- Assuming isEseEmailSent should be set to TRUE
    'Notes about acceptance',
    '2023-09-20',
    '2023-09-22',
    900.75, -- Assuming paymentAmount
    'http://realizedprooflink.com',
    'Notes about approval',
    '2023-10-01',
    'Notes about realization',
    '2023-10-10',
    '2023-10-20',
    'Notes about approval break',
    'Notes about realization break'
), (
    'Pre-Signup',
    'Michael',
    'Brown',
    '+1234567890',
    'michaelbrown@example.com',
    5, -- Assuming memberInChargeId corresponds to an existing member with ID 4
    'Campaign101',
    NULL, -- No sentLinks for pre-signup
    'Notes about the pre-signup',
    NULL, -- No opportunityId for pre-signup
    NULL, -- No opportunityName for pre-signup
    NULL, -- No hostMc for pre-signup
    NULL, -- No hostLc for pre-signup
    NULL, -- No acceptedStartDate for pre-signup
    NULL, -- No acceptanceDate for pre-signup
    NULL, -- No isEseEmailSent for pre-signup
    NULL, -- No acceptedNotes for pre-signup
    NULL, -- No approvedDate for pre-signup
    NULL, -- No paymentDate for pre-signup
    NULL, -- No paymentAmount for pre-signup
    NULL, -- No proofLink for pre-signup
    NULL, -- No approvedNotes for pre-signup
    NULL, -- No realizedStartDate for pre-signup
    NULL, -- No realizedNotes for pre-signup
    NULL, -- No finishedDate for pre-signup
    NULL, -- No completedDate for pre-signup
    NULL, -- No approvalBreakNote for pre-signup
    NULL -- No realizationBreakNote for pre-signup
), (
    'Approved',
    'Emily',
    'Johnson',
    '+9876543210',
    'emilyjohnson@example.com',
    2, -- Assuming memberInChargeId corresponds to an existing member with ID 5
    'CampaignXYZ',
    'http://link7.com,http://link8.com',
    'Notes about the signup',
    8765432, -- Assuming opportunityId corresponds to an existing opportunity with ID 8765432
    'Approved Opportunity',
    'Approved MC',
    'Approved LC',
    '2023-09-12',
    '2023-09-14',
    1, -- Assuming isEseEmailSent should be set to TRUE
    'Notes about acceptance',
    '2023-09-19',
    '2023-09-21',
    1200.99, -- Assuming paymentAmount
    'http://approvedprooflink.com',
    'Notes about approval',
    NULL, -- No realizedStartDate for Approved status
    NULL, -- No realizedNotes for Approved status
    NULL, -- No finishedDate for Approved status
    NULL, -- No completedDate for Approved status
    NULL, -- No approvalBreakNote for Approved status
    NULL -- No realizationBreakNote for Approved status
);
