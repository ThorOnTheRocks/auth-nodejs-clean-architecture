import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { PasswordResetTokenRepository } from "../../domain/repositories/password-reset-token.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { RequestPasswordReset } from "../../domain/use-cases/request-password-reset.use-case";
import { ValidateResetToken } from "../../domain/use-cases/validate-reset-token.use-case";
import { ResetPassword } from "../../domain/use-cases/reset-password.use-case";
import { RequestPasswordResetDTO } from "../../domain/dtos/request-password-reset.dto";
import { ResetPasswordDTO } from "../../domain/dtos/reset-password.dto";

export class PasswordResetController {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly emailRepository: EmailRepository,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, requestDTO] = RequestPasswordResetDTO.create(req.body);

      if (error) {
        res.status(400).json({ error });
        return;
      }

      await new RequestPasswordReset(
        this.passwordResetTokenRepository,
        this.emailRepository,
        this.userRepository,
      ).execute(requestDTO!);

      // Always return success, even if email doesn't exist for security
      res.json({
        success: true,
        message:
          "If your email exists in our system, you will receive a password reset link shortly",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  validateResetToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        res.status(400).json({ error: "Token is required" });
        return;
      }

      const isValid = await new ValidateResetToken(
        this.passwordResetTokenRepository,
      ).execute(token);

      if (isValid) {
        res.json({ valid: true });
      } else {
        res
          .status(400)
          .json({ valid: false, error: "Invalid or expired token" });
      }
    } catch (error) {
      this.handleError(error, res);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, resetDTO] = ResetPasswordDTO.create(req.body);

      if (error) {
        res.status(400).json({ error });
        return;
      }

      await new ResetPassword(
        this.passwordResetTokenRepository,
        this.userRepository,
      ).execute(resetDTO!);

      res.json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
