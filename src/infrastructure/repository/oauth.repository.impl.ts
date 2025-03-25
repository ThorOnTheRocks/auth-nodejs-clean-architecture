import { OAuthDatasource } from "../../domain/datasources/oauth.datasource";
import { OauthProfileDTO } from "../../domain/dtos/auth/oauth-profile.dto";
import { AuthMethodEntity } from "../../domain/entities/authMethod.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { OAuthRepository } from "../../domain/repository/oauth.repository";

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
  ): Promise<AuthMethodEntity> {
    return this.oauthDatasource.linkOAuthToUser(userId, provider, profile);
  }

  async unlinkOAuthFromUser(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    return this.oauthDatasource.unlinkOAuthFromUser(userId, provider);
  }

  async findAuthMethodsByUserId(userId: string): Promise<AuthMethodEntity[]> {
    return this.oauthDatasource.findAuthMethodsByUserId(userId);
  }
}
