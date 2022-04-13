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
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStatusChangedEventName(activeLessonId)]);
    }

    // payload: taskId, gapId, rightOption
    async publishTeacherShowedAnswer(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonTeacherShowedAnswerEventName(activeLessonId), payload);
    }

    async subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStudentEnterAnswerEvent(activeLessonId)]);
    }

    // payload: taskId, gapId, optionId, studentId
    async publishStudentEnterAnswer(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentEnterAnswerEvent(activeLessonId), payload);
    }

    async subscribeTeacherOnStudentJoinedLeftLesson(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId)]);
    }

    // studentId, actionName
    async publishStudentJoinedLeftLesson(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId), payload);
    }

    // test change for setup
    async publishStudentChangedActiveLesson(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.studentChangedLessonEventName(activeLessonId), payload)
    }

    // test change for setup
    async publishTeacherChangedActiveLesson(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.teacherChangedLessonEventName(activeLessonId), payload)
    }

    // test change for setup
    async subscribeToTeacherChangedActiveLesson(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.teacherChangedLessonEventName(activeLessonId)]);
    }

    // test change for setup
    async subscribeToStudentChangedActiveLesson(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.studentChangedLessonEventName(activeLessonId)]);
    }
}

module.exports = new SubscribePublishService();
