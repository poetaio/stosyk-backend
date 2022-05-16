const {optionService} = require("../../services");

class OptionController {
    // parent contains gapId
    async getOptionsForTeacher(parent, args, context) {
        return await optionService.getAllForTeacher(parent)
    }

    // parent contains gapId
    async getOptionsForStudent(parent, args, context) {
        return await optionService.getAllForStudent(parent)
    }

    // used in TeacherQuestionType in resolve for answers
    async getAllForTeacherQuestion({questionId}) {
        return await optionService.getAllFromQuestionForTeacher(questionId);
    }
}

module.exports = new OptionController();
