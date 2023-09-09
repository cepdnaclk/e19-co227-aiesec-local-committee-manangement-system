const express = require('express');
const router = express.Router();
const path = require('path'); // Added for extracting filename from path

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();


const { connection, execQuery } = require("../database/database");


const send_email = (reciver, cc, bcc, subject, body, attachements)=>{

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_APP_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let message = {
        from: 'manodyasenevirathne0@gmail.com',
        to: reciver, // Assuming this can be a comma-separated list of receivers
        cc: cc,    // CC receivers
        bcc: bcc,  // BCC receivers
        subject: subject || 'no reply - system email from AIESEC lcms!', // If subject not provided, fallback to default
        html: body,
        attachments: attachements
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


const sendReminders = () => {

    let sql = "SELECT * FROM email_templates WHERE name = 'reminder'";
    let receiver = "astromp01@gmail.com";
    let cc = null;
    let bcc = null;
    let attachments = null;


    execQuery(sql)
        .then((rows) => {

            let emailData = rows[0]
            send_email(receiver, cc, bcc, emailData.subject, emailData.body, attachments)

        })
        .catch((err) => {
            console.error("Reminder Email sending error : "+ err)
        });

}





// routes

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


// send a reminder (for testing)
router.post('/sendReminders', (req, res) => {

    sendReminders()
    res.status(200).json({ msg: 'Reminder sent' })

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
    let processedAttachments = req.body.attachments ? req.body.attachments.map(attachmentPath => {
        return {
            filename: path.basename(attachmentPath), // Extract filename from path
            path: attachmentPath,
            cid: path.basename(attachmentPath) // Extract filename for CID
        };
    }) : [];



    send_email(req.body.email, req.body.cc, req.body.bcc, req.body.subject, generatedemailbody, processedattachments)
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
