const confirmationHTML = require('./confirmationEmailHTML')
const resetPasswordHTML = require('./resetPasswordHTML')
class EmailHTMLs {

    createConfirmationHTML = (verificationCode)  =>{
        return confirmationHTML(verificationCode)
    }

    createInviteStudentHTML = (schoolName, inviteToken) => `
            <div>
                Hey! You've been invited to ${schoolName}
                To accept invitation please follow the link:
            </div>
            <a href=https://www.stosyk.app/accept-invite/${inviteToken}> Click here</a>
    `

    createResetPassHTML(resetPassCode) {
        return resetPasswordHTML(resetPassCode)
    }
}

module.exports = new EmailHTMLs()