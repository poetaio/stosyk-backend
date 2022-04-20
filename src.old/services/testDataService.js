const {Student, Teacher, Lesson, ActiveLesson, StudentAnswerSheet} = require("../models");
const lessonInclude = require('../models/includes/lessonInclude');
const activeLessonService = require('./lesson_active/activeLessonService');
const lessonService = require('./lesson_constructor/lessonService');
const studentService = require('../services/studentService');

class TestDataService {
    async createAndLogActiveLessonTeachersAndStudents() {
        const student1 = await Student.create({ name: "Mia" });
        const student2 = await Student.create({ name: "Max" });
        const teacher = await Teacher.create();
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

    async createAndLogTeacherAndLessonWithData() {
        const teacher = await Teacher.create({});

        const lesson = await lessonService.createWithAuthorIdAndTasks(
            teacher.id,
            [ {
                text: "Slava ",
                name: "Which is right?",
                description: "Enter right option",
                gaps: [ {
                    gapPosition: 6,
                    options: [
                        "Ukraini",
                        "Nazii",
                        "ZSU",
                        "All of the above"
                    ],
                    rightOption: "All of the above"
                }]
            }]);

        // console.log(lesson);
        return lesson;
    }

    async createLessonMarkupAndActiveLesson() {
        const lesson = await this.createAndLogTeacherAndLessonWithData();

        const activeLesson = await activeLessonService.create(lesson.authorId, lesson.id);

        console.log(`active lesson: ${activeLesson}`);

        return activeLesson;
    }

    async createStudent() {
        console.log(await studentService.create("Ilia").then(({id}) => id));
        console.log(await studentService.create("Margo").then(({id}) => id));
    }
}

module.exports = new TestDataService();
