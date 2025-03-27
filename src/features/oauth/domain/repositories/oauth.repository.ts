import { OauthMethodEntity } from "../entities/oauthMethod.entity";
import { UserEntity } from "../../../auth/domain/entities/user.entity";

export abstract class OAuthRepository {
  abstract findOrCreateByOAuth(
    provider: string,
    profile: any,
  ): Promise<UserEntity>;

  abstract linkOAuthToUser(
    userId: string,
    provider: string,
    profile: any,
  ): Promise<OauthMethodEntity>;

  abstract unlinkOAuthFromUser(
    userId: string,
    provider: string,
  ): Promise<boolean>;

  abstract findAuthMethodsByUserId(
    userId: string,
  ): Promise<OauthMethodEntity[]>;
}
