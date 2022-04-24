const util = require("util");
const {LessonService} = require('../services')

const lessonToReturn = {
    lessonId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
    name: "Lesson",
    tasks: [
        {
            taskId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
            answerShown: false,
            sentences: [
                {
                    sentenceId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                    text: "Slava Ukraini!!!",
                    index: 1,
                    gaps: [
                        {
                            gapId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
                            position: 1,
                            options: [
                                {
                                    optionId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
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

    async getTeacherLesson(parent, args, context) {
        return lessonToReturn;
    }

    async getStudentLesson(parent, args, context) {
        return lessonToReturn;
    }

    async getTeacherLessonTasks({ id }) {
        return lessonToReturn.tasks;
    }

    async startLesson({lessonId}) {
        await LessonService.startLesson(lessonId)
        return true;
    }

    async showAnswers({taskId}) {
        return await LessonService.showAnswers(taskId)
    }

    async finishLesson({lessonId}) {
        return await LessonService.finishLesson(lessonId)
    }

    async getLessons() {
        return [];
    }

    async deleteLesson({ lessonId }) {
        await LessonService.deleteLesson(lessonId);
        return true;
    }

    async joinLesson({ lessonId }) {
        return true;
    }

    async setAnswer() {
        return true;
    }

    async presentStudentsChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`PresentStudentsChanged${lessonId}`]);
        // return [{
        //     id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //     name: 'Jordgje'
        // }];
    }

    async studentAnswerChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`StudentAnswerChanged${lessonId}`]);
        // return [{
        //     taskId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //     sentences: [{
        //         sentenceId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //         gaps: [{
        //             gapId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //             studentAnswers: [{
        //                 studentId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //                 optionId: '59d9c6c4-aa93-40e7-ba30-7de589766e82'
        //             }]
        //         }]
        //     }]
        // }];
    }

    async lessonStatusChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`LessonStatusChanged${lessonId}`]);
    }

    async correctAnswerShown({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`CorrectAnswersShown${lessonId}`]);
    }
}


module.exports = new LessonController();
