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
    async publishStudentEnteredAnswer(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentEnterAnswerEvent(activeLessonId),
            { studentEnteredAnswer: payload });
    }

    async subscribeTeacherOnStudentJoinedLeftLesson(pubsub, activeLessonId) {
        return pubsub.asyncIterator([eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId)]);
    }

    // studentId, actionName
    async publishStudentJoinedLeftLesson(pubsub, activeLessonId, payload) {
        await pubsub.publish(eventNamesFactory.activeLessonStudentJoinedLeftLessonEvent(activeLessonId), payload);
    }
}

module.exports = new SubscribePublishService();
