import {LessonStatusEnum} from "../../../utils";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("lessons")
export default class Lesson {
    @PrimaryGeneratedColumn("uuid")
    lessonId!: string

    @Column({
        nullable: false,
        default: 'Урок'
    })
    name!: string

    @Column({
        nullable: false,
        default: 'Урок учителя для учнів'
    })
    description!: string

    @Column({
        nullable: false,
        type: 'enum',
        enum: LessonStatusEnum,
        default: LessonStatusEnum.PENDING
    })
    status!: LessonStatusEnum.PENDING
}
