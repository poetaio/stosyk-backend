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
        return await pubsub.publish(eventNameFactory.studentsAnswersChangedEventName(lessonId, teacherId), {
            studentAnswersChanged: payload
        });
    }

    async subscribeOnTeacherShowedRightAnswers(pubsub, lessonId, studentId) {
        return pubsub.asyncIterator([eventNameFactory.teacherShowedAnswersEventName(lessonId, studentId)]);
    }

    async publishOnTeacherShowedRightAnswers(pubsub, lessonId, studentId, payload) {
        return await pubsub.publish(eventNameFactory.teacherShowedAnswersEventName(lessonId, studentId), {
            correctAnswersShown: payload
        });
    }
}

module.exports = new PubsubService();
