import { OauthMethodEntity } from "../entities/oauthMethod.entity";
import { UserEntity } from "../../../auth/domain/entities/user.entity";

export abstract class OAuthDatasource {
  abstract findOrCreateByOAuth(
    provider: string,
    profile: unknown,
  ): Promise<UserEntity>;

  abstract linkOAuthToUser(
    userId: string,
    provider: string,
    profile: unknown,
  ): Promise<OauthMethodEntity>;

  abstract unlinkOAuthFromUser(
    userId: string,
    provider: string,
  ): Promise<boolean>;

  abstract findAuthMethodsByUserId(
    userId: string,
  ): Promise<OauthMethodEntity[]>;
}
