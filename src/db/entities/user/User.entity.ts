import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserRoleEnum, UserTypeEnum} from "../../../utils";

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn("uuid")
    userId!: string

    @Column({
        nullable: false,
        default: "Name",
    })
    name!: string

    @Column({
        nullable: false,
        enum: UserRoleEnum,
        default: UserRoleEnum.STUDENT,
        type: 'enum',
    })
    role!: UserRoleEnum

    @Column({
        nullable: false,
        enum: UserTypeEnum,
        default: UserTypeEnum.ANONYMOUS,
        type: 'enum',
    })
    type!: UserTypeEnum
}
