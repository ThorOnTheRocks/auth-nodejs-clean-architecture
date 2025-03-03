import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authDataSource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(authDataSource);

    const controller = new AuthController(authRepository);

    // Define all your auth routes
    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    router.get('/', [AuthMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}