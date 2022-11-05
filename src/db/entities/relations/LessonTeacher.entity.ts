import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('lessonTeachers')
export default class LessonTeacher {
    @PrimaryGeneratedColumn("uuid")
    lessonTeacherId!: string
}
