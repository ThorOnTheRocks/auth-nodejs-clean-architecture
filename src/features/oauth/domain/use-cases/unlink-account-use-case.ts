import { CustomError } from "../../../../domain/errors/errors";
import { OAuthRepository } from "../repositories/oauth.repository";

interface UnlinkOAuthAccountUseCase {
  execute(userId: string, provider: string): Promise<boolean>;
}

export class UnlinkOAuthAccount implements UnlinkOAuthAccountUseCase {
  constructor(private readonly oauthRepository: OAuthRepository) {}

  async execute(userId: string, provider: string): Promise<boolean> {
    try {
      return await this.oauthRepository.unlinkOAuthFromUser(userId, provider);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to unlink OAuth account");
    }
  }
}
