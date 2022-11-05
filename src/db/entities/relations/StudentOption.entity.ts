import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('studentOptions')
export default class StudentOption {
    @PrimaryGeneratedColumn("uuid")
    studentOptionId!: string
}
