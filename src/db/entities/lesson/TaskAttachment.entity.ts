import AttachmentTypeEnum from "../../../utils/enums/AttachmentType.enum";

const attachmentTypeEnum = require('../../../utils/enums/AttachmentType.enum')

module.exports = (sequelize, DataTypes) => sequelize.define('taskAttachments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contentType: {
        type: DataTypes.ENUM(...Object.values(attachmentTypeEnum)),
    }
});

import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('taskAttachments')
export default class TaskAttachment {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        nullable: false,
    })
    source!: string;

    @Column({
        nullable: false,
    })
    title!: string;

    @Column({
        type: 'enum',
        enum: AttachmentTypeEnum,
        nullable: false,
    })
    contentType!: AttachmentTypeEnum;
}
