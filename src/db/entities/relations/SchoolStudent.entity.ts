import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('schoolStudents')
export default class SchoolStudent {
    @PrimaryGeneratedColumn("uuid")
    schoolStudentId!: string

    @Column({
        type: 'datetime',
    })
    joinedAt!: Date;

    @Column({
        type: 'datetime',
    })
    droppedOutAt!: Date;
}

