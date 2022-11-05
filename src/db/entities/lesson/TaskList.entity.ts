import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("taskLists")
export default class TaskList {
    @PrimaryGeneratedColumn("uuid")
    taskListId!: string
}
