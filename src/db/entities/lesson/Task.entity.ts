import {TaskTypeEnum} from "../../../utils";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("tasks")
export default class Task {
    @PrimaryGeneratedColumn("uuid")
    taskId!: string

    @Column({
        nullable: false,
    })
    name!: string

    @Column({
        nullable: false,
        default: false,
    })
    answersShown!: boolean;

    @Column({
        type: 'enum',
        enum: TaskTypeEnum,
        nullable: false,
        default: TaskTypeEnum.MULTIPLE_CHOICE,
    })
    type!: TaskTypeEnum;

    @Column({
        nullable: false,
        default: "",
    })
    description!: string;
}
