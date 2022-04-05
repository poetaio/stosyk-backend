const sequelize = require('../services/dbService');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

const Lesson = sequelize.define('lesson', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    authorId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

const Task = sequelize.define('task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

const Sentence = sequelize.define('sentence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gapPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const Option = sequelize.define('option', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isRight: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

User.hasMany(Lesson, {as: "lessons"});
Lesson.belongsTo(User, {
    foreignKey: "authorId",
    as: "author"
});

Lesson.hasMany(Task);
Task.belongsTo(Lesson);

Task.hasMany(Sentence);
Sentence.belongsTo(Task);

Sentence.hasMany(Option);
Option.belongsTo(Sentence);

module.exports = {
    User,
    Lesson,
    Task,
    Sentence,
    Option
}
