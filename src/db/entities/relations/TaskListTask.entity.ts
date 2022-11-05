import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('taskListTasks')
export default class TaskListTask {
    @PrimaryGeneratedColumn("uuid")
    taskListTaskId!: string
}
