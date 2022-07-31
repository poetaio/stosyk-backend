class EmailHTMLs {
    createConfirmationHTML(verificationCode){
        return `<h1>Email Confirmation</h1>
        <p>To confirm email click the following link:</p>
        <a href=https://www.stosyk.app/confirm/${verificationCode}> Click here</a>
        </div>`
    }
    createResetPassHTML(resetPassCode){
        return `<h1>Reset password</h1>
        <p>To reset password click the following link:</p>
        <a href=https://www.stosyk.app/resetpass/${resetPassCode}> Click here</a>
        </div>`
    }
}

module.exports = new EmailHTMLs()