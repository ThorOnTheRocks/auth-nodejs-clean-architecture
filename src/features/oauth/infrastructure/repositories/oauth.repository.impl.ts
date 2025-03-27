import { OAuthDatasource } from "../../domain/datasources/oauth.datasource";
import { OauthProfileDTO } from "../../domain/dtos/oauth-profile.dto";
import { OauthMethodEntity } from "../../domain/entities/oauthMethod.entity";
import { UserEntity } from "../../../auth/domain/entities/user.entity";
import { OAuthRepository } from "../../domain/repositories/oauth.repository";

export class OAuthRepositoryImpl implements OAuthRepository {
  constructor(private readonly oauthDatasource: OAuthDatasource) {}

  async findOrCreateByOAuth(
    provider: string,
    profile: OauthProfileDTO,
  ): Promise<UserEntity> {
    return this.oauthDatasource.findOrCreateByOAuth(provider, profile);
  }

  async linkOAuthToUser(
    userId: string,
    provider: string,
    profile: {
      id: string;
      email?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<OauthMethodEntity> {
    return this.oauthDatasource.linkOAuthToUser(userId, provider, profile);
  }

  async unlinkOAuthFromUser(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    return this.oauthDatasource.unlinkOAuthFromUser(userId, provider);
  }

  async findAuthMethodsByUserId(userId: string): Promise<OauthMethodEntity[]> {
    return this.oauthDatasource.findAuthMethodsByUserId(userId);
  }
}
