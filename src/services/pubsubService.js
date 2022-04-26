const {eventNameFactory} = require("../utils");

class PubsubService {
    async subscribeOnLessonStatusChanged(pubsub, lessonId, studentId) {
        return pubsub.asyncIterator([eventNameFactory.lessonStatusChangedEventName(lessonId, studentId)]);
    }

    async publishOnLessonStatusChanged(pubsub, lessonId, payload) {
        // payload: { lessonId: lessonID, status: "ACTIVE" }
        return await pubsub.publish(eventNameFactory.lessonStatusChangedEventName(lessonId), {
            lessonStatusChanged: payload
        });
    }

    async subscribeOnPresentStudentsChanged(pubsub, userId, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.presentStudentsChangedEventName(lessonId, userId)]);
    }

    async publishOnPresentStudentsChanged(pubsub, lessonId, userId, payload) {
        // payload: [ { studentId: "sdfsdfsd", name: "sfsdf" } ]
        return await pubsub.publish(eventNameFactory.presentStudentsChangedEventName(lessonId, userId), payload);
    }

    async subscribeOnStudentsAnswersChanged(pubsub, lessonId, teacherId) {
        return pubsub.asyncIterator([eventNameFactory.studentsAnswersChangedEventName(lessonId, teacherId)]);
    }

    async publishOnStudentsAnswersChanged(pubsub, lessonId, teacherId, payload) {
        return pubsub.publish(eventNameFactory.studentsAnswersChangedEventName(lessonId, teacherId), payload);
    }

    async subscribeOnTeacherShowedRightAnswers(pubsub, lessonId, studentId) {
        return pubsub.asyncIterator([eventNameFactory.teacherShowedAnswersEventName(lessonId, studentId)]);
    }

    async publishOnTeacherShowedRightAnswers(pubsub, lessonId, payload) {
        return pubsub.publish(eventNameFactory.teacherShowedAnswersEventName(lessonId), payload);
    }
}

module.exports = new PubsubService();
