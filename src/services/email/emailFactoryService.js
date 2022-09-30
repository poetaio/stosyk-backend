const emailConstants = require('../../utils/constants')
class EmailFactoryService {
    async createConfirmationEmail(email, verificationCode){
        const mailOptions = {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to: email,
            subject:emailConstants.emailSubjects.CONFIRMATION ,
            html:  emailConstants.emailHTMLs.createConfirmationHTML(verificationCode)
        }
        return mailOptions
    }

    createInvitationEmail(schoolName, studentEmail, invitationToken) {
        return this.createEmail(
            studentEmail,
            emailConstants.emailSubjects.createInviteStudentSubject(schoolName),
            emailConstants.emailHTMLs.createInviteStudentHTML(schoolName, invitationToken)
        );
    }

    createEmail(to, subject, html) {
        return {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to,
            subject,
            html,
        }
    }
}

module.exports = new EmailFactoryService();