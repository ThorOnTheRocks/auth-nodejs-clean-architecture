import { Router } from "express";
import { AuthController } from "./controller";
import { AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DatabaseFactory } from "../../infrastructure/factories/database.factory";
import { envs } from "../../config";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authDataSource = DatabaseFactory.createAuthDataSource(envs.DATABASE_TYPE);
    const authRepository = new AuthRepositoryImpl(authDataSource);

    const controller = new AuthController(authRepository);

    // Define all your auth routes
    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    router.get('/', [AuthMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}