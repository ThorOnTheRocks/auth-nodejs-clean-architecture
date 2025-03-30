import {
  OauthMethodEntity,
  OauthProvider,
} from "../entities/oauthMethod.entity";
import { UserEntity } from "../../../auth/domain/entities/user.entity";
import { OauthProfileDTO } from "../dtos/oauth-profile.dto";

export interface OAuthProviderProfile {
  id: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

export abstract class OAuthRepository {
  abstract findOrCreateByOAuth(
    provider: OauthProvider,
    profile: OauthProfileDTO,
  ): Promise<UserEntity>;

  abstract linkOAuthToUser(
    userId: string,
    provider: OauthProvider,
    profile: OAuthProviderProfile,
  ): Promise<OauthMethodEntity>;

  abstract unlinkOAuthFromUser(
    userId: string,
    provider: OauthProvider,
  ): Promise<boolean>;

  abstract findAuthMethodsByUserId(
    userId: string,
  ): Promise<OauthMethodEntity[]>;
}
