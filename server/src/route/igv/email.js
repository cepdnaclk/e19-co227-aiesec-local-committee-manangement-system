const express = require("express");
const router = express.Router();
const { execQuery } = require("../../database/database");
const { replacePlaceholders } = require("../../utils/email_functions");

// get all available placeholders that can be added to the template
router.get("/placeholders", (req, res, next) => {
  execQuery(
    "SELECT JSON_ARRAYAGG(column_name) AS columns FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'IGVApplicationMaster';"
  )
    .then((rows) => {
      //   console.log(rows);
      res.status(200).send(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:appId", (req, res, next) => {
  const getAllTemplates = `SELECT 
                                et.id,
                                et.name,
                                ies.status
                            FROM 
                                email_template AS et
                            LEFT JOIN 
                                igv_email_status AS ies ON et.id = ies.templateId
                            WHERE 
                                ies.appId = ?;
                            `;

  execQuery(getAllTemplates, [req.params.appId])
    .then((rows) => {
      if (
        !rows
        // || rows.length === 0
      ) {
        return res.status(404).send("Applicant not found.");
      }

      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:appId/:templateId", async (req, res, next) => {
  try {
    // Fetching applicant details
    // let igvApplicantDetailQuery = `CALL GetIGVApplicantDetails(${req.params.appId});`;
    let igvApplicantDetailQuery = `SELECT * FROM IGVApplicationMaster WHERE appId='${req.params.appId}';`;
    let applicantDetails = await execQuery(igvApplicantDetailQuery);

    // if (!applicantDetails[0][0] || applicantDetails[0][0].length === 0) {
    if (!applicantDetails[0] || applicantDetails[0].length === 0) {
      return res.status(404).send("Applicant not found.");
    }

    // Fetching email_template data
    let emailTemplateQuery = `SELECT * FROM email_template WHERE id = ${req.params.templateId};`;
    let emailTemplateDetails = await execQuery(emailTemplateQuery);

    if (!emailTemplateDetails || emailTemplateDetails.length === 0) {
      return res.status(404).send("Email template not found.");
    }

    // Extract data from the result to variables
    // let applicantData = applicantDetails[0][0];
    let applicantData = applicantDetails[0];

    let template_data = Object.keys(applicantData).reduce((obj, key) => {
      obj[key] = applicantData[key];
      return obj;
    }, {});

    let emailData = emailTemplateDetails[0];
    let emailBody = replacePlaceholders(emailData.body, template_data);

    let email = {
      id: emailData.id,
      name: emailData.name,
      from: applicantData.memberEmail,
      to: applicantData.applicantEmail,
      subject: emailData.subject,
      body: emailBody,
      cc: JSON.parse(emailData.cc),
      bcc: JSON.parse(emailData.bcc),
      attachments: JSON.parse(emailData.attachments),
    };

    res.status(200).json(email);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
