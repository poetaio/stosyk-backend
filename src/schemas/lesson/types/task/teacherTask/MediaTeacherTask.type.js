const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");
const {GraphQLObjectType} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "MediaTeacherTaskType",
    description: "MediaTeacherTaskType.",
    fields: () => ({
        ...teacherTaskInterfaceFields,
    }),
    interfaces: ([TeacherTaskType]),
});
