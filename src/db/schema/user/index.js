const Account = require('./account.table');
const User = require('./user.table');
const Teacher = require('./teacher.table');
const Student = require('./student.table');


module.exports = (DataTypes) => ({
    AccountTable: Account(DataTypes),
    UserTable: User(DataTypes),
    TeacherTable: Teacher(DataTypes),
    StudentTable: Student(DataTypes),
});
