import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('schools')
export default class TeacherCourse {
    @PrimaryGeneratedColumn("uuid")
    schoolId!: string

    @Column({
        nullable: false,
    })
    name!: string

    @Column({
        nullable: false,
        default: 0,
        type: 'int',
    })
    totalSeatsCount!: number

    @Column({
        type: 'datetime'
    })
    createdAt!: Date

    @Column({
        type: 'datetime'
    })
    updatedAt!: Date
}
