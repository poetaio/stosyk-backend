const {allTasksWithShownAnswersByLessonIdInclude, Task} = require("../../db/entities");

class LessonAnswersService {
    // todo: remove method
    //       upd: remember why...
    // returns only lesson tasks!
    async getShownAnswers(lessonId) {
        return await Task.findAll({
            include: allTasksWithShownAnswersByLessonIdInclude(lessonId)
        });
    }
}

module.exports = new LessonAnswersService();
