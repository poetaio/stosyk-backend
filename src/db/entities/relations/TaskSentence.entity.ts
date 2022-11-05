import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('taskSentences')
export default class TaskSentence {
    @PrimaryGeneratedColumn("uuid")
    taskSentenceId!: string
}
