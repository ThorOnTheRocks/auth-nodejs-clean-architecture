import { Router } from "express";
import { AuthController } from "./controller";
import { AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DatabaseFactory } from "../../infrastructure/factories/database.factory";
import { envs } from "../../config";
import { UserRepositoryImpl } from "../../infrastructure/repository/user.repository.impl";
import { RefreshTokenRepositoryImpl } from "../../infrastructure/repository/refresh-token.repository.impl";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authDataSource = DatabaseFactory.createAuthDataSource(envs.DATABASE_TYPE);
    const userDataSource = DatabaseFactory.createUserDataSource(envs.DATABASE_TYPE);
    const refreshTokenDataSource = DatabaseFactory.createRefreshTokenDataSource(envs.DATABASE_TYPE);

    const authRepository = new AuthRepositoryImpl(authDataSource);
    const userRepository = new UserRepositoryImpl(userDataSource);
    const refreshTokenRepository = new RefreshTokenRepositoryImpl(refreshTokenDataSource);

    const controller = new AuthController(authRepository, userRepository, refreshTokenRepository);

    // Define all your auth routes
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    
    router.post('/refresh-token', controller.refreshToken);
    router.post('/logout', controller.logout);
    router.post('logout-all', [AuthMiddleware.validateJWT], controller.logoutAll);

    router.get('/', [AuthMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}