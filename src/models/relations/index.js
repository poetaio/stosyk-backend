const LessonStudent = require('./lessonStudent.model');
const LessonTeacher = require('./lessonTeacher.model');
const TaskListTask = require('./taskListTask.model');
const TaskSentence = require('./taskSentence.model');
const SentenceGap = require('./sentenceGap.model');
const GapOption = require('./gapOption.model');
const StudentOption = require('./studentOption.model');


module.exports = (sequelize, DataTypes) => ({
    LessonStudent: LessonStudent(sequelize, DataTypes),
    LessonTeacher: LessonTeacher(sequelize, DataTypes),
    TaskListTask: TaskListTask(sequelize, DataTypes),
    TaskSentence: TaskSentence(sequelize, DataTypes),
    SentenceGap: SentenceGap(sequelize, DataTypes),
    GapOption: GapOption(sequelize, DataTypes),
    StudentOption: StudentOption(sequelize, DataTypes),
});
