import { CustomError } from "../../../../domain/errors/errors";
import { OAuthRepository } from "../repositories/oauth.repository";
import { OauthProvider } from "../entities/oauthMethod.entity";

interface UnlinkOAuthAccountUseCase {
  execute(userId: string, provider: string): Promise<boolean>;
}

export class UnlinkOAuthAccount implements UnlinkOAuthAccountUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(userId: string, provider: string): Promise<boolean> {
    try {
      if (!["local", "google", "github"].includes(provider)) {
        throw CustomError.badRequest(
          "Provider must be one of: local, google, github",
        );
      }

      return await this.oauthRepository.unlinkOAuthFromUser(
        userId,
        provider as OauthProvider,
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to unlink OAuth account");
    }
  }
}
