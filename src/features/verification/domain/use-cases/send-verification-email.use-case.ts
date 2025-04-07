import { VerificationTokenRepository } from "../repositories/verification-token.repository";
import { EmailRepository } from "../../../email/domain/repositories/email.repository";
import { UserRepository } from "../../../auth/domain/repositories/user.repository";
import { CustomError } from "../../../../domain/errors/errors";
import { envs } from "../../../../config/envs";

interface SendVerificationEmailUseCase {
  execute(userId: string): Promise<boolean>;
}

export class SendVerificationEmail implements SendVerificationEmailUseCase {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly emailRepository: EmailRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<boolean> {
    try {
      // Get the user
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      if (user.isVerified) {
        throw CustomError.badRequest("Email is already verified");
      }

      // Create a verification token
      const verificationToken =
        await this.verificationTokenRepository.createToken(userId);

      // Build the verification URL
      const verificationUrl = `${envs.APP_URL}/verify-email?token=${verificationToken.token}`;

      // Send the email
      const result = await this.emailRepository.sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        html: `
          <h1>Verify Your Email Address</h1>
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't sign up for an account, you can safely ignore this email.</p>
        `,
      });

      return result.success;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Error sending verification email");
    }
  }
}
