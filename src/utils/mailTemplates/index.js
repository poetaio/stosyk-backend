const {
    emailConfirmationHtml,
    resetPasswordHtml,
    schoolInvitationHtml,
} = require('./body');
const {
    EMAIL_CONFIRMATION_SUBJECT,
    RESET_PASSWORD_SUBJECT,
    SCHOOL_INVITATION_SUBJECT
} = require('./subject');

const makeMail = (subject, html) => ({ subject, html });

module.exports = {
    emailConfirmationMailTemplate: (verificationCode) => makeMail(EMAIL_CONFIRMATION_SUBJECT, emailConfirmationHtml(verificationCode)),
    resetPasswordMailTemplate: (resetPassCode) => makeMail(RESET_PASSWORD_SUBJECT, resetPasswordHtml(resetPassCode)),
    schoolInvitationMailTemplate: (schoolOrTeacherName, invitationId) => makeMail(SCHOOL_INVITATION_SUBJECT, schoolInvitationHtml(schoolOrTeacherName, invitationId)),
};
