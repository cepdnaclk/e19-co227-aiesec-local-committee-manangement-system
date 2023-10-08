USE LC_KANDY;

/* =============== UPCOMING EVENTS TABLE =========*/
CREATE TABLE lc_event (

    eventId                INT(4) AUTO_INCREMENT PRIMARY KEY,
    title                  VARCHAR(50),
    eventDescription       VARCHAR(200),
    postLink               VARCHAR(255),
    eventDate              DATE

);
