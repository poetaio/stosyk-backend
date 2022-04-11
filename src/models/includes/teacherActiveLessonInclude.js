module.exports = [
    {
        association: 'lessonMarkup',
        include: {
            association: "tasks",
            include: "sentences"
        }
    },
    {
        association: 'activeTasks',
        include: {
            association: 'activeSentences',
            include: [ 'rightOption', 'studentsAnswers', 'options']
        }
    },
    'teacher',
    'students'
];