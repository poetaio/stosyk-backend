import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('students')
export default class Student {
    @PrimaryGeneratedColumn("uuid")
    studentId!: string
}
