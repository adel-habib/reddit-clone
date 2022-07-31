import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Field, InputType, Mutation, Resolver, Ctx, ObjectType } from "type-graphql";
import argon2 from "argon2"


@InputType()
class userOptions{
    @Field()
    username : string

    @Field()
    password: string
}


@ObjectType()
class FieldError{
    @Field()
    field : string 
    @Field()
    message: string 
}

@ObjectType()
class UserResponse{
    @Field( () => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field( () => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver{
    @Mutation(() => UserResponse)
    async Register(
        @Arg('options') options: userOptions,
        @Ctx()  {em} : MyContext
    ) : Promise<UserResponse> {
        if(options.username.length <=2 ){
            return {
                errors : [
                    {
                        field: "username",
                        message: "Too short"
                    }
                ]
            }
        }

        if(options.password.length <8 ){
            return {
                errors : [
                    {
                        field: "password",
                        message: "password must be at least 8 chars long"
                    }
                ]
            }
        }


        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User,{username: options.username,password:hashedPassword})

        try{
            await em.persistAndFlush(user)
        } catch(error) {
            if(error.code === "23505" ){
                return {
                    errors: [{field: "username", message: "username already exists"}]
                }
            }
            console.log(error)
        }
        
        return {
            user: user
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: userOptions,
        @Ctx()  {em} : MyContext
    ){
        const user = await em.findOne(User, {username: options.username})
        if(!user){
            return{
                errors: [{
                    field: "username",
                    message: "Not found"
                }]
            }
        }

        const valid = await argon2.verify(user.password,options.password)
        if(!valid){
            return{
                errors: [{
                    field: "passwort",
                    message: "Incorrect password"
                }]
            }
        }
        return {user}
    }



}