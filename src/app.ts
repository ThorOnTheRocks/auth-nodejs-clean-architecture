import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { envs } from "./config/envs";
import "reflect-metadata";
import { connectToDatabase } from "./database/database-connectors";
import { SecurityLoggerService } from "./features/security/application/security-logger.service";
import { SecurityEventRepositoryImpl } from "./features/security/infrastructure/repositories/security-event.repository.impl";
import { BruteForceProtectionService } from "./features/security/application/brute-force-protection.service";
import { LoginAttemptRepositoryImpl } from "./features/security/infrastructure/repositories/login-attempt.repository.impl";
import { DatabaseFactory } from "./infrastructure/factories/database.factory";
import { UserRepositoryImpl } from "./features/auth/infrastructure/repositories/user.repository.impl";

(() => {
  main();
})();

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  console.log(
    `Starting in ${isProduction ? "production" : "development"} mode`,
  );

  await connectToDatabase(envs.DATABASE_TYPE);

  const securityEventDataSource = DatabaseFactory.createSecurityEventDataSource(
    envs.DATABASE_TYPE,
  );
  const securityEventRepository = new SecurityEventRepositoryImpl(
    securityEventDataSource,
  );
  SecurityLoggerService.getInstance().initialize(securityEventRepository);

  const loginAttemptDataSource = DatabaseFactory.createLoginAttemptDataSource(
    envs.DATABASE_TYPE,
  );
  const loginAttemptRepository = new LoginAttemptRepositoryImpl(
    loginAttemptDataSource,
  );
  const userDataSource = DatabaseFactory.createUserDataSource(
    envs.DATABASE_TYPE,
  );
  const userRepository = new UserRepositoryImpl(userDataSource);

  BruteForceProtectionService.getInstance().initialize(
    loginAttemptRepository,
    userRepository,
  );
  new Server({ port: envs.PORT, routes: AppRoutes.routes }).start();
}
