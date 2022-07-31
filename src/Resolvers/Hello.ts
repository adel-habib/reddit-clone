import { Query, Resolver } from "type-graphql";

@Resolver()
export class Hello{
    @Query(() => String)
    hello(){
        return "Hello from resolver!"
    }
}