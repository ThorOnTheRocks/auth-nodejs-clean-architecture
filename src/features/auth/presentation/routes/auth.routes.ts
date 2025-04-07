import { VerificationTokenRepositoryImpl } from "../../../verification/infrastructure/repositories/verification-token.repository.impl";
import { EmailRepositoryImpl } from "../../../email/infrastructure/repositories/email.repository.impl";
import { ResendEmailDataSourceImpl } from "../../../email/infrastructure/datasources/email.datasource.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { Router } from "express";
import { envs } from "../../../../config";
import { RefreshTokenRepositoryImpl } from "../../../token/infrastructure/repositories/refresh-token.repository.impl";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository.impl";
import { VerifiedEmailMiddleware } from "../middlewares/verified-email.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authDataSource = DatabaseFactory.createAuthDataSource(
      envs.DATABASE_TYPE,
    );
    const userDataSource = DatabaseFactory.createUserDataSource(
      envs.DATABASE_TYPE,
    );
    const refreshTokenDataSource = DatabaseFactory.createRefreshTokenDataSource(
      envs.DATABASE_TYPE,
    );
    const verificationTokenDataSource =
      DatabaseFactory.createVerificationTokenDataSource(envs.DATABASE_TYPE);
    const emailDataSource = new ResendEmailDataSourceImpl();

    const authRepository = new AuthRepositoryImpl(authDataSource);
    const userRepository = new UserRepositoryImpl(userDataSource);
    const refreshTokenRepository = new RefreshTokenRepositoryImpl(
      refreshTokenDataSource,
    );
    const verificationTokenRepository = new VerificationTokenRepositoryImpl(
      verificationTokenDataSource,
    );
    const emailRepository = new EmailRepositoryImpl(emailDataSource);

    const controller = new AuthController(
      authRepository,
      userRepository,
      refreshTokenRepository,
      verificationTokenRepository,
      emailRepository,
    );

    // Define all your auth routes
    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);

    router.post("/refresh-token", controller.refreshToken);
    router.post("/logout", controller.logout);
    router.post(
      "/logout-all",
      [
        AuthMiddleware.validateJWT,
        VerifiedEmailMiddleware.requireVerifiedEmail,
      ],
      controller.logoutAll,
    );
    router.post(
      "/change-password",
      AuthMiddleware.validateJWT,
      controller.changePassword,
    );

    router.get("/", AuthMiddleware.validateJWT, controller.getUsers);

    return router;
  }
}
