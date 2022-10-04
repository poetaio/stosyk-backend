const EmailSubjects = {
    CONFIRMATION: "Реєстрація",
    createInviteStudentSubject: (schoolName) => `
        You've been invited to ${schoolName}!
    `,
    RESET_PASSWORD: "Скидання паролю"

}

module.exports = EmailSubjects