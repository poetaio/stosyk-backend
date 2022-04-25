const {eventNameFactory} = require("../utils");

class PubsubService {
    async subscribeOnLessonStatusChanged(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.lessonStatusChangedEventName(lessonId)]);
    }

    async publishOnLessonStatusChanged(pubsub, lessonId, payload) {
        return await pubsub.publish(eventNameFactory.lessonStatusChangedEventName(lessonId), payload);
    }

    async subscribeOnPresentStudentsChanged(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.presentStudentsChangedEventName(lessonId)]);
    }

    async publishOnPresentStudentsChanged(pubsub, lessonId, payload) {
        return await pubsub.publish(eventNameFactory.presentStudentsChangedEventName(lessonId), payload);
    }

    async subscribeOnStudentsAnswersChanged(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.studentsAnswersChangedEventName(lessonId)]);
    }

    async publishOnStudentsAnswersChanged(pubsub, lessonId, payload) {
        return pubsub.publish(eventNameFactory.studentsAnswersChangedEventName(lessonId), payload);
    }

    async subscribeOnTeacherShowedRightAnswers(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.teacherShowedAnswersEventName(lessonId)]);
    }

    async publishOnTeacherShowedRightAnswers(pubsub, lessonId, payload) {
        return pubsub.publish(eventNameFactory.teacherShowedAnswersEventName(lessonId), payload);
    }
}

module.exports = new PubsubService();
