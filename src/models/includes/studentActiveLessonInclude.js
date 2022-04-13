module.exports = [
    {
        association: 'tasks',
        include: {
            association: 'gaps',
            include: 'options'
        }
    },
    'teacher'
];
