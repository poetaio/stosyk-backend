const Lesson = require('./lesson.model');
const TaskList = require('./taskList.model');
const Task = require('./task.model');
const Sentence = require('./sentence.model');
const Gap = require('./gap.model');
const Option = require('./option.model');
const Course = require('./course.model');


module.exports = (sequelize, DataTypes) => ({
    Lesson: Lesson(sequelize, DataTypes),
    TaskList: TaskList(sequelize, DataTypes),
    Task: Task(sequelize, DataTypes),
    Sentence: Sentence(sequelize, DataTypes),
    Gap: Gap(sequelize, DataTypes),
    Option: Option(sequelize, DataTypes),
    Course: Course(sequelize, DataTypes),
});
