const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { connection, execQuery } = require("../database/database");
const {
  sendSystemEmail,
  sendUserEmail,
  replacePlaceholders,
  oAuth2Client,
} = require("../utils/email_functions");

function send_email(reciver, cc, bcc, subject, body, attachments) {

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let ProcessedAttachments = attachments ? attachments.map(attachmentPath => {
        return {
            filename: path.basename(attachmentPath),
            path: attachmentPath,
            cid: path.basename(attachmentPath) // Extract filename for CID
        };
    }) : [];


    let message = {
        from: `no-reply AIESEC LCMS <${process.env.GMAIL_APP_USER}>`,
        to: reciver,
        cc: cc,
        bcc: bcc,
        subject: subject || 'system message from AIESEC lcms!',
        html: body,
        attachments: ProcessedAttachments
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });

}


function replacePlaceholders(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, function (match, placeholder) {
        return data[placeholder] || '';
    });
}


// for later usage
let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'AIESEC local committee management system',
        link: 'https://test.test/'
    }
});


/*=======================REMINDERS=================================*/
function fetchPreSignupMembers(callback) {
    const query = 'SELECT * FROM OGVDetailsForSendReminders';

    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}


const sendReminders = (member_email, member_name, applicant_details) => {

// create email template
router.post("/template/create", (req, res, next) => {
    let sql = `INSERT INTO email_template (name, subject, body, cc, bcc ,attachments) VALUES ('${req.body.name}', '${req.body.subject}', '${req.body.body}','${req.body.cc ? req.body.cc : null}','${req.body.bcc ? req.body.bcc:null}', '${req.body.attachments}')`;

  execQuery(sql)
    .then((rows) => {
      res.status(200).json({ msg: "successfully created" });
    })
    .catch((err) => {
      next(err);
    });
});

// delete email template
router.delete("/template/:name", (req, res, next) => {
  let sql = `DELETE FROM email_template WHERE name = '${req.params.name}'`;

  execQuery(sql)
    .then((rows) => {
      res.status(200).json({ msg: "successfully deleted" });
    })
    .catch((err) => {
      next(err);
    });
});

// get email template
router.get("/template/:name", (req, res, next) => {
  let sql = `SELECT * FROM email_template WHERE name = '${req.params.name}'`;

  execQuery(sql)
    .then((rows) => {
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// update email template
router.put("/template/:name", (req, res, next) => {
    let sql = `UPDATE email_template SET subject = '${req.body.subject}', body = '${req.body.body}', attachments = '${req.body.attachments}' ,cc = '${req.body.cc ? req.body.cc : null}',bcc = '${req.body.bcc ? req.body.bcc : null}'  WHERE name = '${req.params.name}'`;

  execQuery(sql)
    .then((rows) => {
      res.status(200).json({ msg: "template updated" });
    })
    .catch((err) => {
      next(err);
    });
});

<<<<<<< HEAD

/*------------------EMAILS THROUGH SYSTEM---------------------------------------*/

// send a reminder (for testing)
router.post('/sendReminders', (req, res, next) => {

    sendReminders(req.body.receiver)
        .then(() => {
            res.status(200).json({ msg: 'Reminder sent' })
        })
        .catch((err) => {
            next(err)
        })

});

// for now testing only
router.post('/send6weekChallengeMail', (req, res, next) => {
    // below code only for testing 

    // generate email
    let emailBody = {
        body: {
            name: 'User',
            intro: 'Reminder',
            action: {
                instructions: 'This is a test email :',
                button: {
                    color: 'green',
                    text: 'Check',
                    link: 'https://test.test'
                }
            }
        }
    };

    // Using mailGenerator to generate the email body
    let generatedEmailBody = mailGenerator.generate(emailBody);


    // Process attachments
    let attachments = req.body.attachments ? req.body.attachments : [];



    send_email(req.body.email, req.body.cc, req.body.bcc, req.body.subject, generatedemailbody, attachments)
        .then((info) => {
            res.status(201).json({
                msg: "email sent",
                info: info.messageid,
                preview: nodemailer.gettestmessageurl(info)
            });
        })
        .catch((err) => {
            next(err)
        });


});

router.post('/sendApprovedMail', (req, res) => {

});

router.post('/sendESEMail', (req, res) => {

});



=======
/*------------------ EMAILS THROUGH USERS ---------------------------------------*/
>>>>>>> ddc7d49713e0137e0b86fc44bce3fd7cc4ae18e9

//google authentication for user's to access data
router.get("/auth", (req, res) => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://mail.google.com/", "openid", "email"],
    });
    res.status(200).send(authUrl);
  } catch (err) {
    res.status(500).send("Google Authentication initialization error");
  }
});

// google redirects to this endpoint
router.get("/auth/callback", async (req, res) => {
  try {
    const response = await oAuth2Client.getToken(req.query.code);
    /*console.log("Token response:", response);*/
    const tokens = response.tokens;

    /*console.log("tokens: ",tokens);*/

    oAuth2Client.setCredentials(tokens);

    if (!tokens.id_token || tokens.id_token.split(".").length !== 3) {
      throw new Error("Invalid or missing id_token");
    }

    const decodedToken = jwt.decode(tokens.id_token);
    const userEmail = decodedToken.email;

    let rows = await execQuery(
      `SELECT email FROM user_gmail_data WHERE email = '${userEmail}' ;`
    );

    if (rows.length == 0) {
      await execQuery(
        `INSERT INTO user_gmail_data (email, accessToken, refreshToken, tokenExpiry) VALUES ('${userEmail}', '${tokens.access_token}', '${tokens.refresh_token}', '${tokens.expiry_date}')`
      );
    } else {
      await execQuery(
        `UPDATE user_gmail_data SET accessToken = '${tokens.access_token}', tokenExpiry = '${tokens.expiry_date}' WHERE email = '${userEmail}'`
      );
    }
    /* res.redirect('http://localhost:8081/email/sendemail');*/
    res.send("Authenticated successfully!");
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication error.");
  }
});

router.get("/sendEmail", async (req, res, next) => {
  try {
    const { userEmail, attachments, receiver, cc, bcc, subject, body } =
      req.body;
    const response = await sendUserEmail(
      userEmail,
      attachments,
      receiver,
      cc,
      bcc,
      subject,
      body
    );
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
