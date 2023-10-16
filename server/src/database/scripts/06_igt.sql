USE LC_KANDY;


CREATE TABLE igt_application (
    epId            INT(7),
    appId           INT(5) AUTO_INCREMENT PRIMARY KEY, /* one ep can have multiple applications*/
    appStatus       ENUM('Open', 'Withdrawn', 'Rejected', 'ABH', 'Accepted', 'Approved'),
    epName          VARCHAR(50),
    memberId        INT(5),
    team            VARCHAR(15),
    appliedDate     DATE NULL,
    contactedDate   DATE,
    slotId          INT(4),
    -- projectExpaId   INT(7),
    gender          CHAR(1),
    homeMc          VARCHAR(25),
    homeLc          VARCHAR(25),
    contactNumber   VARCHAR(15),
    email           VARCHAR(50),
    notes           VARCHAR(150),
    claimStatus     BOOLEAN   DEFAULT FALSE,     

    /* interview details will be filled after scheduling the interview */
    interviewDate   DATE,
    interviewTime   TIME, 

    /* EP Manager details */
    epMngName       VARCHAR(20),
    epMngContact    VARCHAR(15),
    epMngEmail      VARCHAR(50),

    /* date recording */
    abhDate         DATE,
    acceptedDate    DATE,
    approvedDate    DATE,

    /* realization */
    realizedDate    DATE,
    paymentDate     DATE,
    paymentAmount   DECIMAL(10, 2),
    proofLink       CHAR(100),

    /* finished */
    finishedDate    DATE,

    /* completed */
    completedDate    DATE,


    -- FOREIGN KEY (projectExpaId) REFERENCES igv_project(expaId)
    -- ON DELETE SET NULL ON UPDATE SET NULL,
    -- FOREIGN KEY (slotId) REFERENCES igv_slot(slotId)
    -- ON DELETE SET NULL ON UPDATE SET NULL,
    FOREIGN KEY (memberId) REFERENCES member(id)
    ON DELETE SET NULL ON UPDATE SET NULL
);
