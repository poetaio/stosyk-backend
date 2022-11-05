import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("sentences")
export default class Sentence {
    @PrimaryGeneratedColumn("uuid")
    optionId!: string

    @Column({
        nullable: false,
        type: 'int',
        default: 1,
    })
    index!: number

    @Column({
        nullable: false,
    })
    text!: string
}
