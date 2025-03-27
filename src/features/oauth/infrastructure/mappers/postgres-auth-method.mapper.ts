import { AuthMethod } from "../../../../database/postgres/models/authMethod.model";
import { OauthMethodEntity } from "../../domain/entities/oauthMethod.entity";
import { CustomError } from "../../../../domain/errors/errors";

export class PostgresAuthMethodMapper {
  static toEntity(postgresAuthMethod: AuthMethod): OauthMethodEntity {
    const { id, userId, provider, email, metadata } = postgresAuthMethod;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!userId) throw CustomError.badRequest("Missing userId");
    if (!provider) throw CustomError.badRequest("Missing provider");

    return new OauthMethodEntity(id, userId, provider, email, metadata);
  }
}
