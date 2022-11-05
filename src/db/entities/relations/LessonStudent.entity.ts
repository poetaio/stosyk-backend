import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('lessonStudents')
export default class LessonStudent {
    @PrimaryGeneratedColumn("uuid")
    lessonStudentId!: string
}
