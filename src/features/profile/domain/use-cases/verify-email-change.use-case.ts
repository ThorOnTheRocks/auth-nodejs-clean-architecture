import { EmailChangeTokenRepository } from "../repositories/email-change-token.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { UserEntity } from "../../../auth/domain/entities/user.entity";

interface VerifyEmailChangeUseCase {
  execute(token: string): Promise<UserEntity>;
}

export class VerifyEmailChange implements VerifyEmailChangeUseCase {
  constructor(
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string): Promise<UserEntity> {
    try {
      // Find the token
      const emailChangeToken =
        await this.emailChangeTokenRepository.findByToken(token);

      if (!emailChangeToken) {
        throw CustomError.badRequest("Invalid or expired token");
      }

      // Check if token is expired
      if (new Date() > emailChangeToken.expiresAt) {
        await this.emailChangeTokenRepository.deleteToken(emailChangeToken.id);
        throw CustomError.badRequest("Email change token has expired");
      }

      // Get the user
      const user = await this.userRepository.findById(emailChangeToken.userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      // Check if current email still matches
      if (user.email !== emailChangeToken.currentEmail) {
        throw CustomError.badRequest(
          "User email has changed since the request",
        );
      }

      // Update the email
      user.email = emailChangeToken.newEmail;

      // Ensure the user is verified
      user.isVerified = true;

      // Save the updated user
      const updatedUser = await this.userRepository.updateUser(user);

      // Delete the token
      await this.emailChangeTokenRepository.deleteToken(emailChangeToken.id);

      return updatedUser;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error verifying email change");
    }
  }
}
