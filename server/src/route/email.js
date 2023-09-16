const express = require('express');
const router = express.Router();
const path = require('path'); // Added for extracting filename from path
const cron = require('node-cron');

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();


const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");

const REDIRECT_URL = 'http://localhost:8081/email/auth/callback';
const oAuth2Client = new OAuth2Client(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, REDIRECT_URL);


const { connection, execQuery } = require("../database/database");


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
    const query = 'SELECT * FROM DetailsForSendReminders';

    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}


const sendReminders = (member_email, member_name, applicant_details) => {


    let reminder_mail = "SELECT * FROM email_template WHERE name = 'reminder'";
    let cc = null;
    let bcc = null;

    // Return the Promise from execQuery so it can be used in the Promise chain
    return execQuery(reminder_mail)
        .then((rows) => {
            let emailData = rows[0];

            template_data = {
                member_name: member_name,
                applicant_details: applicant_details
            };

            let emailBody = replacePlaceholders(emailData.body, template_data);

            return send_email(member_email, cc, bcc, emailData.subject, emailBody, JSON.parse(emailData.attachments));
        });

};

function callReminder() {

    console.log("Sending Reminders");

    fetchPreSignupMembers(rows => {
        rows.forEach(row => {

            let applicant_details = `<ul><li>id : ${row.id}</li><li>First Name : ${row.first_name}</li><li>Last Name : ${row.last_name}</li><li>Phone No : ${row.phone}</li><li>Campaign ID : ${row.campaign_id}</li>`;

            /*console.log("Reminder: ", row.member_email, row.member_name, applicant_details);*/
            sendReminders(row.member_email, row.member_name, applicant_details);
        
        });
    });
};

// sending reminders every 20 sec :: TODO: add suitable time period , formatting email
/*cron.schedule('20 * * * * *', callReminder);*/

/*=================================================================*/

// routes

// create email template
router.post('/template/create', (req, res, next) => {

    let sql = `INSERT INTO email_template (name, subject, body, attachments) VALUES ('${req.body.name}', '${req.body.subject}', '${req.body.body}', '${req.body.attachments}')`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "successfully created" })
        })
        .catch((err) => {
            next(err)
        });

});

// delete email template
router.delete('/template/:name', (req, res, next) => {

    let sql = `DELETE FROM email_template WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "successfully deleted" })
        })
        .catch((err) => {
            next(err)
        });

});

// get email template
router.get('/template/:name', (req, res, next) => {

    let sql = `SELECT * FROM email_template WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json(rows[0])
        })
        .catch((err) => {
            next(err)
        });

});

// update email template
router.put('/template/:name', (req, res, next) => {

    let sql = `UPDATE email_template SET subject = '${req.body.subject}', body = '${req.body.body}', attachments = '${req.body.attachments}' WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "template updated" })
        })
        .catch((err) => {
            next(err)
        });

});


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





/*------------------EMAILS THROUGH USERS---------------------------------------*/

//google authentication for user's to access data
router.get('/auth', (req, res) => {

    try {

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://mail.google.com/', 'openid', 'email'],
        });
        res.redirect(authUrl);

    } catch (err) {
        res.status(500).send("Google Authentication initialization error");
    }
});


router.get('/auth/callback', async (req, res) => {

    try {
        const response = await oAuth2Client.getToken(req.query.code);
        /*console.log("Token response:", response);*/
        const tokens = response.tokens;

        /*console.log("tokens: ",tokens);*/

        oAuth2Client.setCredentials(tokens);

        if (!tokens.id_token || (tokens.id_token.split('.').length !== 3)) {
            throw new Error('Invalid or missing id_token');
        }

       
        const decodedToken = jwt.decode(tokens.id_token);
        const userEmail = decodedToken.email;

        let rows = await execQuery(`SELECT email FROM user_gmail_data WHERE email = '${userEmail}' ;`);

        if (rows.length == 0) {
            await execQuery(`INSERT INTO user_gmail_data (email, access_token, refresh_token, token_expiry) VALUES ('${userEmail}', '${tokens.access_token}', '${tokens.refresh_token}', '${tokens.expiry_date}')`);
            
        } else {  
            await execQuery(`UPDATE user_gmail_data SET access_token = '${tokens.access_token}', token_expiry = '${tokens.expiry_date}' WHERE email = '${userEmail}'`);
            
        }
       /* res.redirect('http://localhost:8081/email/sendemail');*/
        res.send("Authenticated successfully!");

    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).send("Authentication error.");
    }
});


router.get('/sendEmail', async (req, res, next) => {

    try {

        const email = req.body.userEmail;  // TODO: Set this to the appropriate user email 

        const rows = await execQuery(`SELECT * FROM user_gmail_data WHERE email = '${email}'`);

        if (rows.length === 0) return res.status(404).send("User not found.");
        const user = rows[0];


        let access_token = user.access_token;
        let refresh_token = user.refresh_token;
        let token_expiry = user.token_expiry;


        if (Date.now() > token_expiry) {
            const { credentials } = await oAuth2Client.refreshAccessToken();

            access_token = credentials.access_token;
            refresh_token = credentials.refresh_token;
            token_expiry = credentials.expiry_date;

            console.log("UPDATED credential :", credentials);

            await execQuery(`UPDATE user_gmail_data SET access_token = '${access_token}', token_expiry = '${token_expiry}' WHERE email = '${email}'`);

        }

        access_token = await new Promise((resolve, reject) => {
            oAuth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject("Failed to create access token :(");
                }
                resolve(token);
            });
        });

        oAuth2Client.setCredentials({
            refresh_token: refresh_token
        });

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: email,
                accessToken: access_token,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: refresh_token
            }
        });


        let ProcessedAttachments = req.body.attachments ? req.body.attachments.map(attachmentPath => {
            return {
                filename: path.basename(attachmentPath),
                path: attachmentPath,
                cid: path.basename(attachmentPath) // Extract filename for CID
            };
        }) : [];

        let message = {
            from: email,
            to: req.body.receiver, 
            cc: req.body.cc,
            bcc: req.body.bcc,
            subject: req.body.subject,
            html: req.body.body,
            attachments: ProcessedAttachments
        };

        transporter.sendMail(message, (error, info) => {
            if (error) {
                return res.status(500).send(error.message);
            }
            res.send('Email sent: ' + info.response);
        });


    } catch (err) {
        next(err);
    }
});



module.exports = router;
