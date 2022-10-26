const parseHtml = require('../../parseHtml');
const fs = require("fs");
const {
    emailConfirmationImg,
    resetPasswordImg,
    schoolInvitationImg,
} = require('./img');
const path = require("path");

const frontendUrl = process.env.FRONTEND_URL;

const EMAIL_CONFIRMATION_PATH = path.resolve(__dirname, '..', '..', '..', 'assets', 'html', 'emailConfirmation.html');
const SCHOOL_INVITATION_PATH = path.resolve(__dirname, '..', '..', '..', 'assets', 'html', 'schoolInvitation.html');
const RESET_PASSWORD_PATH = path.resolve(__dirname, '..', '..', '..', 'assets', 'html', 'resetPassword.html');

const EMAIL_CONFIRMATION_HTML = fs.readFileSync(EMAIL_CONFIRMATION_PATH).toString();
const SCHOOL_INVITATION_HTML = fs.readFileSync(SCHOOL_INVITATION_PATH).toString();
const RESET_PASSWORD_HTML = fs.readFileSync(RESET_PASSWORD_PATH).toString();


module.exports = {
    emailConfirmationHtml: (verificationCode) => parseHtml(EMAIL_CONFIRMATION_HTML, {verificationCode, frontendUrl, ...emailConfirmationImg}),
    resetPasswordHtml: (resetPassCode) => parseHtml(RESET_PASSWORD_HTML, {resetPassCode, frontendUrl, ...resetPasswordImg}),
    schoolInvitationHtml: (schoolOrTeacherName, invitationId) => parseHtml(SCHOOL_INVITATION_HTML, {schoolOrTeacherName, frontendUrl, invitationId, ...schoolInvitationImg}),
};
