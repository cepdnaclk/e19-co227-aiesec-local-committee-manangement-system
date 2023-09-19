const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');

const REDIRECT_URL = process.env.GMAIL_AUTH_REDIRECT_URL;   //this is the url given in gmail api to redirect ; if you need to change this, change api google credentials also
const oAuth2Client = new OAuth2Client(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, REDIRECT_URL);

const { connection, execQuery } = require("../database/database");

function replacePlaceholders(template, data) {

    // replace {{those}} with given data   
    // ex: template = Hello {{ name }} ! --> data = { name: John } --> return = Hello John!

    return template.replace(/\{\{(\w+)\}\}/g, function (match, placeholder) {
        return data[placeholder] || '';
    });
}

function sendSystemEmail(reciver, cc, bcc, subject, body, attachments) {

    // send a email through aiesec.lcms@gmail.com
    // MUST REQUIRED a reciver
    // all arguments should be strings
    // for multiple recivers, cc, bcc ,attachments use string arrays
    // but only one subject and one body

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
            cid: path.basename(attachmentPath)
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

async function sendUserEmail(email, attachments, receiver, cc, bcc, subject, body) {
    // one email, subject, body
    // can be multiple attachments, receiver, cc, bcc
    // body can be HTML

    // fetch user gmail data
    const rows = await execQuery(`SELECT * FROM user_gmail_data WHERE email = '${email}'`);
    if (rows.length === 0) throw new Error("User Email is not Authenticated.");
    const user = rows[0];

    let { accessToken, refreshToken, tokenExpiry } = user;

    // renew access token if its expired
    if (Date.now() > tokenExpiry) {
        const { credentials } = await oAuth2Client.refreshAccessToken();
        accessToken = credentials.access_token;
        refreshToken = credentials.refresh_token;
        tokenExpiry = credentials.expiry_date;

        console.log("UPDATED credential :", credentials);

        await execQuery(`UPDATE user_gmail_data SET accessToken = '${accessToken}', tokenExpiry = '${tokenExpiry}' WHERE email = '${email}'`);
    }

    accessToken = await new Promise((resolve, reject) => {
        oAuth2Client.getAccessToken((err, token) => {
            if (err) reject("Failed to create access token :(");
            resolve(token);
        });
    });

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: email,
            accessToken: accessToken,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: refreshToken
        }
    });

    const ProcessedAttachments = attachments ? attachments.map(attachmentPath => ({
        filename: path.basename(attachmentPath),
        path: attachmentPath,
        cid: path.basename(attachmentPath)
    })) : [];

    const message = {
        from: email,
        to: receiver,
        cc: cc,
        bcc: bcc,
        subject: subject,
        html: body,
        attachments: ProcessedAttachments
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) => {
            if (error) reject(error);
            resolve(info.response);
        });
    });
}


module.exports = { sendSystemEmail, sendUserEmail, replacePlaceholders, oAuth2Client };