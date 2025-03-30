import { OauthProfileDTO } from "../dtos/oauth-profile.dto";
import { CustomError } from "../../../../domain/errors/errors";
import { OAuthRepository } from "../repositories/oauth.repository";
import { SignToken, UserToken } from "../../../../types";
import { OauthProvider } from "../entities/oauthMethod.entity";

interface OAuthAuthenticationUseCase {
  execute(
    provider: OauthProvider,
    profile: OauthProfileDTO,
  ): Promise<UserToken>;
}

export class OAuthAuthentication implements OAuthAuthenticationUseCase {
  constructor(
    private readonly oauthRepository: OAuthRepository,
    private readonly signToken: SignToken,
  ) {}

  async execute(
    provider: string,
    profile: OauthProfileDTO,
  ): Promise<UserToken> {
    try {
      // Validate that provider is a valid OauthProvider type
      if (!["local", "google", "github"].includes(provider)) {
        throw CustomError.badRequest(
          "Provider must be one of: local, google, github",
        );
      }

      const user = await this.oauthRepository.findOrCreateByOAuth(
        provider as OauthProvider,
        profile,
      );
      const token = await this.signToken({ id: user.id }, "2h");
      if (!token)
        throw CustomError.internalServerError("Error generating token");
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("OAuth authentication failed");
    }
  }
}
