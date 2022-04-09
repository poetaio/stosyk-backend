const {User, Lesson, ActiveLesson, StudentAnswerSheet} = require("../models");
const sequelize = require('sequelize');

class TestDataService {
    async createAndLogActiveLessonTeachersAndStudents() {
        const student1 = await User.create();
        const student2 = await User.create();
        const teacher = await User.create();
        const lesson = await Lesson.create({ authorId: teacher.id });
        const activeLesson = await ActiveLesson.create({ lessonMarkupId: lesson.id, teacherId: teacher.id });
        // await activeLesson.update(
        //     { '': sequelize.fn('array_append', sequelize.col(''), student1) },
        //     { where: { id: activeLesson.id } }
        // );
        // await activeLesson.update(
        //     { '': sequelize.fn('array_append', sequelize.col(''), student2) },
        //     { where: { id: activeLesson.id } }
        // );
        const student1AnswerSheet = await StudentAnswerSheet.create({ activeLessonId: activeLesson.id, studentId: student1.id });
        const student2AnswerSheet = await StudentAnswerSheet.create({ activeLessonId: activeLesson.id, studentId: student2.id });

        console.log(`Student ids: \n${student1.id} \n${student2.id}`);
        console.log(`Teacher id: ${teacher.id}`);
        console.log(`Lesson id: ${lesson.id}`);
        console.log(`Active lesson id: ${activeLesson.id}`);
    }
}

module.exports = new TestDataService();
