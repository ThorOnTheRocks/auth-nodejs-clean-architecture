// src/features/password-reset/domain/use-cases/request-password-reset.use-case.ts
import { RequestPasswordResetDTO } from "../dtos/request-password-reset.dto";
import { PasswordResetTokenRepository } from "../repositories/password-reset-token.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { envs } from "../../../../config/envs";

interface RequestPasswordResetUseCase {
  execute(request: RequestPasswordResetDTO): Promise<boolean>;
}

export class RequestPasswordReset implements RequestPasswordResetUseCase {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly emailRepository: EmailRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: RequestPasswordResetDTO): Promise<boolean> {
    try {
      // Find user by email
      const users = await this.userRepository.findByEmail(request.email);

      // If no user found, we still return true for security reasons
      // This prevents email enumeration attacks
      if (!users || users.length === 0) {
        return true;
      }

      const user = users[0];

      // Create a password reset token
      await this.passwordResetTokenRepository.deleteAllUserTokens(user.id);
      const resetToken = await this.passwordResetTokenRepository.createToken(
        user.id,
      );

      // Build the reset URL
      const resetUrl = `${envs.APP_URL}/reset-password?token=${resetToken.token}`;

      // Send the email
      const result = await this.emailRepository.sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html: `
          <h1>Password Reset Request</h1>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        `,
      });

      return result.success;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error requesting password reset");
    }
  }
}
