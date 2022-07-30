import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
    [OptionalProps]?: 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id!: number

    @Property({type: 'date'})
    createdAt : Date = new Date()

    @Property({type: 'date', onUpdate: () => new Date()})
    updatedAt = new Date()

    @Property()
    title!: string

    @Property()
    content: string




}