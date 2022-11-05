import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('lessonCourses')
export default class LessonCourse {
    @PrimaryGeneratedColumn("uuid")
    lessonCourseId!: string
}
