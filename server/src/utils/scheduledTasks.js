const Mailgen = require('mailgen');
const cron = require('node-cron');


const { connection, execQuery, execQueryWithValues } = require("../database/database");
const { sendSystemEmail, sendUserEmail, replacePlaceholders } = require("../utils/email_functions");


// UTILITY FUNCIONS

// ogv pre-signup reminders
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
            console.log("Sending OGV Pre-Signup Reminder to: ", row.memberEmail);

            let applicant_details = `<ul><li>id : ${row.id}</li><li>First Name : ${row.firstName}</li><li>Last Name : ${row.lastName}</li><li>Phone No : ${row.phone}</li><li>Campaign ID : ${row.campaignId}</li>`;
            /*console.log("Reminder: ", row.member_email, row.member_name, applicant_details);*/
            sendPreSignUpReminder(row.memberEmail, row.memberName, applicant_details);

        });
    });
};







// TASKS

// WARNING:be sure to not send large amount of emails in short peried
// sending reminders every 20 sec:: TODO: add suitable time period
const sendingOGVpreSignupReminders = cron.schedule('20 * * * * *', sendPreSignUpReminders, { scheduled: false });




module.exports = {
    start: function () {

        console.log("scheduled tasks started!");
        // add tasks here
        sendingOGVpreSignupReminders.start();
    }
};