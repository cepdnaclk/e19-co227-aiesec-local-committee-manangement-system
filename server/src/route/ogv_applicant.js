const express = require("express");
const router = express.Router();
const Mailgen = require('mailgen');
const cron = require('node-cron');

const {
    requestBodyToFieldsAndValues,
    objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery, execQueryWithValues } = require("../database/database");
const { sendSystemEmail, sendUserEmail, replacePlaceholders } = require("../utils/email_functions");

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

function fetchPreSignupMembers(callback) {
    const query = 'SELECT * FROM OGVDetailsForSendReminders';

    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}

const sendPreSignUpReminder = (member_email, member_name, applicant_details) => {

    let reminder_mail = "SELECT * FROM email_template WHERE name = 'reminder'";
    let cc = null;
    let bcc = null;

    return execQuery(reminder_mail)
        .then((rows) => {
            let emailData = rows[0];

            // UPDATE THIS for placeholders
            template_data = {
                member_name: member_name,
                applicant_details: applicant_details
            };
            let emailBody = replacePlaceholders(emailData.body, template_data);

            return sendSystemEmail(member_email, cc, bcc, emailData.subject, emailBody, JSON.parse(emailData.attachments));
        });

};

function sendPreSignUpReminders() {

    fetchPreSignupMembers(rows => {
        rows.forEach(row => {
            console.log("Sending OGV Pre-Signup Reminder to: ",row.memberEmail);

            let applicant_details = `<ul><li>id : ${row.id}</li><li>First Name : ${row.firstName}</li><li>Last Name : ${row.lastName}</li><li>Phone No : ${row.phone}</li><li>Campaign ID : ${row.campaignId}</li>`;
            /*console.log("Reminder: ", row.member_email, row.member_name, applicant_details);*/
            sendPreSignUpReminder(row.memberEmail, row.memberName, applicant_details);

        });
    });
};






// WARNING:be sure to not send large amount of emails in short peried
// sending reminders every 20 sec:: TODO: add suitable time period

/*cron.schedule('20 * * * * *', sendPreSignUpReminders);*/

///////////////routes

// get member details for 'select member' dropdown menu 
router.get(`/members`, (req, res, next) => {

    execQuery(`SELECT id, preferred_name FROM member`)
        .then((rows) => {
            res.status(200).json(rows);
        })
        .catch((err) => {
            next(err);
        });

});

// get details(selected) of all
router.get(`/`, (req, res, next) => {

    execQuery("SELECT * FROM OGVApplicantDetailsInBrief")
        .then((rows) => {
            res.status(200).json(rows);
        })
        .catch((err) => {
            next(err);
        });

});

// get all details of one applicant
router.get(`/:id`, (req, res, next) => {

    execQuery(`CALL GetOGVApplicantDetailsInDetail(${req.params.id})`)
        .then((rows) => {
            res.status(200).json(rows[0][0]);
        })
        .catch((err) => {
            next(err);
        });

});

// new applicant
router.post("/", (req, res, next) => {
    try {

        const [fields, values] = [Object.keys(req.body), Object.values(req.body).map(value => `'${value}'`)];
        const query = `INSERT INTO ogv_applicants (${fields.toString()}) VALUES (${values.toString()})`;


        execQuery(query)
            .then((rows) => {
                res
                    .status(200)
                    .json({ message: "New OGV application Created!" });
            })

            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});

// update existing one
router.put("/", (req, res, next) => {
    try {

        const [fields, values] = [Object.keys(req.body), Object.values(req.body).map(value => `'${value}'`)];

        // Combine the two arrays into a single array.
        let updateString = "";

        for (let i = 0; i < fields.length; i++) {
            updateString += fields[i] + " = ";
            updateString += values[i] + ", ";
        }

        // remove last trailling ", "
        updateString = updateString.substring(0, updateString.length - 2);

        const query = `UPDATE ogv_applicants  SET ${updateString} WHERE id=${values[0]};`;
        execQuery(query)
            .then((rows) => {
                res
                    .status(200)
                    .json({ message: "OGV application details updated successfully!" });
            })

            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});

//delete application
router.delete("/", (req, res, next) => {
    try {
        const deleteQuery = `DELETE FROM ogv_applicants WHERE id=${req.query.id}`;
        execQuery(deleteQuery)
            .then((rows) => {
                res.status(200).json({ message: "OGV application deleted Sucessfully" });
            })
            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
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
router.post('/send6weekChallengeMail', (req, res, next) => {
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

router.post('/sendApprovedMail', (req, res) => {

});

router.get('/sendESEMail', (req, res) => {

    // TODO ::
    //      fetch email ESE mail template
    //      replace placeholders data
    //      send that mail data to client

});

router.post('/sendESEMail', (req, res) => {

    // TODO ::
    //      call sendUserEmail fn with req data
    //      error handling
    //      update member table
    //      send back response

});



module.exports = router;
