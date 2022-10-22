const parseHtml = require('../../parseHtml');
const {
    EMAIL_CONFIRMATION_HTML,
    RESET_PASSWORD_HTML,
    SCHOOL_INVITATION_HTML,
} = require('./html');
const {
    emailConfirmationImg,
    resetPasswordImg,
    schoolInvitationImg,
} = require('./img');
const frontendUrl = process.env.FRONTEND_URL;

module.exports = {
    emailConfirmationHtml: (verificationCode) => parseHtml(EMAIL_CONFIRMATION_HTML, {verificationCode, frontendUrl, ...emailConfirmationImg}),
    resetPasswordHtml: (resetPassCode) => parseHtml(RESET_PASSWORD_HTML, {resetPassCode, frontendUrl, ...resetPasswordImg}),
    schoolInvitationHtml: (schoolOrTeacherName, invitationId) => parseHtml(SCHOOL_INVITATION_HTML, {schoolOrTeacherName, frontendUrl, invitationId, ...schoolInvitationImg}),
};
