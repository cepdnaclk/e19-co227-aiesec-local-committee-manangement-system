const express = require('express');
const router = express.Router();
const path = require('path'); // Added for extracting filename from path

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();


const { connection, execQuery } = require("../database/database");


const send_email = (reciver, cc, bcc, subject, body, attachments)=>{

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let ProcessedAttachments = attachments ? attachments.map(attachmentPath => {
        return {
            filename: path.basename(attachmentPath), // Extract filename from path
            path: attachmentPath,
            cid: path.basename(attachmentPath) // Extract filename for CID
        };
    }) : [];

/*    console.log(ProcessedAttachments)*/

    let message = {
        from: 'manodyasenevirathne0@gmail.com',
        to: reciver, // Assuming this can be a comma-separated list of receivers
        cc: cc,    // CC receivers
        bcc: bcc,  // BCC receivers
        subject: subject || 'no reply - system email from AIESEC lcms!', // If subject not provided, fallback to default
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


let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'AIESEC local committee management system',
        link: 'https://test.test/'
    }
});


const sendReminders = (receiver) => {
    let sql = "SELECT * FROM email_templates WHERE name = 'reminder'";
    let cc = null;
    let bcc = null;

    // Return the Promise from execQuery so it can be used in the Promise chain
    return execQuery(sql)
        .then((rows) => {
            let emailData = rows[0];

            return send_email(receiver, cc, bcc, emailData.subject, emailData.body, JSON.parse(emailData.attachments));
        });

};






// routes

// create email template
router.post('/template/create', (req, res) => {

    let sql = `INSERT INTO email_templates (name, subject, body) VALUES ('${req.body.name}', '${req.body.subject}', '${req.body.body}')`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "successfully created" })
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });

});

// delete email template
router.delete('/template/:name', (req, res) => {

    let sql = `DELETE FROM email_templates WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "successfully deleted" })
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });

});

// get email template
router.get('/template/:name', (req, res) => {

    let sql = `SELECT * FROM email_templates WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json(rows[0])
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });

});

// update email template
router.put('/template/:name', (req, res) => {

    let sql = `UPDATE email_templates SET subject = '${req.body.subject}', body = '${req.body.body}' WHERE name = '${req.params.name}'`;

    execQuery(sql)
        .then((rows) => {
            res.status(200).json({ msg: "template updated" })
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });

});


/*---------------------------------------------------------*/

// send a reminder (for testing)
router.post('/sendReminders', (req, res) => {

    sendReminders("astromp01@gmail.com")
        .then(() => {
            res.status(200).json({ msg: 'Reminder sent' })
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        })

});


router.post('/send6weekChallengeMail', (req, res) => {


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
            res.status(500).json({ msg: err });
        });


});

router.post('/sendApprovedMail', (req, res) => {

});

router.post('/sendESEMail', (req, res) => {

});


module.exports = router;
