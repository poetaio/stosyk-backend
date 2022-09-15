class EmailHTMLs {
    createConfirmationHTML(verificationCode){
        return `<h1>Email Confirmation</h1>
        <p>Here is your confirmation code:</p>
        <a href=https://www.stosyk.app/confirm/${verificationCode}> Click here</a>
        </div>`
    }
}

module.exports = new EmailHTMLs()