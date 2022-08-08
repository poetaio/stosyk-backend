const TeacherTaskType = require("./TeacherHWTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherHWTaskInterfaceFields");
const {GraphQLObjectType} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "MediaTeacherHWTaskType",
    description: "MediaTeacherTaskType.",
    fields: () => ({
        ...teacherTaskInterfaceFields,
    }),
    interfaces: ([TeacherTaskType]),
});
