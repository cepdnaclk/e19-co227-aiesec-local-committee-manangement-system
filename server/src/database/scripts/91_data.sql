USE LC_KANDY;


/* =============== DUMMY DATA =============== */
INSERT INTO member 
(
    email, 
    passphrase,
    fullName,
    preferredName,
    frontOfficeId,
    departmentId,
    backOfficeId,
    joinedDate,
    roleId,
    contactNo,
    aiesecEmail,
    gender,
    nic,
    birthDate,
    facebookLink,
    linkedinLink,
    instagramLink,
    registerNo,
    schoolName,
    homeAddress,
    homeContact,
    districtId,
    photoLink,
    boardingAddress
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
    "iGV", 
    "IR", 
    NULL, 
    '2021-05-03', 
    "TM", 
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
    "iGV", 
    "IR", 
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

INSERT INTO igv_project (
    expaId, 
    projectName, 
    sdg, 
    jd, 
    oppProvider, 
    food, 
    transportation, 
    accommodation, 
    notes) 
VALUES (
    1234567, 
    "Global Classroom - Kandy", 
    4, 
    "1. Participate in activites to teach English to children. 2. Conduct practical activites", 
    "Britshway English Acadamy", 
    "Provided", 
    "Covered", "Provided & Covered", 
    "Only for europeans"
), (
    2345678, 
    "Test - Test", 
    17, 
    "Goal 1, Goal 2", 
    "Test Acadamy", 
    "Provided & Covered", 
    "Provided", 
    "Covered", 
    "Test Notes"
);

INSERT INTO igv_slot (
    expaId, 
    slotName, 
    startDate, 
    endDate, 
    numOpenings) 
VALUES (
    1234567,
    "Slot 1",
    "2020-01-01",
    "2020-02-02",
    "2"
);

INSERT INTO igv_question (expaId, question) VALUES 
(1234567, "What does the fox say?")
,(1234567, "Why is gamora?")
,(1234567, "When we fall asleep where do we go?")
;

INSERT INTO email_template (officeId, name, subject, body) VALUES
("iGV", "test", "test", "<p>My role is [memberFullName]</p>");

INSERT INTO igv_application (
epId,          
appId,         
appStatus,     
epName,        
memberId,
team,           
appliedDate,   
contactedDate,   
slotId,      
projectExpaId,
gender,         
homeMc,        
homeLc,        
contactNumber, 
email,          
notes,
interviewDate,
interviewTime,
epMngName,   
epMngContact,
epMngEmail,
abhDate,     
acceptedDate,
approvedDate
) VALUES 
(
1234567, 
1234567,
"Open", 
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
"2023-12-02",
"13:30",
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

-- INSERT INTO igv_slot (expa_id, title, start_date, end_date, num_openings) VALUES

-- (1234567, "August - 1", "2023-08-25", "2023-09-10", 3 )
-- ,(1234567, "September - 2", "2023-09-10", "2023-10-25" , 5)
-- ;

INSERT INTO lc_event (title, eventDescription, postLink, eventDate) VALUES

("Local Committee Meeting - November", "November month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2023-11-30")
,("Local Committee Meeting - December", "December month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2023-12-30")
,("Local Committee Meeting - January", "January month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2024-01-30")
,("Local Committee Meeting - February", "February month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2024-02-28")
,("Local Committee Meeting - March", "March month's monthly local committee meeting","https://drive.google.com/file/d/1c08PfLzraEVDqfx8bSObaISPB68JKKvC/view?usp=sharing" ,"2024-03-30")
;



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
