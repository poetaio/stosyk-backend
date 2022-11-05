import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('teacherCourses')
export default class TeacherCourse {
    @PrimaryGeneratedColumn("uuid")
    teacherCourseId!: string
}
