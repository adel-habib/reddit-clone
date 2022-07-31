import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
    [OptionalProps]?: 'createdAt' | 'updatedAt';

    @Field(() => Int)
    @PrimaryKey()
    id!: number


    @Field(() => String)
    @Property({type: 'date'})
    createdAt : Date = new Date()

    @Field( () => String)
    @Property({type: 'date', onUpdate: () => new Date()})
    updatedAt = new Date()

    @Field(() => String)
    @Property()
    title!: string



}