import { PostgresDatabase } from "./data/postgres/postgres.database"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"
import { envs } from "./config/envs"
import "reflect-metadata"

(() => {
  main()
})()

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Starting in ${isProduction ? 'production' : 'development'} mode`);
  

  await PostgresDatabase.connect({
    username: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    database: envs.POSTGRES_DB,
    host: 'postgres-db',
    port: envs.POSTGRES_LOCAL_PORT
  })

  new Server({port: envs.PORT, routes: AppRoutes.routes}).start()
}