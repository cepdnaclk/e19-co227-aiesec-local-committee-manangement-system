/* Naming Conventions
   Adapted from: https://github.com/RootSoft/Database-Naming-Convention
    tables, views, columns
        => singular
        => lowercase
        => seperated by _ (snake_case)
        => AVOID QUOTED IDENTIFIERS ("date", "First Name")
        => full words, no abbreviations unless they are common (like id)
        => no reserved words
    primary keys
        => single column primary key fields should be named id
    foreign keys
        => should be a combination of the name of the referenced table and the name of the referenced fields
*/

USE LC_KANDY;

/* ogt applications */
-- CREATE TABLE ogt_applicants (
--     id                      INT NOT NULL AUTO_INCREMENT,
--     notes                   TEXT,
--     status                  ENUM('Pre-Signup', 'Signup', 'Accepted', 'Approved', 'Realized', 'Finished', 'Completed', 'Approval-Broken', 'Realization-Broken') NOT NULL,
    
--     -- Pre-Signup
--     firstName               VARCHAR(255) NOT NULL,
--     lastName                VARCHAR(255) NOT NULL,
--     phone                   VARCHAR(20),
--     email                   VARCHAR(255) NOT NULL UNIQUE,
--     memberInChargeId        INT(5) NOT NULL,
--     campaignId              VARCHAR(255),

--     availabilityDetails     VARCHAR(512),
--     qualificatioDetails     VARCHAR(512),
--     preferredCountries      VARCHAR(255),
--     financialStatus         VARCHAR(255),

--     isGroupCreated          BOOLEAN DEFAULT FALSE,
--     isProcesExpectationSet  BOOLEAN DEFAULT FALSE,

--     -- Signup
--     sentLinks               VARCHAR(1024), --expa id for EPs
--     signupNotes             VARCHAR(255),

--     -- Accepted
--     opportunityId           CHAR(7), -- 7 digit id
--     opportunityName         VARCHAR(255),
--     hostMc                  VARCHAR(255),
--     hostLc                  VARCHAR(255),
--     acceptedStartDate       DATE,
--     acceptanceDate          DATE,
--     isEseEmailSent          BOOLEAN DEFAULT FALSE,
--     acceptedNotes           VARCHAR(255),

--     -- Approved
--     approvedDate            DATE,
--     paymentDate             DATE,
--     paymentAmount           DECIMAL(10, 2),
--     proofLink               VARCHAR(1024),
--     approvedNotes           VARCHAR(255),

--     -- Realized
--     realizedStartDate       DATE,
--     realizedNotes           VARCHAR(255),

--     -- Finished
--     finishedDate            DATE,

--     -- Completed
--     completedDate           DATE,

--     -- Approval-Broken
--     approvalBreakNote       VARCHAR(255),
    
--     -- Realization-Broken
--     realizationBreakNote    VARCHAR(255),
    
--     PRIMARY KEY (id),
--     FOREIGN KEY (memberInChargeId) REFERENCES member(id),
--     INDEX (status),
--     INDEX (email),
--     INDEX (memberInChargeId)
-- );





