import { VerificationTokenEntity } from "../entities/verificationToken.entity";
import { VerificationTokenRepository } from "../repositories/verification-token.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface CreateVerificationTokenUseCase {
  execute(userId: string): Promise<VerificationTokenEntity>;
}

export class CreateVerificationToken implements CreateVerificationTokenUseCase {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute(userId: string): Promise<VerificationTokenEntity> {
    try {
      // Remove any existing tokens for this user
      await this.verificationTokenRepository.deleteAllUserTokens(userId);

      // Create a new verification token
      return await this.verificationTokenRepository.createToken(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(
        "Error creating verification token",
      );
    }
  }
}
