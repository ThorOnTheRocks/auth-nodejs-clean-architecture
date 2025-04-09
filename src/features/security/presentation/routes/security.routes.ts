import { Router } from "express";
import { SecurityController } from "../controllers/security.controller";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/auth.middleware";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { SecurityEventRepositoryImpl } from "../../infrastructure/repositories/security-event.repository.impl";
import { envs } from "../../../../config/envs";

export class SecurityRoutes {
  static get routes(): Router {
    const router = Router();

    const securityEventDataSource =
      DatabaseFactory.createSecurityEventDataSource(envs.DATABASE_TYPE);

    const securityEventRepository = new SecurityEventRepositoryImpl(
      securityEventDataSource,
    );

    const controller = new SecurityController(securityEventRepository);

    router.get(
      "/events/recent",
      [AuthMiddleware.validateJWT],
      controller.getRecentEvents,
    );

    router.get(
      "/events/type/:type",
      [AuthMiddleware.validateJWT],
      controller.getEventsByType,
    );

    router.get(
      "/events/user/:userId",
      [AuthMiddleware.validateJWT],
      controller.getUserEvents,
    );

    return router;
  }
}
