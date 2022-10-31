const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLFloat, GraphQLList, GraphQLString
} = require("graphql");
const {lessonController, homeworkController} = require("../../../../controllers");
const StudentHomeworkResultType = require("./StudentHomeworkResult.type");

module.exports = new GraphQLObjectType({
    name: "StudentLessonResultType",
    description: "Student with results",
    fields: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: GraphQLFloat,
            resolve: async (parent, args, context) =>
                await lessonController.getStudentProgress(parent),
        },
        score: {
            // value in percents
            type: GraphQLFloat,
            resolve: async (parent, args, context) =>
                await lessonController.getTotalScore(parent),
        },
        homeworkResults: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentHomeworkResultType))),
            resolve: async (parent, args, context) => {
                const homeworkModels = await homeworkController.getAllByLessonId(parent);
                return homeworkModels.map(homeworkModel => {
                    const homework = homeworkModel.get({plain: true});
                    homework.studentId = parent.studentId;
                    return homework;
                })
            },
        }
    },
});
