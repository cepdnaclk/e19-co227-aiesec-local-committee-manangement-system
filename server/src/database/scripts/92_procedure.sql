-- OGV

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




