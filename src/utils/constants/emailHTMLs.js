class EmailHTMLs {
    createConfirmationHTML(verificationCode){
        return `<h1>Email Confirmation</h1>
                <p>Here is your confirmation code:</p>
                <a href=https://www.stosyk.app/confirm/${verificationCode}> Click here</a>
                </div>`
    }

    createInviteStudentHTML = (schoolName, inviteToken) => `
            <div>
                Hey! You've been invited to ${schoolName}
                To accept invitation please follow the link:
            </div>
            <a href=https://www.stosyk.app/accept-invite/${inviteToken}> Click here</a>
    `
}

module.exports = new EmailHTMLs();
