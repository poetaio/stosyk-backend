const teacherController = require('../../controllers/teacherController');
const { TeacherType } = require('../types');


const registerTeacher = {
    type: TeacherType,
    name: "registerTeacher",
    description: "Register teacher",
    resolve: (parent, args, context) => teacherController.create(args)
}

module.exports = {
    registerTeacher
}
