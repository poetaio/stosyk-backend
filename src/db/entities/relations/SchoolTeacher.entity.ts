import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import SchoolTeacherAccessRightEnum from "../../../utils/enums/SchoolTeacherAccessRight.enum";

@Entity('schoolTeachers')
export default class SchoolTeacher {
    @PrimaryGeneratedColumn("uuid")
    schoolTeacherId!: string

    @Column({
        nullable: false,
        type: 'enum',
        enum: SchoolTeacherAccessRightEnum,
        default: SchoolTeacherAccessRightEnum.RUN_LESSONS,
    })
    accessRight!: SchoolTeacherAccessRightEnum;
}
