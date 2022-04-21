const util = require("util");

const lessonToReturn = {
    id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
    name: "Lesson",
    tasks: [
        {
            id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
            answerShown: false,
            sentences: [
                {
                    id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                    text: "Slava Ukraini!!!",
                    index: 1,
                    gaps: [
                        {
                            id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                            position: 1,
                            options: [
                                {
                                    id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                                    value: 'Slava!!!',
                                    isCorrect: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

class LessonController {
    async createLesson({ lesson }, context) {
        // console.log(util.inspect(lesson, {showHidden: false, depth: null, colors: true}))
        return "59d9c6c4-aa93-40e7-ba30-7de589766e82";
    }

    async getLesson({ id }) {
        console.log(id);
        return lessonToReturn;
    }

    async getLessonTasks({ id }) {
        return lessonToReturn.tasks;
    }

    async presentStudents({ id }) {
        return [{
            id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
            name: 'Jordgje'
        }];
    }

    async studentAnswerChanged() {
        return [{
            taskId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
            sentences: [{
                sentenceId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                gaps: [{
                    gapId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                    studentAnswers: [{
                        studentId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                        optionId: '59d9c6c4-aa93-40e7-ba30-7de589766e82'
                    }]
                }]
            }]
        }];
    }

    async startLesson() {
        return true;
    }

    async showAnswers() {
        return true;
    }

    async finishLesson() {
        return false;
    }
}


module.exports = new LessonController();
