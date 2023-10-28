USE LC_KANDY;

CREATE TABLE ogv_applicants (
    id                      INT NOT NULL AUTO_INCREMENT,
    notes                   TEXT,
    status                  ENUM('Pre-Signup', 'Signup', 'Accepted', 'Approved', 'Realized', 'Finished', 'Completed', 'Approval-Broken', 'Realization-Broken') NOT NULL,
    
    -- Pre-Signup
    firstName               VARCHAR(255) NOT NULL,
    lastName                VARCHAR(255) NOT NULL,
    phone                   VARCHAR(20),
    email                   VARCHAR(255) NOT NULL UNIQUE,
    memberInChargeId        INT(5) NOT NULL,
    campaignId              VARCHAR(255),

    -- Signup
    sentLinks               VARCHAR(1024),
    signupNotes             VARCHAR(255),

    -- Accepted
    opportunityId           CHAR(7), -- 7 digit id
    opportunityName         VARCHAR(255),
    hostMc                  VARCHAR(255),
    hostLc                  VARCHAR(255),
    acceptedStartDate       DATE,
    acceptanceDate          DATE,
    isEseEmailSent          BOOLEAN DEFAULT FALSE,
    acceptedNotes           VARCHAR(255),

    -- Approved
    approvedDate            DATE,
    paymentDate             DATE,
    paymentAmount           DECIMAL(10, 2),
    proofLink               VARCHAR(1024),
    approvedNotes           VARCHAR(255),
    claimStatus     BOOLEAN   DEFAULT FALSE, 

    -- Realized
    realizedStartDate       DATE,
    realizedNotes           VARCHAR(255),

    -- Finished
    finishedDate            DATE,

    -- Completed
    completedDate           DATE,

    -- Approval-Broken
    approvalBreakNote       VARCHAR(255),
    
    -- Realization-Broken
    realizationBreakNote    VARCHAR(255),
    
    PRIMARY KEY (id),
    FOREIGN KEY (memberInChargeId) REFERENCES member(id),
    INDEX (status),
    INDEX (email),
    INDEX (memberInChargeId)
);

CREATE VIEW OGVApplicantDetailsInBrief AS
SELECT 
    o.id,
    o.firstName,
    o.lastName,
    o.status,
    o.phone,
    o.campaignId,
    m.preferredName AS memberInCharge,
    o.memberInChargeId
FROM 
    ogv_applicants o
LEFT JOIN 
    member m ON o.memberInChargeId = m.id;


CREATE VIEW OGVDetailsForSendReminders AS
SELECT 
    o.id,
    o.firstName,
    o.lastName,
    o.phone,
    o.campaignId,
    m.preferredName AS memberName,
    m.email AS memberEmail
FROM 
    ogv_applicants o
LEFT JOIN 
    member m ON o.memberInChargeId = m.id
WHERE
    o.status = 'Pre-Signup';

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
        m.preferredName AS memberInCharge
    FROM 
        ogv_applicants o
    LEFT JOIN 
        member m ON o.memberInChargeId = m.id
    WHERE
        o.id = applicant_id;
END;

CREATE VIEW OGVApplicationMaster AS
SELECT 
    /* application details */
    a.firstName,
    a.lastName
FROM 
    ogv_applicants as a
;
