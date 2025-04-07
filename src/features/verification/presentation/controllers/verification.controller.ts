import { Request, Response } from "express";
import { CustomError } from "../../../../domain/errors/errors";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { VerifyEmail } from "../../domain/use-cases/verify-email.use-case";
import { SendVerificationEmail } from "../../domain/use-cases/send-verification-email.use-case";

export class VerificationController {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
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

  verifyEmail = (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    new VerifyEmail(this.verificationTokenRepository, this.userRepository)
      .execute(token)
      .then(() => {
        res.json({
          success: true,
          message: "Email verified successfully",
        });
      })
      .catch((error) => this.handleError(error, res));
  };

  resendVerificationEmail = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    new SendVerificationEmail(
      this.verificationTokenRepository,
      this.emailRepository,
      this.userRepository,
    )
      .execute(userId)
      .then(() => {
        res.json({
          success: true,
          message: "Verification email sent",
        });
      })
      .catch((error) => this.handleError(error, res));
  };
}
