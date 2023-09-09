const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();


router.post('/email', (req, res) => {
    let config = {
        service: 'gmail', // your email domain
        auth: {
            user: process.env.GMAIL_APP_USER,   // your email address
            pass: process.env.GMAIL_APP_PASSWORD // your password
        }
    }
    let transporter = nodemailer.createTransport(config);

    let message = {
        from: 'manodyasenevirathne0@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Hello Gmail!', // Subject line
        html: "<b>Hello world?</b>", // html body
        attachments: [ // use URL as an attachment
            {
                filename: 'test.png',
                path: 'https://www.codelikethewind.org/content/images/2022/05/hello_world.png',
                cid: 'uniqtest.png'
            }
        ]
    };

    transporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    }
    );
})






module.exports = router