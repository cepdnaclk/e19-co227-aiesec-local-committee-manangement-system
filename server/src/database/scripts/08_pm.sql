USE LC_KANDY;

CREATE TABLE badge (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    name                        VARCHAR(100),
    icon                        BLOB
);

CREATE TABLE achievement (
    memberId                    INT(5),
    badgeId                     INT,
    FOREIGN KEY (memberId)      REFERENCES member(id),
    FOREIGN KEY (badgeId)       REFERENCES badge(id)
);

INSERT INTO badge (name, icon) VALUES 
('Best Newbie', '');