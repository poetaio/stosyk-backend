const nodemailer = require("nodemailer");

const emailTransport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "eloy.barton38@ethereal.email", // generated ethereal user
        pass: "CkDT7FY3YtnDkeEV3H", // generated ethereal password
    },
});

module.exports = emailTransport