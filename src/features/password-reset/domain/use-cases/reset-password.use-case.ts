import { ResetPasswordDTO } from "../dtos/reset-password.dto";
import { PasswordResetTokenRepository } from "../repositories/password-reset-token.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { BcryptAdapter } from "../../../../config/bcrypt";

interface ResetPasswordUseCase {
  execute(resetPasswordDTO: ResetPasswordDTO): Promise<boolean>;
}

export class ResetPassword implements ResetPasswordUseCase {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly hashPassword: (
      password: string,
    ) => string = BcryptAdapter.hash,
  ) {}

  async execute(resetPasswordDTO: ResetPasswordDTO): Promise<boolean> {
    try {
      const resetToken = await this.passwordResetTokenRepository.findByToken(
        resetPasswordDTO.token,
      );

      if (!resetToken) {
        throw CustomError.badRequest("Invalid or expired reset token");
      }

      if (resetToken.isUsed) {
        throw CustomError.badRequest("Reset token has already been used");
      }

      if (new Date() > resetToken.expiresAt) {
        throw CustomError.badRequest("Reset token has expired");
      }

      // Get the user
      const user = await this.userRepository.findById(resetToken.userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      // Update the password
      user.password = this.hashPassword(resetPasswordDTO.newPassword);
      await this.userRepository.updateUser(user);

      // Mark the token as used
      await this.passwordResetTokenRepository.markTokenAsUsed(resetToken.id);

      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error resetting password");
    }
  }
}
