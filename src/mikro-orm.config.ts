
import { MikroORM } from "@mikro-orm/core"
import path from "path"
import { __PROD__ } from "./constants"
import { Post } from "./entities/Post"

export default {
    allowGlobalContext: true,
    migrations : {
        path: path.join(__dirname,"./migrations"),
        pathTs: path.join(__dirname,"./migrations")
    },
    dbName: 'lireddit',
    password: 'test',
    entities: [Post],
    type: 'postgresql',
    debug: !__PROD__
} as Parameters<typeof MikroORM.init>[0]