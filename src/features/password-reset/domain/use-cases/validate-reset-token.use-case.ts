// src/features/password-reset/domain/use-cases/validate-reset-token.use-case.ts
import { PasswordResetTokenRepository } from "../repositories/password-reset-token.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface ValidateResetTokenUseCase {
  execute(token: string): Promise<boolean>;
}

export class ValidateResetToken implements ValidateResetTokenUseCase {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
  ) {}

  async execute(token: string): Promise<boolean> {
    try {
      const resetToken =
        await this.passwordResetTokenRepository.findByToken(token);

      if (!resetToken) {
        return false;
      }

      if (resetToken.isUsed) {
        return false;
      }

      if (new Date() > resetToken.expiresAt) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error validating reset token");
    }
  }
}
