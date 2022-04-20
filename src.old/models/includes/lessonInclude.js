// includes for lesson
// author and tasks+gaps+options+rightOption

module.exports = [
    'author',
    {
        association: 'tasks',
        include: {
            association: "gaps",
            include: [
                "options",
                "rightOption"
            ]
        }
    }
];
