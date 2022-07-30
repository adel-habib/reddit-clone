import {MikroORM} from "@mikro-orm/core"
import { __PROD__ } from "./constants"
import dbConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer} from 'apollo-server-express'
import  {buildSchema} from 'type-graphql'
import { HelloResolver } from "./resolvers/hello"
const main = async () => {
    const orm = await MikroORM.init(dbConfig)
    orm.getMigrator().up()
    const app = express()
    const apolloServer = new ApolloServer({
        schema : await buildSchema({
            resolvers: [HelloResolver],
            validate: false
        })
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({app})
    app.listen(4000,()=> {
        console.log("SERVER started and is listning on 4000")
    })
}

main()