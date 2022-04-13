const eventNamesFactory = require('./utils/eventNamesFactory');


class SubscribePublishService {
    async subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId) {
        // no await
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStatusChangedEventName(activeLessonId)]);
    }

    // payload: newStatus
    async publishActiveLessonStatusChanged(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStatusChangedEventName(activeLessonId),
            { activeLessonStatusChanged: payload });
    }

    async subscribeStudentOnTeacherShowedAnswer(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonTeacherShowedHidAnswerEventName(activeLessonId)]);
    }

    // payload: taskId, action(Showed/Hid)
    async publishTeacherShowedHidAnswer(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonTeacherShowedHidAnswerEventName(activeLessonId),
            { teacherShowedHidAnswer: payload });
    }

    async subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStudentEnterAnswerEvent(activeLessonId)]);
    }

    // payload: taskId, gapId, optionId, studentId
    async publishStudentEnteredAnswer(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentEnterAnswerEvent(activeLessonId),
            { studentEnteredAnswer: payload });
    }

    async subscribeTeacherOnStudentJoinedLeftLesson(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId)]);
    }

    // studentId, actionName
    async publishStudentJoinedLeftLesson(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId),
            { studentJoinedLeftLesson: payload });
    }
}

module.exports = new SubscribePublishService();
