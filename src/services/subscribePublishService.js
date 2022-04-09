const eventNamesFactory = require('./utils/eventNamesFactory');


class SubscribePublishService {
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
