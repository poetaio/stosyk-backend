const { GraphQLNonNull, GraphQLID } = require("graphql");

const { ActiveLessonStatusChangedType, StudentEnteredAnswerType, TeacherShowedHidRightAnswerType } = require("./types");
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

const teacherShowedHidAnswer = {
    type: TeacherShowedHidRightAnswerType,
    name: "teacherShowedHidAnswer",
    description: "Fires when teacher shows or hides right answer",
    args: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await activeLessonController.subscribeStudentOnTeacherShowedHidRightAnswer(args, context)
};

// student enters the classroom
const studentJoinedLeftSubscription = {

}

module.exports = {
    activeLessonStatusChanged,
    studentEnteredAnswer,
    teacherShowedHidAnswer
 };
