const emailConstants = require('../../utils/constants')
class EmailFactoryService {
    async createConfirmationEmail(email, verificationCode){
        if(process.env.ENVIRONMENT === "DEV"){
            email = "info@stosyk.app"
        }
        const mailOptions = {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: emailConstants.emailSubjects.CONFIRMATION ,
            html: emailConstants.emailHTMLs.createConfirmationHTML(verificationCode)
        }
        return mailOptions
    }

    async createResetPassEmail(email, resetPassCode){
        if(process.env.ENVIRONMENT === "DEV"){
            email = "info@stosyk.app"
        }
        const mailOptions = {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: emailConstants.emailSubjects.RESET_PASSWORD ,
            html: emailConstants.emailHTMLs.createResetPassHTML(resetPassCode)
        }
        return mailOptions
    }

    createInvitationEmail(schoolName, studentEmail, invitationToken) {
        if(process.env.ENVIRONMENT === "DEV"){
            studentEmail = "info@stosyk.app"
        }
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