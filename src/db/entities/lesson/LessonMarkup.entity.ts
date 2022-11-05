import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("lessonMarkups")
export default class LessonMarkup {
    @PrimaryGeneratedColumn("uuid")
    lessonMarkupId!: string

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
}
