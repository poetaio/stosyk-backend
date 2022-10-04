const {eventNameFactory} = require("../utils");

class PubsubService {
    async subscribeOnLessonStatus(pubsub, lessonId) {
        return pubsub.asyncIterator([eventNameFactory.lessonStatusChangedEventName(lessonId)]);
    }

    async publishLessonStatus(pubsub, lessonId, payload) {
        return await pubsub.publish(eventNameFactory.lessonStatusChangedEventName(lessonId), {
            lessonStatusChanged: payload
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

    async subscribeOnStudentPosition(pubsub, userId, lessonId){
        return pubsub.asyncIterator([eventNameFactory.studentCurrentPositionChangedEventName(lessonId, userId)]);
    }

    async publishOnStudentPosition(pubsub, lessonId, userId, payload){
        return await pubsub.publish(eventNameFactory.studentCurrentPositionChangedEventName(lessonId, userId),{
            getStudentCurrentPosition: payload
        });
    }

    async subscribeOnStudentOnLesson(pubsub, studentId, lessonId){
        return pubsub.asyncIterator([eventNameFactory.studentOnLessonEventName(lessonId, studentId)]);
    }

    async publishOnStudentOnLesson(pubsub, lessonId, studentId, payload){
        return await pubsub.publish(eventNameFactory.studentOnLessonEventName(lessonId, studentId),{
            studentOnLesson: payload
        });
    }
}

module.exports = new PubsubService();
