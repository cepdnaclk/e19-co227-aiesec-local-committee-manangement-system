/*table for storing templates of emails*/
CREATE TABLE email_template (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    officeId        VARCHAR(4)      NOT NULL,
    name            VARCHAR(255)    NOT NULL UNIQUE,
    subject         VARCHAR(255)    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    body            LONGTEXT        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    cc              JSON,
    bcc             JSON,
    attachments     JSON,

    INDEX(id),
    INDEX(officeId)

) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


/*table for user's gmail date'*/
CREATE TABLE user_gmail_data (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    accessToken     TEXT ,
    refreshToken    TEXT ,
    tokenExpiry     BIGINT
);