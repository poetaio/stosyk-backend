const {
    schoolInvitationMailTemplate,
    resetPasswordMailTemplate,
    emailConfirmationMailTemplate,
} = require("../../utils/mailTemplates");

class EmailFactoryService {
    async createConfirmationEmail(email, verificationCode){
        if(process.env.ENVIRONMENT === "DEV"){
            email = process.env.EMAIL_DEV
        }
        const mailOptions = {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to: email,
            ...emailConfirmationMailTemplate(verificationCode)
        }
        return mailOptions
    }

    async createResetPassEmail(email, resetPassCode){
        if(process.env.ENVIRONMENT === "DEV"){
            email = process.env.EMAIL_DEV
        }
        const mailOptions = {
            from: {
                name: "Stosyk",
                address: process.env.EMAIL_USER
            },
            to: email,
            ...resetPasswordMailTemplate(resetPassCode)
        }
        return mailOptions
    }

    createInvitationEmail(studentEmail, schoolOrTeacherName, invitationId) {
        if (process.env.ENVIRONMENT === "DEV"){
            studentEmail = process.env.EMAIL_DEV
        }
        return this.createEmail(
            studentEmail,
            schoolInvitationMailTemplate(schoolOrTeacherName, invitationId)
        );
    }

    createEmail(to, {subject, html}) {
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