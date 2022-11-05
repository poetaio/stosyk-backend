import {SchoolInvitationStatusEnum} from "../../../utils";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('schools')
export default class TeacherCourse {
    @PrimaryGeneratedColumn("uuid")
    schoolId!: string

    @Column({
        nullable: false,
    })
    inviteEmail!: string

    @Column({
        nullable: false,
        enum: SchoolInvitationStatusEnum,
        default: SchoolInvitationStatusEnum.PENDING,
        type: 'enum',
    })
    status!: SchoolInvitationStatusEnum

    @Column({
        type: 'datetime'
    })
    createdAt!: Date

    @Column({
        type: 'datetime'
    })
    updatedAt!: Date
}
