import { EmailChangeTokenRepository } from "../repositories/email-change-token.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface GetPendingEmailChangeUseCase {
  execute(userId: string): Promise<{ newEmail: string } | null>;
}

export class GetPendingEmailChange implements GetPendingEmailChangeUseCase {
  constructor(
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
  ) {}

  async execute(userId: string): Promise<{ newEmail: string } | null> {
    try {
      const emailChangeToken =
        await this.emailChangeTokenRepository.findByUserId(userId);

      if (!emailChangeToken) {
        return null;
      }

      // Check if token is expired
      if (new Date() > emailChangeToken.expiresAt) {
        await this.emailChangeTokenRepository.deleteToken(emailChangeToken.id);
        return null;
      }

      return { newEmail: emailChangeToken.newEmail };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(
        "Error getting pending email change",
      );
    }
  }
}
