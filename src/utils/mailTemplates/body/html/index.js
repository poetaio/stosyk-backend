const fs = require("fs");

const EMAIL_CONFIRMATION_HTML = fs.readFileSync(`${__dirname}/emailConfirmation.html`).toString();
const SCHOOL_INVITATION_HTML = fs.readFileSync(`${__dirname}/schoolInvitation.html`).toString();
const RESET_PASSWORD_HTML = fs.readFileSync(`${__dirname}/resetPassword.html`).toString();

module.exports = {
    EMAIL_CONFIRMATION_HTML,
    SCHOOL_INVITATION_HTML,
    RESET_PASSWORD_HTML,
};
