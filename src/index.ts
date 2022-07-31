import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
import { Post } from "./entities/Post"
import DBCONFIG from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import {buildSchema} from "type-graphql"
import { Hello } from "./Resolvers/Hello"
import { PostResolver } from "./Resolvers/Post"
const main =async () => {
    const orm = await MikroORM.init(DBCONFIG)
    await orm.getMigrator().up()
    const app = express()
    const apolloSever = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Hello, PostResolver],
            validate: false
        }),
        context: () => ({
            em: orm.em.fork({})
        })
    })
    apolloSever.applyMiddleware({app})

    app.listen(4000,()=> {
        console.log("Server Started!")
    })
    app.get("/",(_,res) => {
        res.send("Hello World")
    })
    const em = orm.em.fork({})
    const post = em.create(Post,{title: "My title"})
    em.persistAndFlush(post)

}

main()