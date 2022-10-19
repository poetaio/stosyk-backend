const Account = require('./account.table');
const User = require('./user.table');
const Teacher = require('./teacher.table');
const Student = require('./student.table');
const Subpackage = require('./subpakage.table')


module.exports = (DataTypes) => ({
    AccountTable: Account(DataTypes),
    UserTable: User(DataTypes),
    TeacherTable: Teacher(DataTypes),
    StudentTable: Student(DataTypes),
    SubpackageTable: Subpackage(DataTypes)
});
