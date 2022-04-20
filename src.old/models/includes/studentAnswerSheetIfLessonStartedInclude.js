const ActiveLessonStatusEnum = require('../lesson_active/utils/ActiveLessonStatusEnum');

// excluding right answer from answer sheet, showing only options available
// if lesson is not started, returns null
module.exports = [{
        association: 'answers',
        include: [{
            association: 'answerTo',
            attributes: { exclude: [ 'rightOptionId' ] },
            include: 'options'
        },
            'chosenOption'
        ]
    },
    {
        association: 'activeLesson',
        where: {
            status: ActiveLessonStatusEnum.STARTED
        },
        require: true
    }
];
