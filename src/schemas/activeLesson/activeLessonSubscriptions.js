const { GraphQLNonNull, GraphQLID } = require("graphql");

const { ActiveLessonStatusChangedType, StudentEnteredAnswerType } = require("./types");
const activeLessonController = require('../../controllers/activeLessonController');
/*
Events:
    - [ ] Answer entered, answer changed,
    - [ ] Answer shown
    - [x] Lesson started/ended
 */

const activeLessonStatusChanged = {
    type: ActiveLessonStatusChangedType,
    name: "ActiveLessonStatusChanged",
    description: "Fires when teacher start/finishes lesson, sends status",
    args: {
        // todo: get from token
        studentId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await activeLessonController.subscribeStudentOnActiveLessonStatusChanged(args, context)
};

const studentEnteredAnswer = {
    type: StudentEnteredAnswerType,
    name: "StudentEnterAnswer",
    description: "Fires when student enters or changes answer",
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await activeLessonController.subscribeTeacherOnStudentEnteredAnswer(args, context)
};

// start/end subscription
const rightAnswerShownSubscription = {

};

// student enters the classroom
const studentJoinedSubscription = {

}

// student leaves the classroom
const studentLeftSubscription = {

}

module.exports = {
    activeLessonStatusChanged,
    studentEnteredAnswer
 };
