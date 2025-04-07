import { Router } from "express";
import { PasswordResetController } from "../controllers/password-reset.controller";
import { DatabaseFactory } from "../../../../infrastructure/factories/database.factory";
import { UserRepositoryImpl } from "../../../auth/infrastructure/repositories/user.repository.impl";
import { EmailRepositoryImpl } from "../../../email/infrastructure/repositories/email.repository.impl";
import { PasswordResetTokenRepositoryImpl } from "../../infrastructure/repositories/password-reset-token.repository.impl";
import { ResendEmailDataSourceImpl } from "../../../email/infrastructure/datasources/email.datasource.impl";
import { envs } from "../../../../config/envs";

export class PasswordResetRoutes {
  static get routes(): Router {
    const router = Router();

    const userDataSource = DatabaseFactory.createUserDataSource(
      envs.DATABASE_TYPE,
    );
    const passwordResetTokenDataSource =
      DatabaseFactory.createPasswordResetTokenDataSource(envs.DATABASE_TYPE);
    const emailDataSource = new ResendEmailDataSourceImpl();

    const userRepository = new UserRepositoryImpl(userDataSource);
    const passwordResetTokenRepository = new PasswordResetTokenRepositoryImpl(
      passwordResetTokenDataSource,
    );
    const emailRepository = new EmailRepositoryImpl(emailDataSource);

    const controller = new PasswordResetController(
      passwordResetTokenRepository,
      userRepository,
      emailRepository,
    );

    // Routes
    router.post("/request", controller.requestPasswordReset);
    router.get("/validate", controller.validateResetToken);
    router.post("/reset", controller.resetPassword);

    return router;
  }
}
