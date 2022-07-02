const Lesson = require('./lesson.table');
const TaskList = require('./taskList.table');
const Task = require('./task.table');
const Sentence = require('./sentence.table');
const Gap = require('./gap.table');
const Option = require('./option.table');
const Course = require('./course.table')


module.exports = (DataTypes) => ({
    LessonTable: Lesson(DataTypes),
    TaskListTable: TaskList(DataTypes),
    TaskTable: Task(DataTypes),
    SentenceTable: Sentence(DataTypes),
    GapTable: Gap(DataTypes),
    OptionTable: Option(DataTypes),
    CourseTable: Course((DataTypes))
});
