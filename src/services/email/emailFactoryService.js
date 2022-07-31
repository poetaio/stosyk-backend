const emailConstants = require('../../utils/constants')
class EmailFactoryService {
    async createConfirmationEmail(email, verificationCode){
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject:emailConstants.emailSubjects.CONFIRMATION ,
            html:  emailConstants.emailHTMLs.createConfirmationHTML(verificationCode)
        }
        return mailOptions
    }
}

module.exports = new EmailFactoryService();