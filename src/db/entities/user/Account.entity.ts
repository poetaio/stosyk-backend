import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AccountStatusEnum} from "../../../utils";

@Entity('accounts')
export default class Account {
    @PrimaryGeneratedColumn("uuid")
    accountId!: string

    @Column({
        nullable: false,
        unique: true,
    })
    login!: string

    @Column({
        nullable: false,
    })
    passwordHash!: string

    @Column({
        nullable: false,
        enum: AccountStatusEnum,
        default: AccountStatusEnum.UNVERIFIED,
        type: 'enum',
    })
    status!: AccountStatusEnum

    @Column({
        nullable: false,
    })
    avatarSource!: string

    // todo:
// {
//     hooks: {
//         afterCreate: (record) => {
//             delete record.dataValues.passwordHash;
//         },
//         afterUpdate: (record) => {
//             delete record.dataValues.passwordHash;
//         },
//     }
// }
}
