import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
import DBCONFIG from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import {buildSchema} from "type-graphql"
import { Hello } from "./Resolvers/Hello"
import { PostResolver } from "./Resolvers/Post"
import { UserResolver } from "./Resolvers/user"
import connectRedis from "connect-redis"
import session from "express-session"
import { createClient } from "redis"
import { MyContext } from "./types"




const main =async () => {
    const orm = await MikroORM.init(DBCONFIG)
    await orm.getMigrator().up()
    const app = express()

    const redisStore = connectRedis(session)
    const redisCliet = createClient({legacyMode: true})
    await redisCliet.connect()

    app.use(session({
        name: "qid",
        saveUninitialized: false,
        store: new redisStore({ client: redisCliet as any, disableTouch: true, }),
        cookie: {
            maxAge: 1000 * 60 * 60* 24 * 365 * 10,
            httpOnly: true,
            secure: __prod__,
            sameSite: "lax"

        },
        /**
         * THIS IS HOW I THINK IT WORKS!
         * USER TRIES TO LOGIN -> 
         * We set: req.session!.userId = user.id
         * {userId: 1} this gets sent to reddis which is a key value store 
         * josdfhdjghdhnf (let's call this key1) -> {userId : 1 }
         * the express session middle ware will set a cookie on the browser: kdjgifdwshgfisdhjf (let's call this cookie1) 
         * now cookie1 is a signed version of key1 
         * 
         * Now when the user makes a request, this cookie value (cookie1) will be sent to the server
         * The server can then unsign cookie1 
         * cookie1 -> key1 
         * using key1 we can get its associated value -> the app will make a request to redis and get {userId: 1}
         * 
         */
        secret: "sdkfjkopsdjfjdfkdjgjrihj",
        resave: false,
    }))

    const apolloSever = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Hello, PostResolver,UserResolver],
            validate: false
        }),
        context: ({req, res}) : MyContext => ({
            em: orm.em.fork({}), req, res
        })
    })
    apolloSever.applyMiddleware({app})

    app.listen(4000,()=> {
        console.log("Server Started!")
    })
    app.get("/",(_,res) => {
        res.send("Hello World")
    })

}

main()