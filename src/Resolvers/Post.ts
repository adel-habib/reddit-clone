import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Ctx, Int, Query, Resolver, Arg,Mutation } from "type-graphql";

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    posts(
         @Ctx() ctx: MyContext
    ){
        return ctx.em.find(Post,{})
    }
    @Query( () => Post)
    post(
    @Arg("id", () => Int) id : number,
    @Ctx() ctx: MyContext
    ) : Promise<Post | null> {
        return ctx.em.findOne(Post, {id} )
    }

    @Mutation(() => Post)
    async create(
        @Arg("title", ()=> String) title :  string,
        @Ctx() {em} : MyContext
    ) {
        const post = em.create(Post,{title})
        await em.persistAndFlush(post)
        return post
    }
    @Mutation( () => Post, {nullable: true})
    async updatePost(
        @Arg("id",() => Int) id: number,
        @Arg("title",() => String) title : string,
        @Ctx() {em} : MyContext
    ) : Promise<Post | null>{
        const post = await em.findOne(Post,{id})
        if(!post){
            return null
        }
        if(typeof post !== "undefined"){
            post.title = title
            em.persistAndFlush(post)
        }
        return post
    }

}