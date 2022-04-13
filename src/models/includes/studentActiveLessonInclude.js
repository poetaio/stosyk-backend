module.exports = [
    {
        association: 'tasks',
        include: {
            association: 'gaps',
            // adding rightOption, checking if answerShown on return
            include: [ 'options', 'rightOption' ]
        }
    },
    'teacher'
];
