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
            include: [ 'rightOption', 'studentsAnswers', 'options']
        }
    },
    'teacher',
    'students'
];
