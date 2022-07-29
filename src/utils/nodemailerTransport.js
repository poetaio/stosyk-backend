const nodemailer = require("nodemailer");


const emailTransport = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    auth: {
        user: 'info@stosyk.app', // your domain email address
        pass: process.env.EMAIL_PASS
    }
});

module.exports = emailTransport