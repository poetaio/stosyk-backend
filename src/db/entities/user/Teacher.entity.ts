import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('teachers')
export default class Teacher {
    @PrimaryGeneratedColumn("uuid")
    teacherId!: string
}
