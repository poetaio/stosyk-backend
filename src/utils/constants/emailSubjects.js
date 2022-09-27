const EmailSubjects = {
    CONFIRMATION: "Реєстрація",
    createInviteStudentSubject: (schoolName) => `
        You've been invited to ${schoolName}!
    `,
}

module.exports = EmailSubjects
