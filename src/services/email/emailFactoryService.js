const emailConstants = require('../../utils/constants')
class EmailFactoryService {
    async createConfirmationEmail(email, verificationCode){
        if(process.env.ENVIRONMENT === "DEV"){
            email = process.env.EMAIL_USER
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
            email = process.env.EMAIL_USER
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

    createInvitationEmail(schoolName, studentEmail, inviteId) {
        if(process.env.ENVIRONMENT === "DEV"){
            studentEmail = process.env.EMAIL_USER
        }
        return this.createEmail(
            studentEmail,
            emailConstants.emailSubjects.createInviteStudentSubject(schoolName),
            emailConstants.emailHTMLs.createInviteStudentHTML(schoolName, inviteId)
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