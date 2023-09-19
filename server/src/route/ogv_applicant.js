const express = require("express");
const router = express.Router();
const Mailgen = require("mailgen");

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const {
  connection,
  execQuery,
  execQueryWithValues,
} = require("../database/database");
const {
  sendSystemEmail,
  sendUserEmail,
  replacePlaceholders,
} = require("../utils/email_functions");

///////////////utility functions

// for later usage
//let mailGenerator = new Mailgen({
//    theme: 'default',
//    product: {
//        // Appears in header & footer of e-mails
//        name: 'AIESEC local committee management system',
//        link: 'https://test.test/'
//    }
//});

///////////////routes

// get member details for 'select member' dropdown menu
router.get(`/members`, (req, res, next) => {
  execQuery(`
    SELECT m.id as 'key', m.preferred_name as 'value' 
    FROM member as m WHERE m.front_office_id = "oGV" AND m.department_id="CXP";`)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

// get details(selected) of all
router.get(`/applicants`, (req, res, next) => {
  execQuery("SELECT * FROM OGVApplicantDetailsInBrief")
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

// get all details of one applicant
router.get(`/applicants/:id`, (req, res, next) => {
  execQuery(`CALL GetOGVApplicantDetailsInDetail(${req.params.id})`)
    .then((rows) => {
      res.status(200).json(rows[0][0]);
    })
    .catch((err) => {
      next(err);
    });
});

// new applicant
router.post("/applicants", (req, res, next) => {
  try {
    const [fields, values] = [
      Object.keys(req.body),
      Object.values(req.body).map((value) => (value ? `'${value}'` : `NULL`)),
    ];
    const insertQuery = `INSERT INTO ogv_applicants (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(insertQuery).then((rows) => {
      // console.log(rows.insertId);
      // retrieve and send the newly added record in response for client side updates
      const selectQuery = `CALL OGVApplicantDetailsInBrief('${rows.insertId}')`;
      execQuery(selectQuery)
        .then((rows) => {
          res.status(200).json(rows[0][0]);
        })
        .catch((err) => {
          // TODO: Rollback insert or retry select query if fails
          // Else figure out a way to run both queries in one go
          next(err);
        });
    });
  } catch (err) {
    next(err);
  }
});

// update existing one
router.put("/applicants/:id", (req, res, next) => {
  try {
    const [fields, values] = [
      Object.keys(req.body),
      Object.values(req.body).map((value) => (value ? `'${value}'` : `NULL`)),
    ];

    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < fields.length; i++) {
      updateString += fields[i] + " = ";
      updateString += values[i] + ", ";
    }

    // remove last trailling ", "
    updateString = updateString.substring(0, updateString.length - 2);

    const query = `UPDATE ogv_applicants SET ${updateString} WHERE id='${req.params.id}'; CALL OGVApplicantDetailsInBrief('${req.params.id}');`;
    execQuery(query)
      .then((rows) => {
        console.log(rows);
        res.status(200).json(rows[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//delete application
router.delete("/applicants/:id", (req, res, next) => {
  const deleteQuery = `DELETE FROM ogv_applicants WHERE id=${req.params.id}`;
  execQuery(deleteQuery)
    .then((rows) => {
      console.log(rows);
      res.status(200).json({ id: req.params.id, message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

//////////Emails

// send a reminder (for testing)
//router.post('/sendReminders', (req, res, next) => {

//    sendReminders(req.body.receiver)
//        .then(() => {
//            res.status(200).json({ msg: 'Reminder sent' })
//        })
//        .catch((err) => {
//            next(err)
//        })

//});

// for now testing only
router.post("/send6weekChallengeMail", (req, res, next) => {
  // below code only for testing
  //// generate email
  //let emailBody = {
  //    body: {
  //        name: 'User',
  //        intro: 'Reminder',
  //        action: {
  //            instructions: 'This is a test email :',
  //            button: {
  //                color: 'green',
  //                text: 'Check',
  //                link: 'https://test.test'
  //            }
  //        }
  //    }
  //};
  //// Using mailGenerator to generate the email body
  //let generatedEmailBody = mailGenerator.generate(emailBody);
  //// Process attachments
  //let attachments = req.body.attachments ? req.body.attachments : [];
  //sendSystemEmail(req.body.email, req.body.cc, req.body.bcc, req.body.subject, generatedemailbody, attachments)
  //    .then((info) => {
  //        res.status(201).json({
  //            msg: "email sent",
  //            info: info.messageid,
  //            preview: nodemailer.gettestmessageurl(info)
  //        });
  //    })
  //    .catch((err) => {
  //        next(err)
  //    });
});

router.post("/sendApprovedMail", (req, res) => {});

// send ese mail template to client , placeholders replaced with req.data
router.get("/sendESEMail", (req, res, next) => {

    let eseMailQuery = "SELECT * FROM email_template WHERE name = 'ese'";

    return execQuery(eseMailQuery)
        .then((rows) => {
            let emailData = rows[0];

            template_data = {

            // UPDATE THIS for placeholders

                //member_name: member_name,
                //applicant_details: applicant_details
            };

            let emailBody = replacePlaceholders(emailData.body, template_data);

            let email = {
                name: emailData.name,
                subject: emailData.subject, 
                body: emailBody,
                cc: emailData.cc,
                bcc: emailData.bcc,
                attachments: JSON.parse( emailData.attachments )
            }

            res.status(200).json(email);
        })
        .catch((err) => {
            next(err);
        });



});

// send ese email to req.receiver from req.userEmail and update db
router.post("/sendESEMail", async (req, res, next) => {
    try {
        const { userEmail, attachments, receiver, cc, bcc, subject, body } = req.body;

        const response = await sendUserEmail(userEmail, attachments, receiver, cc, bcc, subject, body);

        // Using a parameterized query to prevent SQL injection
        await execQueryWithValues(`UPDATE ogv_applicants SET isEseEmailSent = 1 WHERE email = ?`, [receiver]);

        res.send("Email sent: " + response);

    } catch (err) {
        if (err.message === "User Email is not Authenticated.") {
            res.status(404).send(err.message);
        } else {
            next(err);
        }
    }
});


module.exports = router;
