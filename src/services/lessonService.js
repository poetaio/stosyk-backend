const {Lesson} = require('../models')
const {Task} = require('../models')
const {LessonTypeEnum} = require('../utils')

class LessonService {
    async startLesson(lessonId){
        // check that user owns lesson which task in
        await Lesson.update({
                status: LessonTypeEnum.ACTIVE
        },{
            where: {
                lessonId
            }
        })
    }

    async finishLesson(lessonId) {
        // check that user owns lesson which task in
        await Lesson.update({
            status: LessonTypeEnum.PENDING
        },{
            where: {
                lessonId
            }
        })
    }

    async deleteLesson(lessonId) {
        // check that user owns lesson which task in
        await Lesson.destroy({
            where: {
                lessonId
            }
        })
    }

    async showAnswers(taskId) {
        // check that user owns lesson which task in
        await Task.update({
            answerShown: true
        },{
            where: {
                taskId
            }
        })

        // todo: if changed publish answers
    }
}

module.exports = new LessonService();
