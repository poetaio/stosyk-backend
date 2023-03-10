const Account = require('./account.model');
const User = require('./user.model');
const Teacher = require('./teacher.model');
const Student = require('./student.model');


module.exports = (sequelize, DataTypes) => ({
    Account: Account(sequelize, DataTypes),
    User: User(sequelize, DataTypes),
    Teacher: Teacher(sequelize, DataTypes),
    Student: Student(sequelize, DataTypes),
});
