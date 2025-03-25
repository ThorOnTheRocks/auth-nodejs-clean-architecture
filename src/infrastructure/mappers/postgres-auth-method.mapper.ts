import { AuthMethod } from "../../data/postgres/models/authMethod.model";
import { AuthMethodEntity } from "../../domain/entities/authMethod.entity";
import { CustomError } from "../../domain/errors/errors";

export class PostgresAuthMethodMapper {
  static toEntity(postgresAuthMethod: AuthMethod): AuthMethodEntity {
    const { id, userId, provider, email, metadata } = postgresAuthMethod;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!userId) throw CustomError.badRequest("Missing userId");
    if (!provider) throw CustomError.badRequest("Missing provider");

    return new AuthMethodEntity(id, userId, provider, email, metadata);
  }
}
