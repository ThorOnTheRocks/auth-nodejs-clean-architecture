import { Router } from "express";
import { VerificationController } from "../controllers/verification.controller";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/auth.middleware";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { UserRepositoryImpl } from "../../../auth/infrastructure/repositories/user.repository.impl";
import { EmailRepositoryImpl } from "../../../email/infrastructure/repositories/email.repository.impl";
import { VerificationTokenRepositoryImpl } from "../../infrastructure/repositories/verification-token.repository.impl";
import { ResendEmailDataSourceImpl } from "../../../email/infrastructure/datasources/email.datasource.impl";
import { envs } from "../../../../config/envs";

export class VerificationRoutes {
  static get routes(): Router {
    const router = Router();

    const userDataSource = DatabaseFactory.createUserDataSource(
      envs.DATABASE_TYPE,
    );
    const verificationTokenDataSource =
      DatabaseFactory.createVerificationTokenDataSource(envs.DATABASE_TYPE);
    const emailDataSource = new ResendEmailDataSourceImpl();

    const userRepository = new UserRepositoryImpl(userDataSource);
    const verificationTokenRepository = new VerificationTokenRepositoryImpl(
      verificationTokenDataSource,
    );
    const emailRepository = new EmailRepositoryImpl(emailDataSource);

    const controller = new VerificationController(
      verificationTokenRepository,
      userRepository,
      emailRepository,
    );

    router.get("/verify", controller.verifyEmail);
    router.post(
      "/resend",
      AuthMiddleware.validateJWT,
      controller.resendVerificationEmail,
    );

    return router;
  }
}
