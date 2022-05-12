const {GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const { TaskCorrectAnswerInterfaceType } = require('../task');


module.exports = new GraphQLObjectType({
    name: 'LessonCorrectAnswersType',
    description: 'Lesson Correct Answers Type',
    fields: {
        tasksAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskCorrectAnswerInterfaceType))) }
    }
});
