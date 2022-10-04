const EmailSubjects = {
    CONFIRMATION: "Реєстрація",
    createInviteStudentSubject: (schoolName) => `
        You've been invited to ${schoolName}!
    `,
    RESET_PASSWORD: "Reset password to your Stosyk account"

}

module.exports = EmailSubjects