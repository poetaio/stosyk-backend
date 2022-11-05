import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("gaps")
export default class Gap {
    @PrimaryGeneratedColumn("uuid")
    gapId!: string

    @Column({
        nullable: false,
        type: 'int',
    })
    position!: number
}
