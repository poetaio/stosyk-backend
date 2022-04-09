const { GraphQLNonNull, GraphQLID } = require("graphql");

const { TeacherChangedLessonType } = require("./activeLessonTypes");
const activeLessonController = require('../../controllers/activeLessonController');

/*
Events:
    Answer entered, answer changed,
    Answer shown
    Lesson started/ended
 */

// student subscribes to listen for teacher's changes
const teacherChangedLesson = {
    type: TeacherChangedLessonType,
    description: 'Triggers when teacher changes the active lesson',
    args: {
        studentId: { type: GraphQLNonNull(GraphQLID)}
    },
    subscribe: async (parent, args, context) => await activeLessonController.subscribeToTeacherChangedActiveLesson(args, context)
}

// teacher subscribes to listen for student's changes
const studentChangedLesson = {
    type: GraphQLID,
    description: 'Triggers when student changes the active lesson',
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await activeLessonController.subscribeToStudentChangedActiveLesson(args, context)
}

// start/end subscription
const rightAnswerShownSubscription = {

};

// student enters the classroom
const studentJoinedSubscription = {

}

// student leaves the classroom
const studentLeftSubscription = {

}

// student enters/changes answer
const answerChangedSubscription = {

};

// teacher shows right answer
const activeLessonStatusChangedSubscription = {

};

module.exports = {
    studentChangedLesson,
    teacherChangedLesson,
    // studentJoinedSubscription,
    // studentLeftSubscription,
    // rightAnswerShownSubscription,
    // activeLessonStatusChangedSubscription,
    // answerChangedSubscription
};
