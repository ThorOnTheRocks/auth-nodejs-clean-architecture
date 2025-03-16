import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { envs } from "./config/envs";
import "reflect-metadata";
import { connectToDatabase } from "./infrastructure/database/database-connectors";

(() => {
  main();
})();

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  console.log(
    `Starting in ${isProduction ? "production" : "development"} mode`,
  );

  await connectToDatabase(envs.DATABASE_TYPE);

  new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
}
