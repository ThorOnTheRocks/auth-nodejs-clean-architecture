import { UpdateProfileDTO } from "../dtos/update-profile.dto";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { EmailChangeTokenRepository } from "../repositories/email-change-token.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { UserEntity } from "../../../auth/domain/entities/user.entity";
import { envs } from "../../../../config/envs";

interface UpdateProfileUseCase {
  execute(updateProfileDTO: UpdateProfileDTO): Promise<UserEntity>;
}

export class UpdateProfile implements UpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailChangeTokenRepository: EmailChangeTokenRepository,
    private readonly emailRepository: EmailRepository,
  ) {}

  async execute(updateProfileDTO: UpdateProfileDTO): Promise<UserEntity> {
    try {
      // Get the user
      const user = await this.userRepository.findById(updateProfileDTO.userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      // Handle name update
      if (updateProfileDTO.name) {
        user.name = updateProfileDTO.name;
      }

      // Handle email update
      if (updateProfileDTO.email && updateProfileDTO.email !== user.email) {
        // Check if email is already in use
        const existingUsers = await this.userRepository.findByEmail(
          updateProfileDTO.email,
        );

        if (existingUsers.length > 0) {
          throw CustomError.badRequest("Email is already in use");
        }

        // Create email change token
        const emailChangeToken =
          await this.emailChangeTokenRepository.createToken(
            user.id,
            user.email,
            updateProfileDTO.email,
          );

        // Build verification URL
        const verificationUrl = `${envs.APP_URL}/verify-email-change?token=${emailChangeToken.token}`;

        // Send verification email
        await this.emailRepository.sendEmail({
          to: updateProfileDTO.email,
          subject: "Verify Your New Email Address",
          html: `
            <h1>Verify Your New Email Address</h1>
            <p>Hi ${user.name},</p>
            <p>We received a request to change your email address to this one. Please verify this new email address by clicking the link below:</p>
            <p><a href="${verificationUrl}">Verify New Email</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this change, you can safely ignore this email.</p>
          `,
        });

        // Return user without updating email yet
        return user;
      }

      // Update user if only name was changed
      if (updateProfileDTO.name) {
        return await this.userRepository.updateUser(user);
      }

      // Return user if no changes
      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error updating profile");
    }
  }
}
