import { AuthMethodEntity } from "../entities/authMethod.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class OAuthRepository {
  abstract findOrCreateByOAuth(provider: string, profile: any): Promise<UserEntity>
  
  abstract linkOAuthToUser(userId: string, provider: string, profile: any): Promise<AuthMethodEntity>
  
  abstract unlinkOAuthFromUser(userId: string, provider: string): Promise<boolean>

  abstract findAuthMethodsByUserId(userId: string): Promise<AuthMethodEntity[]>
}