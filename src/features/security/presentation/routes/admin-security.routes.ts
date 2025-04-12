import { Router } from "express";
import { AdminSecurityController } from "../controllers/admin-security.controller";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/auth.middleware";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { UserRepositoryImpl } from "../../../auth/infrastructure/repositories/user.repository.impl";
import { SecurityEventRepositoryImpl } from "../../infrastructure/repositories/security-event.repository.impl";
import { AdminMiddleware } from "../middlewares/check-admin.middleware";
import { envs } from "../../../../config/envs";

export class AdminSecurityRoutes {
  static get routes(): Router {
    const router = Router();

    const userDataSource = DatabaseFactory.createUserDataSource(
      envs.DATABASE_TYPE,
    );

    const securityEventDataSource =
      DatabaseFactory.createSecurityEventDataSource(envs.DATABASE_TYPE);

    const userRepository = new UserRepositoryImpl(userDataSource);
    const securityEventRepository = new SecurityEventRepositoryImpl(
      securityEventDataSource,
    );

    const controller = new AdminSecurityController(
      userRepository,
      securityEventRepository,
    );

    // Admin security routes
    router.post(
      "/users/:userId/lock",
      [AuthMiddleware.validateJWT, AdminMiddleware.isAdmin],
      controller.lockAccount,
    );

    router.post(
      "/users/:userId/unlock",
      [AuthMiddleware.validateJWT, AdminMiddleware.isAdmin],
      controller.unlockAccount,
    );

    router.get(
      "/users/:userId/events",
      [AuthMiddleware.validateJWT, AdminMiddleware.isAdmin],
      controller.getUserSecurityEvents,
    );

    router.get(
      "/events/failed-logins",
      [AuthMiddleware.validateJWT, AdminMiddleware.isAdmin],
      controller.getFailedLoginAttempts,
    );

    return router;
  }
}
