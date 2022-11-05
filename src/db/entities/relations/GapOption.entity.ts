import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('gapOptions')
export default class GapOption {
    @PrimaryGeneratedColumn("uuid")
    gapOptionId!: string
}

