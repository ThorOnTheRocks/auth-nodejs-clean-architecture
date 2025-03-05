import { MongoDatabase } from "./data/mongodb/mongo-database"
import { PostgresDatabase } from "./data/postgres/postgres.database"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"
import { envs } from "./config/envs"
import "reflect-metadata"

(() => {
  main()
})()

async function main() {

  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME_LOCAL,
    url: envs.MONGO_DB_URL_LOCAL
  })

  await PostgresDatabase.connect({
    username: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    database: envs.POSTGRES_DB,
    host: 'localhost',
    port: envs.POSTGRES_LOCAL_PORT
  })

  new Server({port: 8000, routes: AppRoutes.routes}).start()
}