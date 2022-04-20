module.exports = {
    association: 'answers',
    include: [{
            association: 'answerTo',
            // excluding right answer from answer sheet, showing only options available
            attributes: { exclude: [ 'rightOptionId' ] },
            include: 'options'
        },
        'chosenOption'
    ]
};
