import { AuthMethodEntity, OauthProvider } from "../../entities/authMethod.entity";

export class AuthMethodDTO {
  private constructor(
    public id: string,
    public userId: string,
    public provider: OauthProvider,
    public email?: string,
    public metadata?: Record<string, any>
  ) {}

  static create(entity: AuthMethodEntity): AuthMethodDTO {
    return new AuthMethodDTO(
      entity.id,
      entity.userId,
      entity.provider,
      entity.email,
      entity.metadata,
    );
  }
}