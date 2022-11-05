import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('sentenceGaps')
export default class SentenceGap {
    @PrimaryGeneratedColumn("uuid")
    sentenceGapId!: string
}
