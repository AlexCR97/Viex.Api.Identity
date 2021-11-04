import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../Base.entity";

@Entity()
export class RefreshToken extends BaseEntity {
    @Property()
    token!: string
}