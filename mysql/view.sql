CREATE VIEW OGVApplicantDetailsInBrief AS
SELECT 
    o.id,
    o.firstName,
    o.lastName,
    o.status,
    o.phone,
    o.campaignId,
    m.preferred_name AS memberInCharge
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
    m.preferred_name AS memberName,
    m.email AS memberEmail
FROM 
    ogv_applicants o
LEFT JOIN 
    member m ON o.memberInChargeId = m.id
WHERE
    o.status = 'Pre-Signup';