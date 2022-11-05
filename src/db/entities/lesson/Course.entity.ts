import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("courses")
export default class Course {
    @PrimaryGeneratedColumn("uuid")
    courseId!: string

    @Column({
        nullable: false,
    })
    name!: string
}