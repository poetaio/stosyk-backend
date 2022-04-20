// tasks-gaps-options list + studentAnswers on each gap

module.exports = [
    // {
    //     association: 'lessonMarkup',
    //     include: {
    //         association: "tasks",
    //         include: "gaps"
    //     }
    // },
    {
        association: 'tasks',
        include: {
            association: 'gaps',
            include: [
                'rightOption',
                'options',
                {
                    association: 'studentsAnswers',
                    // raw: true,
                    // // including only user from student_answer_sheet
                    // attributes: {
                    //     include: [sequelize.col('answerSheet.studentId'), 'student']
                    // },
                    include: [
                        {
                            association: 'answerSheet',
                            // attributes: [],
                            include: 'student'
                        },
                        'chosenOption'
                    ]
                }
            ]
        }
    },
    'teacher',
    'students'
];
