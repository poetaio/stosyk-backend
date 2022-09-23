const EmailSubjects = {
    CONFIRMATION: "Please confirm your Stosyk account",
    createInviteStudentSubject: (schoolName) => `
        You've been invited to ${schoolName}!
    `,
}

module.exports = EmailSubjects
