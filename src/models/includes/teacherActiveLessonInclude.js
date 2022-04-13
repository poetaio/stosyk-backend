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
                    include: [{
                            association: 'answerSheet',
                            // attributes: ['studentId'],
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
