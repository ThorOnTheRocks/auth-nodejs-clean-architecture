import {
  OauthMethodEntity,
  OauthProvider,
} from "../entities/oauthMethod.entity";

export class OauthMethodDTO {
  private constructor(
    public id: string,
    public userId: string,
    public provider: OauthProvider,
    public email?: string,
    public metadata?: Record<string, any>,
  ) {}

  static create(entity: OauthMethodEntity): OauthMethodDTO {
    return new OauthMethodDTO(
      entity.id,
      entity.userId,
      entity.provider,
      entity.email,
      entity.metadata,
    );
  }
}
