// const TaskTypeEnumType = require('./TaskTypeEnum.type');
const AttachmentInputType = require("./Attachment.input.type");
const AttachmentType = require("./Attachment.type");
const StudentCurrentTaskType = require('./StudentCurrrentTask.type');

const teacherTask = require('./teacherTask');
const studentTask = require('./studentTask');
const studentAnswers = require('./studentsAnswers');
const createTask = require('./createTask');
const correctAnswers = require('./correctAnswers');


module.exports = {
    ...teacherTask,
    ...studentTask,
    ...createTask,
    ...studentAnswers,
    ...correctAnswers,

    // TaskTypeEnumType,
    AttachmentInputType,
    AttachmentType,
    StudentCurrentTaskType,
};
