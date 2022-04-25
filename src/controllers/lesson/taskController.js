const {Task} = require("../../models");
const {taskService} = require("../../services");

class TaskController {
    async getTasks(parent, args, context) {
        return await taskService.getAll(parent);
    }
}

module.exports = new TaskController();
