USE LC_KANDY;

CREATE TABLE badge (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    name                        VARCHAR(100),
    image                       VARCHAR(100)
);

CREATE TABLE achievement (
    memberId                    INT(5),
    badgeId                     INT,
    FOREIGN KEY (memberId)      REFERENCES member(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (badgeId)       REFERENCES badge(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE VIEW MemberAchievements AS
SELECT
    b.id,
    b.name,
    b.image,
    a.memberId
FROM badge as b 
LEFT JOIN achievement as a 
ON a.badgeId = b.id;