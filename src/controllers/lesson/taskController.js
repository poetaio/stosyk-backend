const {taskService} = require("../../services");
const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");

class TaskController {
    async getTasks(parent, args, context) {
        return await taskService.getAll(parent);
    }

    async getTaskLists(parent, args, context) {
        return await taskService.getTaskLists(parent)
    }

    async showAnswers({ taskId }, { pubsub, user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await taskService.showAnswers(pubsub, taskId, teacher.teacherId)
    }
}

module.exports = new TaskController();
