import { VerificationTokenRepository } from "../repositories/verification-token.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";

interface VerifyEmailUseCase {
  execute(token: string): Promise<boolean>;
}

export class VerifyEmail implements VerifyEmailUseCase {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string): Promise<boolean> {
    try {
      // Find the token
      const verificationToken =
        await this.verificationTokenRepository.findByToken(token);

      if (!verificationToken) {
        throw CustomError.badRequest("Invalid or expired verification token");
      }

      // Check if token is expired
      if (new Date() > verificationToken.expiresAt) {
        await this.verificationTokenRepository.deleteToken(
          verificationToken.id,
        );
        throw CustomError.badRequest("Verification token has expired");
      }

      // Get the user
      const user = await this.userRepository.findById(verificationToken.userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      // Mark the user as verified
      user.isVerified = true;
      await this.userRepository.updateUser(user);

      // Delete the token
      await this.verificationTokenRepository.deleteToken(verificationToken.id);

      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error verifying email");
    }
  }
}
