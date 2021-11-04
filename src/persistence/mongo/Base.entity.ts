import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'

@Entity({ abstract: true })
export abstract class BaseEntity {
    @PrimaryKey()
    _id!: ObjectId

    @SerializedPrimaryKey()
    id!: string

    @Property()
    dateCreated = new Date()

    @Property({ onUpdate: () => new Date() })
    dateUpdated = new Date()
}
