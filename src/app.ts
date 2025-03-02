import { MongoDatabase } from "./data/mongodb/mongo-database"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"
import { envs } from "./config/envs"

(() => {
  main()
})()

async function main() {

  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME_LOCAL,
    url: envs.MONGO_DB_URL_LOCAL
  })

  new Server({port: 8000, routes: AppRoutes.routes}).start()
}