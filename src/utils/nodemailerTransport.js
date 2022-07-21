const nodemailer = require("nodemailer");


const emailTransport = nodemailer.createTransport({
    host: 'stosyk.app',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '', // your domain email address
        pass: '' // your password
    }
});

module.exports = emailTransport