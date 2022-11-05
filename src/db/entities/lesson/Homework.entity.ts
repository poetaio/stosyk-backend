import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("homeworks")
export default class Homework {
    @PrimaryGeneratedColumn("uuid")
    homeworkId!: string
}
