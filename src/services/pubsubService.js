const {eventNameFactory} = require("../utils");

class PubsubService {
    async subscribeOnLessonStarted(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.lessonStartedEventName(lessonId)]);
    }

    async publishLessonStarted(pubsub, lessonId, payload) {
        return await pubsub.publish(eventNameFactory.lessonStartedEventName(lessonId), {
            lessonStarted: payload
        });
    }

    async subscribeOnPresentStudentsChanged(pubsub, userId, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.presentStudentsChangedEventName(lessonId, userId)]);
    }

    async publishOnPresentStudentsChanged(pubsub, lessonId, userId, payload) {
        return await pubsub.publish(eventNameFactory.presentStudentsChangedEventName(lessonId, userId),
            {presentStudentsChanged: payload});
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

    async subscribeOnStudentPosition(pubsub, teacherId, lessonId){
        return pubsub.asyncIterator([eventNameFactory.studentCurrentPositionChangedEventName(lessonId, teacherId)]);
    }

    async publishOnStudentPosition(pubsub, lessonId, teacherId, payload){
        return await pubsub.publish(eventNameFactory.studentCurrentPositionChangedEventName(lessonId, teacherId),{
            getStudentCurrentPosition: payload
        });
    }
}

module.exports = new PubsubService();
