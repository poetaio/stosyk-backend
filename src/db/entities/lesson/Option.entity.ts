import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("options")
export default class Option {
    @PrimaryGeneratedColumn("uuid")
    optionId!: string

    @Column({
        nullable: false,
    })
    value!: string

    @Column({
        nullable: false,
        default: false
    })
    isCorrect!: boolean
}
